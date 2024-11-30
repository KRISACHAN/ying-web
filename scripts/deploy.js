// @TODO: Add docker mode

const { exec } = require('child_process');
const path = require('path');

const apiServicePath = path.join(__dirname, '..', 'services', 'api-service');

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return reject(error);
            }
            console.log(`Standard output: ${stdout}`);
            if (stderr) {
                console.error(`Standard error: ${stderr}`);
            }
            resolve();
        });

        process.stdout.on('data', data => {
            console.log(data.toString());
        });
        process.stderr.on('data', data => {
            console.error(data.toString());
        });
    });
}

async function deploy() {
    try {
        console.log('Deploying @ying-web/api-service...');
        await runCommand('pnpm run pm2', apiServicePath);
        console.log('@ying-web/api-service deployed.');
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

deploy();
