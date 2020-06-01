module.exports = {
    root: true,
    parserOptions: {
        sourceType: "module",
        parser: "@typescript-eslint/parser"
    },
    plugins: [
        "vue"
    ],
    env: {
        node: true
    },
    "extends": [
        "plugin:vue/essential",
        "@vue/standard",
        "@vue/typescript"
    ],
    rules: {
        "import/extensions": ["error", "always", {
            js: "never",
            vue: "never",
            ts: "never"
        }],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "semi": ["off", "never"], // 行尾不使用分号
        "eqeqeq": 2, // 不需要强制使用全等
        "indent": [2, 4], // 强制使用一致的缩进
        "quotes": [2, "double", { "allowTemplateLiterals": true, "avoidEscape": true }], // 字符串使用双引号
        "radix": 0,// parseInt不需要传第二个参数
        "consistent-return": 2, // 箭头函数最后不需要最后强制return值
        "space-before-function-paren": 0,
        "import/extensions": 0,
        "no-console": 1,
        "consistent-return": 0 // 函数必须要有return
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)"
            ],
            env: {
                mocha: true
            }
        }
    ]
}
