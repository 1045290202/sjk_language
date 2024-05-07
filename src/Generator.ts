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
import StringLiteral from "./ast/StringLiteral";
import Dot from "./ast/Dot";
import Pipe from "./ast/Pipe";
import Block from "./ast/Block";
import Judgement from "./ast/Judgement";
import BooleanLiteral from "./ast/BooleanLiteral";

export default class Generator {
    // 生成方法的映射
    private _generateMethodMap = {
        [ASTNodeType.PROGRAM]: this._generateProgram.bind(this),
        [ASTNodeType.BINARY_EXPRESSION]: this._generateBinaryExpression.bind(this),
        [ASTNodeType.DEFINITION]: this._generateDefinition.bind(this),
        [ASTNodeType.ASSIGNMENT]: this._generateAssignment.bind(this),
        [ASTNodeType.IDENTIFIER]: this._generateIdentifier.bind(this),
        [ASTNodeType.NUMBER_LITERAL]: this._generateNumberLiteral.bind(this),
        [ASTNodeType.STRING_LITERAL]: this._generateStringLiteral.bind(this),
        [ASTNodeType.BOOLEAN_LITERAL]: this._generateBooleanLiteral.bind(this),
        [ASTNodeType.DOT]: this._generateDot.bind(this),
        [ASTNodeType.PIPE]: this._generatePipe.bind(this),
        [ASTNodeType.BLOCK]: this._generateBlock.bind(this),
        [ASTNodeType.JUDGEMENT]: this._generateJudgement.bind(this),
    } as const;

    private _parser: Parser;

    constructor(parser: Parser) {
        this._parser = parser;
    }

    generate(astNode: ASTNode = this._parser.ast): string {
        if (astNode.type in this._generateMethodMap) {
            return this._generateMethodMap[astNode.type](astNode as any);
        }
        return this._unknownGenerate(astNode);
    }

    /**
     * 生成程序
     * @param node
     * @private
     */
    private _generateProgram(node: Program) {
        let res: string = "";
        for (let i = 0; i < node.body.length; i++) {
            const subNode: ASTNode = node.body[i];
            let subRes: string = this.generate(subNode);
            if (subNode.type === ASTNodeType.BLOCK) {
                res += subRes;
                continue;
            }
            res += `${subRes};`;
        }
        return res;
    }

    /**
     * 生成双目运算
     * @param node
     * @private
     */
    private _generateBinaryExpression(node: BinaryExpression) {
        // switch (node.operator) {
        //     default: {
        return `${this.generate(node.left)} ${OPERATOR_TO_JS_OPERATOR[node.operator]} ${this.generate(node.right)}`;
        //     }
        // }
    }

    /**
     * 生成定义
     * @param node
     * @private
     */
    private _generateDefinition(node: Definition) {
        if (!node.identifier) {
            throw new SyntaxError("Missing identifier");
        }
        return `let ${node.identifier.name}`;
    }

    /**
     * 生成赋值
     * @param node
     * @private
     */
    private _generateAssignment(node: Assignment) {
        return `${this.generate(node.targetNode)} = ${this.generate(node.valueNode)}`;
    }

    /**
     * 生成数字
     * @param node
     * @private
     */
    private _generateNumberLiteral(node: NumberLiteral) {
        return node.value;
    }

    /**
     * 生成字符串
     * @param node
     * @private
     */
    private _generateStringLiteral(node: StringLiteral) {
        return `"${node.value}"`;
    }

    /**
     * 生成布尔值
     * @param node
     * @private
     */
    private _generateBooleanLiteral(node: BooleanLiteral) {
        return `${node.value}`;
    }

    /**
     * 生成标识符
     * @param node
     * @private
     */
    private _generateIdentifier(node: Identifier) {
        return node.name;
    }

    /**
     * 生成点
     * @param node
     * @private
     */
    private _generateDot(node: Dot) {
        if (!node.parentNode) {
            throw new SyntaxError("There must be an identifier before the dot");
        }
        if (!node.childNode) {
            throw new SyntaxError("There must be an identifier after the dot");
        }
        return `${this.generate(node.parentNode)}.${this.generate(node.childNode)}`;
    }

    /**
     * 生成管道
     * @param node
     * @private
     */
    private _generatePipe(node: Pipe) {
        if (!node.left) {
            return `${this.generate(node.right)}()`;
        }
        return `${this.generate(node.right)}(${this.generate(node.left)})`;
    }

    /**
     * 生成块
     * @param node
     * @private
     */
    private _generateBlock(node: Block) {
        let res: string = "{";
        for (let i: number = 0; i < node.body.length; i++) {
            const subNode: ASTNode = node.body[i];
            let subRes: string = this.generate(subNode);
            if (subNode.type === ASTNodeType.BLOCK) {
                res += subRes;
                continue;
            }
            res += `${subRes};`;
        }
        return `${res}}`;
    }

    /**
     * 生成判断
     * @param node
     * @private
     */
    private _generateJudgement(node: Judgement) {
        return "";
    }

    /**
     * 未知生成
     * @param node
     * @private
     */
    private _unknownGenerate(node: ASTNode): string {
        throw new SyntaxError(`Unknown ast node type '${node.type}'`);
    }
}
