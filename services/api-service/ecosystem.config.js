// Document: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
    apps: [
        {
            name: 'ying-service',
            script: 'dist-app/index.js',
            cwd: './',
            args: '',
            interpreter: '',
            interpreter_args: '',
            watch: true,
            ignore_watch: ['node_modules', 'logs', 'pm2_logs'],
            error_file: './pm2_logs/app-err.log',
            out_file: './pm2_logs/app-out.log',
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            min_uptime: '60s',
            max_restarts: 10,
            autorestart: true,
            cron_restart: '',
            restart_delay: 60000,
        },
    ],

    deploy: {
        production: {
            'post-deploy': 'yarn && pm2 reload ecosystem.config.js',
        },
    },
};