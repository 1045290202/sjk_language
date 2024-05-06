/**
 * @Author SJK
 * @Time 2024/4/30 上午10:24
 * @File NumberLiteral.ts
 * @Description 数字字面量
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class NumberLiteral extends ASTNode {
    value: string;
    
    constructor(value: string) {
        super(ASTNodeType.NUMBER_LITERAL);
        this.value = value;
    }
}