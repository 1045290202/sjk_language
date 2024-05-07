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
    /** 数字 */
    NUMBER = "NUMBER",
    /** 字符串 */
    STRING = "STRING",
    /** 运算符 */
    OPERATOR = "OPERATOR",
    /** 分隔符 */
    SEPARATOR = "SEPARATOR",
    /** 标识符 */
    IDENTIFIER = "IDENTIFIER",
    /** 关键词 */
    KEYWORD = "KEYWORD",
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
    DOUBLE_QUOTATION = '"',
    SINGLE_QUOTATION = "'",
    LEFT_PARENTHESIS = "(",
    RIGHT_PARENTHESIS = ")",
    LEFT_BRACKET = "[",
    RIGHT_BRACKET = "]",
    LEFT_BRACE = "{",
    RIGHT_BRACE = "}",
    DOT = ".",
}

// 符号字符
export const SYMBOL_SET: Readonly<Set<SymbolType>> = new Set<SymbolType>(Object.values(SymbolType));

export enum OperatorType {
    PLUS = "+",
    MINUS = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    GREATER = ">",
    LESS = "<",
    EQUAL = "=",
    ASSIGN = ">>",
    PIPE = "->",
    DOT = ".",
}

// 运算符
export const OPERATOR_SET: Readonly<Set<OperatorType>> = new Set<OperatorType>(Object.values(OperatorType));

export enum BinaryOperatorType {
    PLUS = OperatorType.PLUS,
    MINUS = OperatorType.MINUS,
    MULTIPLY = OperatorType.MULTIPLY,
    DIVIDE = OperatorType.DIVIDE,
    LESS = OperatorType.LESS,
    GREATER = OperatorType.GREATER,
    EQUAL = OperatorType.EQUAL,
    ASSIGN = OperatorType.ASSIGN,
}

// 双目运算符
export const BINARY_OPERATOR_SET: Readonly<Set<BinaryOperatorType>> = new Set<BinaryOperatorType>(
    Object.values(BinaryOperatorType),
);

export enum SeparatorType {
    COMMA = ",",
    COLON = ":",
    SEMICOLON = ";",
    LEFT_BRACKET = "(",
    RIGHT_BRACKET = ")",
    LEFT_BRACE = "{",
    RIGHT_BRACE = "}",
}

// 分隔符
export const SEPARATOR_SET: Readonly<Set<SeparatorType>> = new Set<SeparatorType>(Object.values(SeparatorType));

export const OPERATOR_TO_JS_OPERATOR: Readonly<Partial<Record<BinaryOperatorType, string>>> = {
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
    /** 程序 */
    PROGRAM = "PROGRAM",
    /** 双目运算表达式 */
    BINARY_EXPRESSION = "BINARY_EXPRESSION",
    /** 管道 */
    PIPE = "PIPE",
    /** 赋值 */
    ASSIGNMENT = "ASSIGNMENT",
    /** 数字字面量 */
    NUMBER_LITERAL = "NUMBER_LITERAL",
    /** 字符串字面量 */
    STRING_LITERAL = "STRING_LITERAL",
    /** 标识符 */
    IDENTIFIER = "IDENTIFIER",
    /** 定义 */
    DEFINITION = "DEFINITION",
    /** 点运算 */
    DOT = "DOT",
    /** 块 */
    BLOCK = "BLOCK",
    /** 判断 */
    JUDGEMENT = "JUDGEMENT",
}
