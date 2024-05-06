/**
 * @Author SJK
 * @Time 2024/4/30 下午1:07
 * @File Eos.ts
 * @Description 语句结束
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Eos extends ASTNode {
    constructor() {
        super(ASTNodeType.END);
    }
}