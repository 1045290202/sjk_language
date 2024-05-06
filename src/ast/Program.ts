/**
 * @Author SJK
 * @Time 2024/4/30 下午2:06
 * @File Program.ts
 * @Description 程序，一般为ast数的子节点
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Program extends ASTNode {
    readonly body: ASTNode[] = [];
    constructor() {
        super(ASTNodeType.PROGRAM);
    }
}
