/**
 * @Author SJK
 * @Time 2024/4/29 下午3:37
 * @File index.ts
 * @Description pass
 */

import Lexer from "./Lexer";
import Parser from "./Parser";
import Generator from "./Generator";

((g: typeof globalThis) => {
    const input: string = "a >> def b;";
    console.log("input:\n%s", input);
    const lexer: Lexer = new Lexer(input);
    const parser: Parser = new Parser(lexer);
    parser.parse();
    console.log(JSON.stringify(parser.ast, null, 2));
    const generator: Generator = new Generator(parser);
    const output: string = generator.generate();
    console.log("\noutput:\n%s", output);
})(globalThis);