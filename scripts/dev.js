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
            .filter(Boolean); // 过滤掉不存在 package.json 或 name 字段为空的目录
    };

    const apps = getProjects('./apps');
    const services = getProjects('./services');
    const choices = [...apps, ...services];

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'project',
                message: '请选择你想要启动的项目:',
                choices,
            },
        ])
        .then(answers => {
            console.log(`正在启动项目: ${answers.project}...`);
            const child = spawn('turbo', ['dev', '--filter', answers.project], {
                stdio: 'inherit',
                shell: true,
            });

            child.on('error', error => {
                console.error(`执行的错误: ${error.message}`);
            });

            child.on('close', code => {
                console.log(`子进程退出，退出码 ${code}`);
            });
        })
        .catch(error => {
            console.error('发生错误:', error.message);
        });
});
