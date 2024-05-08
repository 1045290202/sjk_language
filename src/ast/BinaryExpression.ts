/**
 * @Author SJK
 * @Time 2024/4/30 上午10:14
 * @File BinaryExpression.ts
 * @Description 双目运算表达式
 */
import ASTNode from "./ASTNode";
import { ASTNodeType, BinaryOperatorType } from "../const";

export default class BinaryExpression extends ASTNode {
    readonly left: ASTNode;
    readonly operator: BinaryOperatorType;
    readonly right: ASTNode;

    constructor(left: ASTNode, operator: BinaryOperatorType, right: ASTNode) {
        super(ASTNodeType.BINARY_EXPRESSION);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
