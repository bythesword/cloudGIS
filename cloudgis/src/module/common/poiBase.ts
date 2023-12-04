import { BaseObject } from "./baseobject";
import *  as Cesium from "cesium";
// import { Destination, Orientation, Locations, PerLocation } from "./baseConfig"
import { ObjectStatus, StatusOfObjectString } from "./baseConfig";

/** POI 的类型必须为这个5种 */
export type PoiType = 'text' | 'image' | 'div' | 'vedio' | 'comb'
// export enum PoiType { 'text', 'image', 'div', 'vedio', 'comb' }

/** 
 * 定义ObjectContent 
 * 包括了obj：状态的定义
 * type：类型在 PoiType范围内
*/
export interface ObjectContentJSON<T> {
    obj: ObjectStatus<T>,
    type: PoiType
}



abstract class PoiBase extends BaseObject {

    /**
     * 内容：5种，每个POI类各取所需，抽象，
     * JSON格式
     * 保存load，loadFromJSON,save共同使用的JSON
     */
    abstract contnetJSON: ObjectContentJSON<{}>;
    /** 
     * 组件对象
     *  每个POI类型 PoiType 的T可能会不同
    */
    abstract contnet: ObjectStatus<{}>;
    /**
     * 路径动画数组，待定！！
     * 初步设想，采用cesium的path
     * 或二维数组，其中为[[x,y,z],[x,y,z]],同curve生成路径
     */
    path = []
    // constructor(input: {
    //     coord: number[], viewer?: any
    // }, PJID = "") {
    //     super(input)
    //     this.contnet={}
    // }
    abstract setStatus(status: StatusOfObjectString): void
    /**选中 */
    statusSelected(): void { this.setStatus("selected") }
    /**悬停或经过 */
    statusOver(): void { this.setStatus("over") }
    /**      移动      */
    statusMove(): void { this.setStatus("move") }
    /**告警 */
    statusOffline(): void { this.setStatus("offline") }
    /**告警 */
    statusAlert(): void { this.setStatus("alert") }
    /** 当前状态 */
    currentStatus: StatusOfObjectString | undefined = "normal"

    /**重置状态
     * 到默认，一般为normal
     * 也可以设置其他的状态
     */
    abstract statusReset(): void

    /**normal状态 */
    statusNormall(): void { this.setStatus("normal") }

    /**增加到viewer */
    abstract add(one: Cesium.Entity): void

    /** 移除 */
    abstract remove(): void

    /** 
     * 是否显示
     */
    abstract show(visble: boolean): void
}


export { PoiBase }