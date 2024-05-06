/**
 * @Author SJK
 * @Time 2024/5/6 下午4:09
 * @File Pipe.ts
 * @Description 管道
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Pipe extends ASTNode {
    // 管道坐标可以不要节点，以为函数不一定有参数
    readonly left: ASTNode | null;
    readonly right: ASTNode;

    constructor(left: ASTNode | null = null, right: ASTNode) {
        super(ASTNodeType.PIPE);
        this.left = left;
        this.right = right;
    }
}
