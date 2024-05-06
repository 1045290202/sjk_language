/**
 * @Author SJK
 * @Time 2024/4/29 下午4:07
 * @File const.ts
 * @Description pass
 */

// 词法标记枚举
export enum TokenType {
    /** 未知 */
    UNKNOWN = "UNKNOWN",
    /** 整数 */
    INTEGER = "INTEGER",
    /** 字符串 */
    STRING = "STRING",
    /** 运算符 */
    OPERATOR = "OPERATOR",
    /** 标识符 */
    IDENTIFIER = "IDENTIFIER",
    /** 关键词 **/
    KEYWORD = "KEYWORD",
    /** 语句结束 */
    EOS = "EOS",
    /** end of file */
    EOF = "EOF",
}

// 程序关键词枚举
export enum KeyWordType {
    DEF = "def",
}

// 程序关键词
export const KEY_WORD_SET: Readonly<Set<KeyWordType>> = new Set<KeyWordType>(Object.values(KeyWordType));

// 空白字符枚举
export enum WhitespaceType {
    SPACE = " ",
    TAB = "\t",
    NEWLINE = "\n",
    CARRIAGE_RETURN = "\r",
}

// 空白字符
export const WHITESPACE_SET: Readonly<Set<WhitespaceType>> = new Set<WhitespaceType>(Object.values(WhitespaceType));

export enum SymbolType {
    PLUS = "+",
    MINUS = "-",
    STAR = "*",
    SLASH = "/",
    EQUAL = "=",
    LEFT_ANGLE_BRACKET = "<",
    RIGHT_ANGLE_BRACKET = ">",
    SEMICOLON = ";",
}

// 符号字符
export const SYMBOL_SET: Readonly<Set<SymbolType>> = new Set<SymbolType>(Object.values(SymbolType));

export const END_OF_STATEMENT: string = ";";

export enum OperatorType {
    PLUS = "+",
    MINUS = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    GREATER = ">",
    LESS = "<",
    EQUAL = "=",
    ASSIGN = ">>",
}

// 运算符
export const OPERATOR_SET: Readonly<Set<OperatorType>> = new Set<OperatorType>(Object.values(OperatorType));

export enum BinaryOperatorType {
    PLUS = "+",
    MINUS = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    GREATER = ">",
    LESS = "<",
    EQUAL = "=",
    ASSIGN = ">>",
}

// 双目运算符
export const BINARY_OPERATOR_SET: Readonly<Set<BinaryOperatorType>> = new Set<BinaryOperatorType>(
    Object.values(BinaryOperatorType),
);

export const OPERATOR_TO_JS_OPERATOR: Readonly<Record<BinaryOperatorType, string>> = {
    [BinaryOperatorType.PLUS]: "+",
    [BinaryOperatorType.MINUS]: "-",
    [BinaryOperatorType.MULTIPLY]: "*",
    [BinaryOperatorType.DIVIDE]: "/",
    [BinaryOperatorType.GREATER]: ">",
    [BinaryOperatorType.LESS]: "<",
    [BinaryOperatorType.EQUAL]: "==",
    [BinaryOperatorType.ASSIGN]: "=",
};

export enum ASTNodeType {
    /** 语句结束 */
    EOS = "EOS",
    /** 程序 */
    PROGRAM = "PROGRAM",
    /** 双目运算表达式 */
    BINARY_EXPRESSION = "BINARY_EXPRESSION",
    /** 赋值 */
    ASSIGNMENT = "ASSIGNMENT",
    /** 数字字面量 */
    NUMBER_LITERAL = "NUMBER_LITERAL",
    /** 标识符 */
    IDENTIFIER = "IDENTIFIER",
    /** 定义 */
    DEFINITION = "DEFINITION",
}
