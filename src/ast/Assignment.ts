/**
 * @Author SJK
 * @Time 2024/4/30 上午10:23
 * @File Assignment.ts
 * @Description 赋值
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Assignment extends ASTNode {
    valueNode: ASTNode;
    targetNode: ASTNode;
    
    constructor(valueNode: ASTNode, targetNode: ASTNode) {
        super(ASTNodeType.ASSIGNMENT);
        this.valueNode = valueNode;
        this.targetNode = targetNode;
    }
}

