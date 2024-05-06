/**
 * @Author SJK
 * @Time 2024/4/30 上午10:31
 * @File Parser.ts
 * @Description Token解析器
 */
import type Token from "./Token";
import { ASTNodeType, BINARY_OPERATOR_SET, BinaryOperatorType, TokenType } from "./const";
import Lexer from "./Lexer";
import Program from "./ast/Program";
import NumberLiteral from "./ast/NumberLiteral";
import ASTNode from "./ast/ASTNode";
import Identifier from "./ast/Identifier";
import BinaryExpression from "./ast/BinaryExpression";
import Assignment from "./ast/Assignment";
import Definition from "./ast/Definition";
import Eos from "./ast/Eos";

export default class Parser {
    private _tokens: Token[] = [];
    private _current: number = 0;
    private _ast: Program = new Program();
    private _astNodeStack: ASTNode[] = [];
    private _operatorStack: Token[] = [];
    
    get ast(): Readonly<typeof this._ast> {
        return this._ast;
    }
    
    get token(): Token {
        return this._tokens[this._current];
    }
    
    constructor(lexer: Lexer) {
        do {
            const token = lexer.getNextToken();
            if (token.type === TokenType.EOF) {
                break;
            }
            this._tokens.push(token);
        } while (true);
        
        // while (this._current < this._tokens.length) {
        //     this._ast.body.push(this.walk());
        // }
    }
    
    advance() {
        this._current++;
        return this.token;
    }
    
    parse() {
        this._tokens.forEach(token => {
            switch (token.type) {
                case TokenType.INTEGER: {
                    this._astNodeStack.push(new NumberLiteral(token.value!));
                    break;
                }
                case TokenType.IDENTIFIER: {
                    const before = this._astNodeStack[this._astNodeStack.length - 1];
                    if (before && (before.type === ASTNodeType.DEFINITION)) {
                        (before as Definition).identifier = new Identifier(token.value!);
                    } else {
                        this._astNodeStack.push(new Identifier(token.value!));
                    }
                    break;
                }
                case TokenType.OPERATOR: {
                    this._handleOperator();
                    if (BINARY_OPERATOR_SET.has(token.value as any)) {
                        // 双目运算符
                        this._operatorStack.push(token);
                    } else {
                        // 弹幕运算符
                    }
                    break;
                }
                case TokenType.KEYWORD: {
                    this._astNodeStack.push(new Definition(null));
                    break;
                }
                // case TokenType.EOS: {
                //     this._astNodeStack.push(new Eos());
                //     break;
                // }
            }
        });
        
        this._handleOperator();
        this._ast.body.push(...this._astNodeStack);
        
        return this._ast;
    }
    
    private _handleOperator() {
        while (this._operatorStack.length > 0) {
            const operator = this._operatorStack.pop()!;
            const right = this._astNodeStack.pop()!;
            const left = this._astNodeStack.pop()!;
            if (operator.value === BinaryOperatorType.ASSIGN) {
                this._astNodeStack.push(new Assignment(left, right));
            } else {
                this._astNodeStack.push(new BinaryExpression(left, operator.value as any, right));
            }
        }
    }
    
    walk(): ASTNode {
        const token = this.token;
        switch (token.type) {
            case TokenType.INTEGER: {
                const node = new NumberLiteral(token.value!);
                this.advance();
                return node;
            }
            default: {
                throw new Error(`Unexpected token: ${token.type}`);
            }
        }
    }
    
}