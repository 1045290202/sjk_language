/**
 * @Author SJK
 * @Time 2024/5/8 下午2:11
 * @File UnaryExpression.ts
 * @Description 单目运算表达式
 */
import ASTNode from "./ASTNode";
import { ASTNodeType, UnaryOperatorType } from "../const";

export default class UnaryExpression extends ASTNode {
    readonly operator: UnaryOperatorType;
    readonly sub: ASTNode;
    constructor(operator: UnaryOperatorType, sub: ASTNode) {
        super(ASTNodeType.UNARY_EXPRESSION);
        this.operator = operator;
        this.sub = sub;
    }
}
