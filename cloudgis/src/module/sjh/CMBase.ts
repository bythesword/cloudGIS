import { BaseObject } from "../common/baseobject";

/**
 * 仿真基础类
 */
class CMBase extends BaseObject {
    loadFromJSON(_oneJSON: {}) {
        throw new Error("Method not implemented.");
    }
    init(): void {
        throw new Error("Method not implemented.");
    }
    load(_pjid: string) {
        throw new Error("Method not implemented.");
    }
    save(_pjid: string, _attribueJsong: {}) {
        throw new Error("Method not implemented.");
    }

}
export { CMBase }