/**
 * @Author SJK
 * @Time 2024/4/30 上午10:31
 * @File Parser.ts
 * @Description Token解析器
 */
import type Token from "./Token";
import {
    ASTNodeType,
    BINARY_OPERATOR_SET,
    BinaryOperatorType,
    KeyWordType,
    OPERATOR_PRECEDENCE,
    OperatorType,
    SeparatorType,
    TokenType,
    UNARY_OPERATOR_SET,
    UnaryOperatorType,
} from "./const";
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
import BooleanLiteral from "./ast/BooleanLiteral";
import UnaryExpression from "./ast/UnaryExpression";

export default class Parser {
    private _parseMap = {
        [TokenType.NUMBER]: this._parseNumber.bind(this),
        [TokenType.STRING]: this._parseString.bind(this),
        [TokenType.BOOLEAN]: this._parseBoolean.bind(this),
        [TokenType.IDENTIFIER]: this._parseIdentifier.bind(this),
        [TokenType.OPERATOR]: this._parseOperator.bind(this),
        [TokenType.KEYWORD]: this._parseKeyword.bind(this),
        [TokenType.SEPARATOR]: this._parseSeparator.bind(this),
        [TokenType.EOF]: null,
        [TokenType.UNKNOWN]: this._unknownParse.bind(this),
    };

    private readonly _tokens: readonly Token[];
    private _ast: Program = new Program();
    private _astNodeStack: ASTNode[] = [];
    private _operatorStack: Token[] = [];
    private _unaryOperatorStack: Token[] = [];
    private _tokenIndex: number = 0;

    get ast(): Readonly<typeof this._ast> {
        return this._ast;
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

    private _parseBoolean(token: Token) {
        this._astNodeStack.push(new BooleanLiteral(token.value as KeyWordType.TRUE | KeyWordType.FALSE));
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
        const lastToken: Token = this._tokens[this._tokenIndex - 1];
        if (
            UNARY_OPERATOR_SET.has(token.value as any) &&
            (!lastToken ||
                ![TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN, TokenType.IDENTIFIER].includes(lastToken.type))
        ) {
            this._unaryOperatorStack.push(token);
        } else if (BINARY_OPERATOR_SET.has(token.value as any)) {
            this._parseBinaryOperate(token);
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

    /**
     * 解析双目运算
     * @param token
     * @private
     */
    private _parseBinaryOperate(token: Token) {
        this._parseUnaryOperate();
        while (true) {
            if (this._operatorStack.length <= 0) {
                break;
            }
            const operator: Token = this._operatorStack[this._operatorStack.length - 1];
            type KOP = keyof typeof OPERATOR_PRECEDENCE;
            if (OPERATOR_PRECEDENCE[operator.value as KOP] < OPERATOR_PRECEDENCE[token.value as KOP]) {
                break;
            }
            this._operatorStack.pop();
            this._handleBinary(operator);
        }
        this._operatorStack.push(token);
    }

    private _parseUnaryOperate() {
        while (true) {
            if (this._unaryOperatorStack.length <= 0) {
                break;
            }
            const operator: Token = this._unaryOperatorStack.pop()!;
            const subNode: ASTNode = this._astNodeStack.pop()!;
            const unaryExpression: UnaryExpression = new UnaryExpression(operator.value as UnaryOperatorType, subNode);
            this._astNodeStack.push(unaryExpression);
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
        this._parseUnaryOperate();
        while (this._operatorStack.length > 0) {
            const operator = this._operatorStack.pop()!;
            this._handleBinary(operator);
        }
    }

    private _handleBinary(operator: Token) {
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
