# Three.js + Vue
[Three.js中文网](http://www.webgl3d.cn/)
[Three.js电子书](http://www.webgl3d.cn/)


# eslint配置
```js
  /* package.json */
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "@vue/standard"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    "rules": {
       "indent": "off", // 不检查缩进
       "space-before-function-paren": "off" // 不检查function名字浅口空格
    },
    "overrides": [
      {
        "files": [
          "**/__tests__/*.{j,t}s?(x)",
          "**/tests/unit/**/*.spec.{j,t}s?(x)"
        ],
        "env": {
          "jest": true
        }
      }
    ]
  }
```