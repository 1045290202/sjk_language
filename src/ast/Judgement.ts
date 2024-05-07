/**
 * @Author SJK
 * @Time 2024/5/7 下午2:04
 * @File Judgement.ts
 * @Description 判断
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";
import Block from "./Block";

export default class Judgement extends ASTNode {
    // [条件，代码块]
    branches: { condition: ASTNode; block: Block }[] = [];
    default: Block | null = null;

    constructor() {
        super(ASTNodeType.JUDGEMENT);
    }
}
