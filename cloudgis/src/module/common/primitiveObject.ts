
import { BaseObject } from "./baseobject";

abstract class PrimitiveObject extends BaseObject {

        /**
     * 未覆写的状态
     * primitive API 类使用
     *  @param {FrameState} frameState
     */
        abstract update(frameState: any): void
}
export { PrimitiveObject }