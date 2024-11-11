const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取指定目录下所有子项目的路径
function getSubprojects(dir) {
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(dir, dirent.name))
        .map(subdir => {
            // 尝试读取每个子目录的 package.json 来确定项目名称
            try {
                const packageJson = JSON.parse(
                    fs.readFileSync(path.join(subdir, 'package.json'), 'utf8'),
                );
                return packageJson.name;
            } catch (error) {
                console.error(
                    `Error reading package.json from ${subdir}:`,
                    error,
                );
                return null;
            }
        })
        .filter(Boolean); // 过滤掉无法读取 package.json 的目录
}

// 构建项目
function buildProjects(projects) {
    projects.forEach(project => {
        console.log(`Building project: ${project}`);
        const buildProcess = spawn(
            'pnpm',
            ['turbo', 'build', '--filter', project],
            { stdio: 'inherit', shell: true },
        );

        buildProcess.on('error', error => {
            console.error(`Error building project ${project}:`, error);
        });

        buildProcess.on('close', code => {
            console.log(
                `Finished building project ${project} with exit code ${code}`,
            );
        });
    });
}

// 主函数
async function main() {
    const apps = getSubprojects('./apps');
    const packages = getSubprojects('./packages');
    const services = getSubprojects('./services');

    const allProjects = [...apps, ...packages, ...services];
    console.log('All projects to build:', allProjects); // 添加调试输出
    buildProjects(allProjects);
}

main().catch(err => console.error(err));