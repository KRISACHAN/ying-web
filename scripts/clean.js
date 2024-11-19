// @TODO: Use rimraf instead
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')

const directoriesToClean = [
    '.turbo',
    'node_modules',
    '.output',
    'dist-app',
    'dist',
    '.next',
    'out',
    'pm2_logs',
    'docs',
    'coverage',
]

async function cleanDirectory(dirPath) {
    for (const dirToClean of directoriesToClean) {
        const fullPath = path.join(dirPath, dirToClean)
        try {
            await fsp.rm(fullPath, { recursive: true, force: true })
            console.log(`Successfully cleaned ${fullPath}`)
        } catch (err) {
            console.error(`Error removing ${fullPath}:`, err)
        }
    }
}

async function cleanSubprojects(parentDir) {
    try {
        const subDirs = fs
            .readdirSync(parentDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => path.join(parentDir, dirent.name))

        for (const dir of subDirs) {
            await cleanDirectory(dir)
            await cleanSubprojects(dir)
        }
    } catch (err) {
        console.error(`Error reading directory ${parentDir}:`, err)
    }
}

async function main() {
    console.log('Starting clean up process...')

    await cleanDirectory(process.cwd())

    await cleanSubprojects(path.join(process.cwd(), 'apps'))
    await cleanSubprojects(path.join(process.cwd(), 'packages'))
    await cleanSubprojects(path.join(process.cwd(), 'services'))

    console.log('Clean up completed.')
}

main().catch((err) => console.error('Error during clean up:', err))
