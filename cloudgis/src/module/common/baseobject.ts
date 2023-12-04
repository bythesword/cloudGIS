import *  as Cesium from "cesium";
// import { Locations } from "./baseLocation"
import { Destination, Orientation } from "./baseConfig"
import * as md5 from "md5";
/**
 * 对象的根类，(可定位，可移动的对象)
 *  目标：
 *      1、场景与编辑器通用
 *      2、有控制器（移动的三维轴）
 */
abstract class BaseObject {

    /** 位置矩阵 */
    modelMatrix: Cesium.Matrix4
    /** 是否可见 */
    visable: boolean = true
    /** 当前的坐标，数组 */
    coordinate: Destination
    /** 视角 */
    orientation: Orientation = { heading: 0, pitch: -90 }
    /** 在当前坐标上增加的高度 */
    viewAddonHeight = 500
    /**
     * 是否为node节点，若为节点，则仅为节点（node/group）,默认为false
     */
    node: boolean = false

    /**
     * cesium 的 viewer,通过全局属性获得
     */
    viewer: any
    /**
     * 子对象的数组,默认为空数组
     * string [],内容为 object的ID
     */
    children: string[] = []
    /** 本对象内的组件， */
    component: any[] = []

    /** 项目ID，中台提供，默认为空，即没有项目，比如DEMO 
     * 默认为时间戳
    */
    PJID = ""
    /**项目名称，默认为空 */
    PJName = ""
    /** 对象名称 
     * 默认为时间戳
    */

    name = ""
    /**ID  自动生成的
     * 默认为时间戳，自动生成
     */
    ID = ''
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
        coord: number[],
        viewer?: any,
        PJID?: string,
        orientation?: Orientation
    }) {
        // this.children = [];
        this.viewer = input.viewer;
        if (input.PJID !== undefined) {
            this.projectID = input.PJID;
            this.load(this.PJID)
        }
        else {
            let timestamp = new Date().getTime()
            this.ID = md5([timestamp]);
        }
        if (input.viewer !== undefined) {
            this.viewer = input.viewer;
        }
        this.coordinate = input.coord;
        if (input.orientation)
            this.orientation = input.orientation;

        let origin = Cesium.Cartesian3.fromDegrees(input.coord[0], input.coord[1], input.coord[2])
        this.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
        this.init();
    }

    /**
     * 未覆写的状态
     * init 需要复写
     */
    abstract init(): void
    abstract load(pjid: string): any
    abstract loadFromJSON(oneJSON: {}): any
    abstract save(pjid: string, attribueJsong: {}): any

    set projectID(pjid: string) {
        this.PJID = pjid
    }
    get projectID() {
        return this.PJID
    }
    set objectID(id: string) {
        this.ID = id
    }
    get objectID() {
        return this.ID
    }
    set objectName(name: string) {
        this.name = name
    }
    get objectName() {
        return this.name
    }
    /**
     * 飞到object 上空，
     * 三个参数都是可以选的
     * @param destination 
     * @param orientation 
     * @param viewAddonHeight 
     */
    flyTo(destination?: Destination, orientation?: Orientation, viewAddonHeight?: number) {
        if (viewAddonHeight === undefined)
            viewAddonHeight = this.viewAddonHeight;
        if (destination && orientation) {
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(destination[0], destination[1], destination[2] + viewAddonHeight),
                orientation: {
                    heading: Cesium.Math.toRadians(orientation.heading),
                    pitch: Cesium.Math.toRadians(orientation.pitch),
                }
            });
        }
        else {
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(this.coordinate[0], this.coordinate[1], this.coordinate[2] + viewAddonHeight),
                orientation: {
                    heading: Cesium.Math.toRadians(this.orientation.heading),
                    pitch: Cesium.Math.toRadians(this.orientation.pitch),
                }
            });
        }
    }
    /**
     * 切换到object上空
     * 三个参数都是可选的
     * @param destination 
     * @param orientation 
     * @param viewAddonHeight 
     */
    switchTo(destination?: Destination, orientation?: Orientation, viewAddonHeight?: number) {
        if (viewAddonHeight === undefined)
            viewAddonHeight = this.viewAddonHeight;
        if (destination && orientation) {
            this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(destination[0], destination[1], destination[2] + viewAddonHeight),
                orientation: {
                    heading: Cesium.Math.toRadians(orientation.heading),
                    pitch: Cesium.Math.toRadians(orientation.pitch),
                }
            });
        }
        else {
            this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(this.coordinate[0], this.coordinate[1], this.coordinate[2] + viewAddonHeight),
                orientation: {
                    heading: Cesium.Math.toRadians(this.orientation.heading),
                    pitch: Cesium.Math.toRadians(this.orientation.pitch),
                }
            });
        }
    }
}

export { BaseObject }