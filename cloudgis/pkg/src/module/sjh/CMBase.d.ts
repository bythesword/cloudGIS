import { BaseObject } from "../common/baseobject";
/**
 * 仿真基础类
 */
declare class CMBase extends BaseObject {
    loadFromJSON(_oneJSON: {}): void;
    init(): void;
    load(_pjid: string): void;
    save(_pjid: string, _attribueJsong: {}): void;
}
export { CMBase };
