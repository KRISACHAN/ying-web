module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // ✨ New features - Something new and shiny!
                'fix', // 🐛 Bug fixes - Squashing those pesky bugs
                'docs', // 📚 Documentation - Making things clearer
                'style', // 💅 Styling - Making it pretty
                'refactor', // ♻️ Code refactoring - Same result, better code
                'perf', // ⚡️ Performance - Speed it up!
                'test', // 🧪 Testing - Because we love reliable code
                'chore', // 🔧 Chores - Maintenance and updates
                'revert', // ⏪ Reverts - Oops, let's go back
            ],
        ],
    },
};
