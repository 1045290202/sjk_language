/**
 * @Author SJK
 * @Time 2024/4/29 下午2:53
 * @File Lexer.ts
 * @Description 词法分析器
 */
import Token from "./Token";
import {
    END_OF_STATEMENT,
    KEY_WORD_SET,
    KeyWordType,
    OPERATOR_SET,
    OperatorType,
    SYMBOL_SET,
    TokenType,
    WHITESPACE_SET,
} from "./const";

export default class Lexer {
    
    private _pos: number = 0;
    private readonly _input: string | null = null;
    
    get curChar(): string {
        return this._input![this._pos];
    }
    
    constructor(input: string) {
        this._input = input;
    }
    
    advance() {
        this._pos++;
    }
    
    skipWhitespace() {
        while (this._isWhitespace()) {
            this.advance();
        }
    }
    
    integer() {
        let res: string = "";
        while (this._isDigit()) {
            res += this.curChar;
            this.advance();
        }
        return res;
    }
    
    identifier(): string | KeyWordType {
        let res: string = "";
        while (this._isLetter()) {
            res += this.curChar;
            this.advance();
        }
        return res;
    }
    
    keyWord(keyWord: KeyWordType): TokenType {
        if (!KEY_WORD_SET.has(keyWord)) {
            throw new SyntaxError(`Unknown keyword '${keyWord}'`);
        }
        return TokenType.KEYWORD;
    }
    
    symbol(): [TokenType, OperatorType | typeof END_OF_STATEMENT] {
        let res: string = "";
        while (this._isSymbol()) {
            res += this.curChar;
            this.advance();
        }
        if (res === END_OF_STATEMENT) {
            return [TokenType.EOS, res];
        }
        const type: TokenType = TokenType.OPERATOR;
        if (!OPERATOR_SET.has(res as any)) {
            throw new SyntaxError(`Unknown operator '${res}'`);
        }
        return [type, res as OperatorType];
    }
    
    getNextToken() {
        while (this.curChar != null) {
            if (this._isWhitespace()) {
                this.skipWhitespace();
                continue;
            }
            if (this._isDigit()) {
                return new Token(TokenType.INTEGER, this.integer());
            }
            if (this._isLetter()) {
                const str: string = this.identifier();
                if (this._isKeyWord(str)) {
                    return new Token(this.keyWord(str), str);
                }
                return new Token(TokenType.IDENTIFIER, str);
            }
            if (this._isSymbol()) {
                const [type, value] = this.symbol();
                return new Token(type, value);
            }
            throw new SyntaxError(`Unexpected character '${this.curChar}'`);
        }
        return new Token(TokenType.EOF, null);
    }
    
    private _isWhitespace(char: string | null = this.curChar) {
        return char != null && WHITESPACE_SET.has(char as any);
    }
    
    private _isDigit(char: string | null = this.curChar) {
        return char != null && char >= "0" && char <= "9";
    }
    
    private _isLetter(char: string | null = this.curChar) {
        return char != null && char >= "a" && char <= "z";
    }
    
    private _isKeyWord(char: string): char is KeyWordType {
        return char != null && KEY_WORD_SET.has(char as any);
    }
    
    private _isSymbol(char: string | null = this.curChar) {
        return char != null && SYMBOL_SET.has(char as any);
    }
    
}