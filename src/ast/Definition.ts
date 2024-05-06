/**
 * @Author SJK
 * @Time 2024/4/30 上午11:48
 * @File Definition.ts
 * @Description 定义
 */
import ASTNode from "./ASTNode";
import { ASTNodeType } from "../const";
import Identifier from "./Identifier";

export default class Definition extends ASTNode {
    identifier: Identifier | null;
    
    constructor(identifier: Identifier | null) {
        super(ASTNodeType.DEFINITION);
        this.identifier = identifier;
    }
}