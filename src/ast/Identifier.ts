/**
 * @Author SJK
 * @Time 2024/4/30 上午10:25
 * @File Identifier.ts
 * @Description 标识符
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";

export default class Identifier extends ASTNode {
    readonly name: string;

    constructor(name: string) {
        super(ASTNodeType.IDENTIFIER);
        this.name = name;
    }
}
