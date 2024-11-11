const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

// 定义需要清除的目录列表
const directoriesToClean = ['.turbo', 'node_modules', '.output', 'dist-app', 'dist', '.next', 'out', 'pm2_logs'];

// 清除指定目录
async function cleanDirectory(dirPath) {
    for (const dirToClean of directoriesToClean) {
        const fullPath = path.join(dirPath, dirToClean);
        try {
            await fsp.rm(fullPath, { recursive: true, force: true });
            console.log(`Successfully cleaned ${fullPath}`);
        } catch (err) {
            console.error(`Error removing ${fullPath}:`, err);
        }
    }
}

// 递归清除指定目录下所有子项目的指定文件夹
async function cleanSubprojects(parentDir) {
    try {
        const subDirs = fs
            .readdirSync(parentDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(parentDir, dirent.name));

        for (const dir of subDirs) {
            await cleanDirectory(dir);
            // Additionally, clean subdirectories recursively if needed
            await cleanSubprojects(dir);
        }
    } catch (err) {
        console.error(`Error reading directory ${parentDir}:`, err);
    }
}

// 主函数
async function main() {
    console.log('Starting clean up process...');

    // 清除根目录下的指定文件夹
    await cleanDirectory(process.cwd());

    // 清除 apps、packages、services 下的子项目
    await cleanSubprojects(path.join(process.cwd(), 'apps'));
    await cleanSubprojects(path.join(process.cwd(), 'packages'));
    await cleanSubprojects(path.join(process.cwd(), 'services'));

    console.log('Clean up completed.');
}

main().catch(err => console.error('Error during clean up:', err));
