/**
 * @Author SJK
 * @Time 2024/4/30 上午10:09
 * @File ASTNode.ts
 * @Description 抽象语法树节点
 */
import { ASTNodeType } from "../const";

export default class ASTNode {
    readonly type: ASTNodeType;

    constructor(type: ASTNodeType) {
        this.type = type;
    }
}
