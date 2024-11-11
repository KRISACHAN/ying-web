const { exec } = require("child_process");
const path = require("path");

// 定义要执行命令的项目路径
// const blogViewPath = path.join(__dirname, "..", "apps", "ying-blog-view");
const apiServicePath = path.join(
    __dirname,
    "..",
    "services",
    "ying-api-service"
);

// 定义一个函数来执行命令
function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行出错: ${error}`);
                return reject(error);
            }
            console.log(`标准输出: ${stdout}`);
            if (stderr) {
                console.error(`标准错误: ${stderr}`);
            }
            resolve();
        });

        // 打印子进程的输出到控制台
        process.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        process.stderr.on("data", (data) => {
            console.error(data.toString());
        });
    });
}

// 顺序执行命令
async function deploy() {
    try {
        // console.log("开始部署 ying-blog-view...");
        // await runCommand("pnpm run pm2", blogViewPath);
        // console.log("ying-blog-view 部署完成.");

        console.log("开始部署 ying-api-service...");
        await runCommand("pnpm run pm2", apiServicePath);
        console.log("ying-api-service 部署完成.");
    } catch (error) {
        console.error("部署过程中发生错误:", error);
    }
}

// 执行部署函数
deploy();
