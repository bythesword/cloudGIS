import * as Cesium from "cesium";
import { Destination, Orientation } from "./baseConfig";
/**
 * 对象的根类，(可定位，可移动的对象)
 *  目标：
 *      1、场景与编辑器通用
 *      2、有控制器（移动的三维轴）
 */
declare abstract class BaseObject {
    /** 位置矩阵 */
    modelMatrix: Cesium.Matrix4;
    /** 是否可见 */
    visable: boolean;
    /** 当前的坐标，数组 */
    coordinate: Destination;
    /** 视角 */
    orientation: Orientation;
    /** 在当前坐标上增加的高度 */
    viewAddonHeight: number;
    /**
     * 是否为node节点，若为节点，则仅为节点（node/group）,默认为false
     */
    node: boolean;
    /**
     * cesium 的 viewer,通过全局属性获得
     */
    viewer: any;
    /**
     * 子对象的数组,默认为空数组
     * string [],内容为 object的ID
     */
    children: string[];
    /** 本对象内的组件， */
    component: any[];
    /** 项目ID，中台提供，默认为空，即没有项目，比如DEMO
     * 默认为时间戳
    */
    PJID: string;
    /**项目名称，默认为空 */
    PJName: string;
    /** 对象名称
     * 默认为时间戳
    */
    name: string;
    /**ID  自动生成的
     * 默认为时间戳，自动生成
     */
    ID: string;
    /**
     *  input参数有两个内容
     *
     * 未覆写的状态
     *
     *  coord 经纬度坐标 [116.3915382409668, 39.8085, 1]
     *  viewer  是cesium 的Viewer（可选）
     * @param input{        coord: number[], viewer: any    }
     */
    constructor(input: {
        coord: number[];
        viewer?: any;
        PJID?: string;
        orientation?: Orientation;
    });
    /**
     * 未覆写的状态
     * init 需要复写
     */
    abstract init(): void;
    abstract load(pjid: string): any;
    abstract loadFromJSON(oneJSON: {}): any;
    abstract save(pjid: string, attribueJsong: {}): any;
    set projectID(pjid: string);
    get projectID(): string;
    set objectID(id: string);
    get objectID(): string;
    set objectName(name: string);
    get objectName(): string;
    /**
     * 飞到object 上空，
     * 三个参数都是可以选的
     * @param destination
     * @param orientation
     * @param viewAddonHeight
     */
    flyTo(destination?: Destination, orientation?: Orientation, viewAddonHeight?: number): void;
    /**
     * 切换到object上空
     * 三个参数都是可选的
     * @param destination
     * @param orientation
     * @param viewAddonHeight
     */
    switchTo(destination?: Destination, orientation?: Orientation, viewAddonHeight?: number): void;
}
export { BaseObject };
