/**
 * @Author SJK
 * @Time 2024/4/29 下午3:37
 * @File index.ts
 * @Description pass
 */

import Lexer from "./Lexer";
import Parser from "./Parser";
import Generator from "./Generator";
import * as fs from "node:fs";

(async (_: typeof globalThis) => {
    const sourceFilePath = process.argv[process.argv.length - 1];
    if (!sourceFilePath) {
        console.error("Please specify source file");
        process.exit(1);
    }

    const input: string = await readSourceFile(sourceFilePath);
    console.log("input:\n%s", input);
    const lexer: Lexer = new Lexer(input);
    lexer.lex();
    // console.log(JSON.stringify(lexer.tokens, null, 2));
    const parser: Parser = new Parser(lexer.tokens);
    parser.parse();
    // console.log(JSON.stringify(parser.ast, null, 2));
    const generator: Generator = new Generator(parser);
    const output: string = generator.generate();
    console.log("\noutput:\n%s", output);

    console.log("\nrun js:");
    eval(output);
})(globalThis);

async function readSourceFile(filePath: string) {
    let content: string = "";
    await new Promise<void>((resolve) => {
        // 流式读取
        const stream = fs.createReadStream(filePath);
        stream.on("data", (chunk) => {
            content += chunk;
        });
        stream.on("error", (err) => {
            throw err;
        });
        stream.on("end", () => {
            resolve();
        });
    });
    return content;
}
