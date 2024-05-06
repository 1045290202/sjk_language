/**
 * @Author SJK
 * @Time 2024/4/30 上午10:14
 * @File BinaryExpression.ts
 * @Description pass
 */
import ASTNode from "./ASTNode";
import { ASTNodeType, BinaryOperatorType } from "../const";

export default class BinaryExpression extends ASTNode {
    left: ASTNode;
    operator: BinaryOperatorType;
    right: ASTNode;
    
    constructor(left: ASTNode, operator: BinaryOperatorType, right: ASTNode) {
        super(ASTNodeType.BINARY_EXPRESSION);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}