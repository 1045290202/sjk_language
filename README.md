# SJK编程语言

***当前仅为demo阶段！！！***

*自己写着玩，随时弃坑*

## 如何使用
1. 克隆到本地
2. 在命令行中定位到本地项目的目录中
3. 执行`npm install`
4. 执行`npm run build`
5. 执行`node dist/index.js [sjk代码文件路径]`，将sjk代码转换成js（暂时不能直接执行）

## 测试
1. 【可选】修改`tests/test.sjk`的内容
2. 执行`npm run test`
3. 查看打印

## 理念
+ 在sjk语言中，一切以数据流向为基础，比如把`1`赋值给`value`，再打印`value + 1`的值：`1 >> def value; value + 1 -> console.log;`
+ `def`表示定义
+ `>>`代表赋值
+ `->`表示管道运算符，可以理解成将数据传递给函数并调用

## 实现步骤
1. 词法分析
2. 语法分析
3. 目标js代码生成

## Wiki
[Wiki](https://github.com/1045290202/sjk_language/wiki)

---

*待补充……*
