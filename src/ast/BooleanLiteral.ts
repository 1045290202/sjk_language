/**
 * @Author SJK
 * @Time 2024/5/7 下午3:49
 * @File BooleanLiteral.ts
 * @Description 布尔值字面量
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class BooleanLiteral extends ASTNode {
    value: "true" | "false";

    constructor(value: "true" | "false") {
        super(ASTNodeType.BOOLEAN_LITERAL);
        this.value = value;
    }
}
