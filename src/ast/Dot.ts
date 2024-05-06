/**
 * @Author SJK
 * @Time 2024/5/6 下午3:05
 * @File Dot.ts
 * @Description 点运算符，不是小数点
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";
import Identifier from "./Identifier";

export default class Dot extends ASTNode {
    parentNode: Identifier | Dot | null;
    childNode: Identifier | null;

    constructor(parentNode: Identifier | Dot | null = null, childNode: Identifier | null = null) {
        super(ASTNodeType.DOT);
        this.parentNode = parentNode;
        this.childNode = childNode;
    }
}
