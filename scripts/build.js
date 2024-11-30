const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Select } = require('enquirer');

const projectGroups = ['apps', 'packages', 'services'];

function getSubprojects(dir) {
    try {
        return fs
            .readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => ({
                name: dirent.name,
                path: path.join(dir, dirent.name),
            }))
            .map(subdir => {
                try {
                    const packageJson = JSON.parse(
                        fs.readFileSync(
                            path.join(subdir.path, 'package.json'),
                            'utf8',
                        ),
                    );
                    return {
                        name: packageJson.name,
                        path: subdir.path,
                        group: dir.replace('./', ''),
                    };
                } catch (error) {
                    console.error(
                        `Error reading package.json from ${subdir.path}:`,
                        error,
                    );
                    return null;
                }
            })
            .filter(Boolean);
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
        return [];
    }
}

async function selectBuildTarget() {
    // First, choose between all, group, or single project
    const modePrompt = new Select({
        name: 'mode',
        message: 'What would you like to build?',
        choices: [
            { name: 'all', message: 'All projects', hint: 'Build everything' },
            {
                name: 'group',
                message: 'Project group',
                hint: 'Build all in a directory',
            },
            {
                name: 'single',
                message: 'Single project',
                hint: 'Build one project',
            },
        ],
    });

    const mode = await modePrompt.run();

    if (mode === 'all') {
        return { type: 'all' };
    }

    if (mode === 'group') {
        const groupPrompt = new Select({
            name: 'group',
            message: 'Select a project group',
            choices: projectGroups.map(group => ({
                name: group,
                message: group,
                hint: `Build all ${group}`,
            })),
        });
        const group = await groupPrompt.run();
        return { type: 'group', target: group };
    }

    // Get all projects for selection
    const allProjects = projectGroups.reduce((acc, group) => {
        const projects = getSubprojects(`./${group}`);
        return [...acc, ...projects];
    }, []);

    const projectPrompt = new Select({
        name: 'project',
        message: 'Select a project to build',
        choices: allProjects.map(proj => ({
            name: proj.name,
            message: proj.name,
            hint: `(${proj.group}/${path.basename(proj.path)})`,
        })),
    });

    const project = await projectPrompt.run();
    return { type: 'single', target: project };
}

async function buildTarget(selection) {
    let command = [];
    let displayName = '';

    switch (selection.type) {
        case 'all':
            command = ['run', 'build'];
            displayName = 'all projects';
            break;
        case 'group':
            command = ['run', 'build', `--filter=./${selection.target}/...`];
            displayName = `${selection.target} projects`;
            break;
        case 'single':
            command = ['run', 'build', `--filter=${selection.target}`];
            displayName = selection.target;
            break;
    }

    console.log(`\n🏗️  Building ${displayName}...`);

    const buildProcess = spawn('turbo', command, {
        stdio: 'inherit',
        shell: true,
    });

    return new Promise((resolve, reject) => {
        buildProcess.on('error', error => {
            console.error('❌ Build error:', error);
            reject(error);
        });

        buildProcess.on('close', code => {
            if (code === 0) {
                console.log(`\n✅ Successfully built ${displayName}`);
                resolve();
            } else {
                console.error(`\n❌ Build failed with code ${code}`);
                reject(new Error(`Build failed with code ${code}`));
            }
        });
    });
}

async function main() {
    try {
        console.log('🚀 @ying-web Build Script');
        console.log('=======================');

        const selection = await selectBuildTarget();
        await buildTarget(selection);

        console.log('\n🎉 Build process completed!');
    } catch (error) {
        console.error('\n💥 Error:', error.message);
        process.exit(1);
    }
}

main();
