/**
 * @Author SJK
 * @Time 2024/4/29 下午2:53
 * @File Lexer.ts
 * @Description 词法分析器
 */
import Token from "./Token";
import {
    KEY_WORD_SET,
    KeyWordType,
    OPERATOR_SET,
    OperatorType,
    SEPARATOR_SET,
    SeparatorType,
    SYMBOL_SET,
    SymbolType,
    TokenType,
    WHITESPACE_SET,
} from "./const";

export default class Lexer {
    private _pos: number = 0;
    private _tokens: Token[] = [];
    private readonly _input: string | null = null;

    get curChar(): string | null {
        const codePoint = this._input?.codePointAt(this._pos);
        if (codePoint == null) {
            return null;
        }
        return String.fromCodePoint(codePoint);
    }

    get tokens(): readonly Token[] {
        return this._tokens;
    }

    constructor(input: string) {
        this._input = input;
    }

    /**
     * 词法分析
     */
    lex() {
        do {
            const token = this.getNextToken();
            if (token.type === TokenType.EOF) {
                break;
            }
            this._tokens.push(token);
        } while (true);
    }

    advance() {
        this._pos++;
    }

    skipUseless() {
        let isWhitespace: boolean;
        let isSingleLineComment: boolean;
        while ((isWhitespace = this._isWhitespace()) || (isSingleLineComment = this._isSingleLineComment())) {
            if (isWhitespace) {
                this.skipWhitespace();
                continue;
            }
            this.skipComment();
        }
    }

    /**
     * 跳过空白字符
     */
    skipWhitespace() {
        while (this._isWhitespace()) {
            this.advance();
        }
    }

    /**
     * 跳过注释
     */
    skipComment() {
        if (!this._isSingleLineComment()) {
            return;
        }
        this.advance();
        if (this.curChar === "$") {
            // 当出现两个连续的单行注释符号时，判断为多行注释，即 ## ... ##
            let chars: string = "";
            // 跳过多行注释
            do {
                chars = chars.length <= 1 ? chars : chars.substring(1);
                this.advance();
                chars += this.curChar ?? "";
            } while (chars !== "$#" && this.curChar != null);
            if (chars.length < 2) {
                throw new SyntaxError("Invalid comment");
            }
            this.advance();
            return;
        }
        // 跳过单行注释
        while (this.curChar != null && this.curChar !== "\n") {
            this.advance();
        }
    }

    digit() {
        let res: string = "";
        let isFloat: boolean = false;
        while (this._isDigit()) {
            if (this.curChar === ".") {
                if (isFloat) {
                    throw new SyntaxError("Invalid number");
                }
                isFloat = true;
            }
            res += this.curChar;
            this.advance();
        }
        return res;
    }

    word(): string | KeyWordType {
        let res: string = "";
        while (this.curChar != null && /[a-zA-Z0-9_$]/.test(this.curChar)) {
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

    symbol(): [TokenType, OperatorType | SeparatorType] {
        let res: string = "";
        const char: string = this.curChar!;
        if (this._isLeftBrace(char) || this._isRightBrace(char)) {
            res = char;
            this.advance();
        } else {
            while (this._isSymbol()) {
                const char: string = this.curChar!;
                if (this._isLeftBrace(char) || this._isRightBrace(char)) {
                    break;
                }
                res += char;
                this.advance();
            }
        }
        if (SEPARATOR_SET.has(res as SeparatorType)) {
            return [TokenType.SEPARATOR, res as SeparatorType];
        }
        if (OPERATOR_SET.has(res as any)) {
            return [TokenType.OPERATOR, res as OperatorType];
        }
        throw new SyntaxError(`Unknown symbol '${res}'`);
    }

    string() {
        let res: string = "";
        if (!this._isDoubleQuotation()) {
            throw new SyntaxError("Unexpected character");
        }
        this.advance();
        while (!this._isDoubleQuotation()) {
            res += this.curChar;
            this.advance();
        }
        this.advance();
        return res;
    }

    /**
     * 获取下一个token
     */
    // noinspection t
    getNextToken() {
        this.skipUseless();
        if (this.curChar == null) {
            return new Token(TokenType.EOF, null);
        }
        if (this._isDot()) {
            this.advance();
            return new Token(TokenType.OPERATOR, OperatorType.DOT);
        }
        if (this._isDigit()) {
            return new Token(TokenType.NUMBER, this.digit());
        }
        if (this._isDoubleQuotation()) {
            return new Token(TokenType.STRING, this.string());
        }
        if (this._isSymbol()) {
            const [type, value] = this.symbol();
            return new Token(type, value);
        }
        if (this._isLetter()) {
            const str: string = this.word();
            if (this._isBoolean(str)) {
                return new Token(TokenType.BOOLEAN, str);
            }
            if (this._isKeyWord(str)) {
                return new Token(this.keyWord(str), str);
            }
            return new Token(TokenType.IDENTIFIER, str);
        }
        throw new SyntaxError(`Unexpected character '${this.curChar}'`);
    }

    private _isWhitespace(char: string | null = this.curChar) {
        return char != null && WHITESPACE_SET.has(char as any);
    }

    private _isSingleLineComment(char: string | null = this.curChar) {
        return char === "#";
    }

    private _isDigit(char: string | null = this.curChar) {
        return char != null && ((char >= "0" && char <= "9") || char === SymbolType.DOT);
    }

    private _isLetter(char: string | null = this.curChar) {
        return char != null && /[a-zA-Z_$]/.test(char);
    }

    private _isBoolean(char: string): char is KeyWordType.TRUE | KeyWordType.FALSE {
        return char === KeyWordType.TRUE || char === KeyWordType.FALSE;
    }

    private _isKeyWord(char: string): char is KeyWordType {
        return KEY_WORD_SET.has(char as any);
    }

    private _isDoubleQuotation(char: string | null = this.curChar) {
        return char === SymbolType.DOUBLE_QUOTATION;
    }

    private _isSymbol(char: string | null = this.curChar) {
        return char != null && SYMBOL_SET.has(char as any);
    }

    private _isDot(char: string | null = this.curChar) {
        return char === SymbolType.DOT && this._tokens[this._tokens.length - 1].type === TokenType.IDENTIFIER;
    }

    private _isLeftBrace(char: string | null = this.curChar) {
        return char === SymbolType.LEFT_BRACE;
    }

    private _isRightBrace(char: string | null = this.curChar) {
        return char === SymbolType.RIGHT_BRACE;
    }
}
