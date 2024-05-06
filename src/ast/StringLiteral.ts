/**
 * @Author SJK
 * @Time 2024/5/6 下午1:25
 * @File StringLiteral.ts
 * @Description 字符串字面量
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class StringLiteral extends ASTNode {
    readonly value: string;

    constructor(value: string) {
        super(ASTNodeType.STRING_LITERAL);
        this.value = value;
    }
}
