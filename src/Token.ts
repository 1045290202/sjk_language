/**
 * @Author SJK
 * @Time 2024/4/29 下午3:22
 * @File Token.ts
 * @Description 词法标记
 */
import { TokenType } from "./const";


export default class Token {
    private readonly _type: TokenType = TokenType.UNKNOWN;
    private readonly _value: string | null = null;
    
    get type() {
        return this._type;
    }
    
    get value() {
        return this._value;
    }
    
    constructor(type: TokenType, value: string | null) {
        this._type = type;
        this._value = value;
    }
    
    toString() {
        return `Token(${this._type}, ${this._value})`;
    }
}