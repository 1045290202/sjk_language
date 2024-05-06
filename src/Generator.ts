/**
 * @Author SJK
 * @Time 2024/4/30 下午2:03
 * @File Generator.ts
 * @Description 生成器
 */
import ASTNode from "./ast/ASTNode";
import Parser from "./Parser";
import { ASTNodeType, OPERATOR_TO_JS_OPERATOR } from "./const";
import Program from "./ast/Program";
import BinaryExpression from "./ast/BinaryExpression";
import Definition from "./ast/Definition";
import Assignment from "./ast/Assignment";
import NumberLiteral from "./ast/NumberLiteral";
import Identifier from "./ast/Identifier";

export default class Generator {
    private _parser: Parser;
    
    constructor(parser: Parser) {
        this._parser = parser;
    }
    
    generate(astNode: ASTNode = this._parser.ast): string {
        switch (astNode.type) {
            case ASTNodeType.PROGRAM: {
                const node: Program = astNode as Program;
                return node.body.map(this.generate.bind(this)).join("");
            }
            case ASTNodeType.BINARY_EXPRESSION: {
                const node: BinaryExpression = astNode as BinaryExpression;
                return `${this.generate(node.left)} ${OPERATOR_TO_JS_OPERATOR[node.operator]} ${this.generate(node.right)}`;
            }
            case ASTNodeType.DEFINITION: {
                const node: Definition = astNode as Definition;
                if (!node.identifier) {
                    throw new SyntaxError("Missing identifier");
                }
                return `let ${node.identifier.name}`;
            }
            case ASTNodeType.ASSIGNMENT: {
                const node: Assignment = astNode as Assignment;
                return `${this.generate(node.targetNode)} = ${this.generate(node.valueNode)}`;
            }
            case ASTNodeType.NUMBER_LITERAL: {
                const node: NumberLiteral = astNode as NumberLiteral;
                return node.value;
            }
            case ASTNodeType.END: {
                return ";";
            }
            case ASTNodeType.IDENTIFIER: {
                const node: Identifier = astNode as Identifier;
                return `${node.name}`;
            }
            default: {
                throw new SyntaxError(`Unknown ast node type '${astNode.type}'`);
            }
        }
    }
    
    /**
     * 生成Program
     * @param node
     * @private
     */
    private _generateProgram(node: Program) {
        return node.body.map(this.generate.bind(this)).join("");
    }
    
    
}