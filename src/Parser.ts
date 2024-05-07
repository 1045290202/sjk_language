/**
 * @Author SJK
 * @Time 2024/4/30 上午10:31
 * @File Parser.ts
 * @Description Token解析器
 */
import type Token from "./Token";
import { ASTNodeType, BINARY_OPERATOR_SET, BinaryOperatorType, OperatorType, SeparatorType, TokenType } from "./const";
import Program from "./ast/Program";
import NumberLiteral from "./ast/NumberLiteral";
import ASTNode from "./ast/ASTNode";
import Identifier from "./ast/Identifier";
import BinaryExpression from "./ast/BinaryExpression";
import Assignment from "./ast/Assignment";
import Definition from "./ast/Definition";
import StringLiteral from "./ast/StringLiteral";
import Dot from "./ast/Dot";
import Pipe from "./ast/Pipe";
import Block from "./ast/Block";

export default class Parser {
    private _parseMap = {
        [TokenType.NUMBER]: this._parseNumber.bind(this),
        [TokenType.STRING]: this._parseString.bind(this),
        [TokenType.IDENTIFIER]: this._parseIdentifier.bind(this),
        [TokenType.OPERATOR]: this._parseOperator.bind(this),
        [TokenType.KEYWORD]: this._parseKeyword.bind(this),
        [TokenType.SEPARATOR]: this._parseSeparator.bind(this),
        [TokenType.EOF]: null,
        [TokenType.UNKNOWN]: this._unknownParse.bind(this),
    };

    private _tokens: readonly Token[];
    private _ast: Program = new Program();
    private _astNodeStack: ASTNode[] = [];
    private _operatorStack: Token[] = [];
    private _tokenIndex: number = 0;

    get ast(): Readonly<typeof this._ast> {
        return this._ast;
    }

    get tokenIndex(): number {
        return this._tokenIndex;
    }

    constructor(tokens: readonly Token[]) {
        this._tokens = tokens;
    }

    parse() {
        for (this._tokenIndex = 0; this._tokenIndex < this._tokens.length; this._tokenIndex++) {
            const token: Token = this._tokens[this._tokenIndex];
            this._parseMap[token.type]?.(token);
        }

        this._handleOperator();
        this._ast.body.push(...this._astNodeStack);

        return this._ast;
    }

    private _parseNumber(token: Token) {
        this._astNodeStack.push(new NumberLiteral(token.value!));
    }

    private _parseString(token: Token) {
        this._astNodeStack.push(new StringLiteral(token.value!));
    }

    private _parseIdentifier(token: Token) {
        const before: ASTNode = this._astNodeStack[this._astNodeStack.length - 1];
        if (!before) {
            this._astNodeStack.push(new Identifier(token.value!));
            return;
        }

        const identifier: Identifier = new Identifier(token.value!);
        switch (before.type) {
            case ASTNodeType.DEFINITION: {
                (before as Definition).identifier = identifier;
                break;
            }
            case ASTNodeType.DOT: {
                (before as Dot).childNode = identifier;
                break;
            }
            default: {
                this._astNodeStack.push(identifier);
            }
        }
    }

    private _parseOperator(token: Token) {
        if (BINARY_OPERATOR_SET.has(token.value as any)) {
            // 双目运算符
            this._handleOperator();
            this._operatorStack.push(token);
        } else if (token.value === OperatorType.DOT) {
            const before: ASTNode = this._astNodeStack[this._astNodeStack.length - 1];
            const dot: Dot = new Dot();
            if (!before) {
                this._handleOperator();
                this._astNodeStack.push(dot);
            }
            if (before.type === ASTNodeType.IDENTIFIER || before.type === ASTNodeType.DOT) {
                dot.parentNode = before as Identifier | Dot;
                this._astNodeStack.pop();
            } else {
                this._handleOperator();
            }
            this._astNodeStack.push(dot);
        } else if (token.value === OperatorType.PIPE) {
            this._handleOperator();
            this._operatorStack.push(token);
        } else {
            this._handleOperator();
        }
    }

    private _parseKeyword(_: Token) {
        this._astNodeStack.push(new Definition(null));
    }

    private _parseSeparator(token: Token) {
        switch (token.value) {
            case SeparatorType.SEMICOLON: {
                this._handleOperator();
                break;
            }
            case SeparatorType.LEFT_BRACE: {
                this._handleBlock();
                break;
            }
            case SeparatorType.RIGHT_BRACE: {
                throw new SyntaxError("Unexpected '}'");
            }
        }
    }

    private _unknownParse(token: Token) {
        throw new SyntaxError(`Unknown token type '${token.type}'`);
    }

    private _handleOperator() {
        while (this._operatorStack.length > 0) {
            const operator = this._operatorStack.pop()!;
            const right = this._astNodeStack.pop()!;
            const left = this._astNodeStack.pop()!;
            switch (operator.value) {
                case OperatorType.PIPE: {
                    this._astNodeStack.push(new Pipe(left, right));
                    break;
                }
                case BinaryOperatorType.ASSIGN: {
                    this._astNodeStack.push(new Assignment(left, right));
                    break;
                }
                default: {
                    this._astNodeStack.push(new BinaryExpression(left, operator.value as any, right));
                    break;
                }
            }
        }
    }

    private _handleBlock() {
        const subTokens: Token[] = [];
        let unpairedLeftBrace: number = 1;
        while (true) {
            const token: Token = this._tokens[++this._tokenIndex];
            if (!token) {
                if (unpairedLeftBrace !== 0) {
                    throw new SyntaxError("Missing '}'");
                }
                break;
            }
            if (token.type === TokenType.SEPARATOR) {
                if (token.value === SeparatorType.RIGHT_BRACE) {
                    unpairedLeftBrace--;
                } else if (token.value === SeparatorType.LEFT_BRACE) {
                    unpairedLeftBrace++;
                }
            }
            if (unpairedLeftBrace === 0) {
                break;
            }
            subTokens.push(token);
        }
        const subParser = new Parser(subTokens);
        subParser.parse();
        const block = new Block();
        block.body = subParser.ast.body;
        this._astNodeStack.push(block);
    }
}
