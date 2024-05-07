/**
 * @Author SJK
 * @Time 2024/5/6 下午7:24
 * @File Block.ts
 * @Description 代码块
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Block extends ASTNode {
    body: ASTNode[] = [];
    constructor() {
        super(ASTNodeType.BLOCK);
    }
}
