import('inquirer').then(inquirerModule => {
    const inquirer = inquirerModule.default;
    const { spawn } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    const getProjects = dir => {
        return fs
            .readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                const packageJsonPath = path.join(
                    dir,
                    dirent.name,
                    'package.json',
                );
                if (fs.existsSync(packageJsonPath)) {
                    const packageJson = JSON.parse(
                        fs.readFileSync(packageJsonPath, 'utf8'),
                    );
                    return packageJson.name;
                }
                return null;
            })
            .filter(Boolean);
    };

    const apps = getProjects('./apps');
    const services = getProjects('./services');
    const choices = [...apps, ...services];

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'project',
                message: 'Which project to start?',
                choices,
            },
        ])
        .then(answers => {
            console.log(`Starting project: ${answers.project}...`);
            const child = spawn('turbo', ['dev', '--filter', answers.project], {
                stdio: 'inherit',
                shell: true,
            });

            child.on('error', error => {
                console.error(`Error: ${error.message}`);
            });

            child.on('close', code => {
                console.log(`Process exited with code ${code}`);
            });
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
});
