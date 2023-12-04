/**这个 春华你自己改吧，我就写个简单的 */
import *  as Cesium from "cesium"
import { Destination, Orientation } from "./baseConfig"

/**
 * 配置类，
 *  目标：
 *      1、cesium的配置参数
 *      2、配合配置JSON使用
 *      3、隐藏cesium，实现二次封装
 */

class BaseScene {
    /**
     * scene :场景
     * 作为this.scene 使用
     */
    scene: any
    /**  
     * viewer：
     *  作为this.viewer使用，其他的baseObject 组件需要viewer
    */
    viewer: any

    /** 默认的基础配置 
     * 
    */
    baseSetting: any = {
        /**  左下角圆盘 速度控制器*/
        animation: true,
        /**  当动画控件出现，用来控制是否通过旋转控件，旋转场景*/
        shouldAnimate: true,
        /** 右上角图层选择器 */
        baseLayerPicker: false,
        /**右下角全屏按钮 */
        fullscreenButton: false,
        /**右下角vr按钮 */
        vrButton: false,
        /** 右上角地图恢复到初始页面按钮 */
        homeButton: false,
        /** 点击后地图上显示的选择控件 */
        selectionIndicator: false,
        /** 右上角鼠标点击后信息展示框 */
        infoBox: false,
        /** 右上角2D和3D之间的切换 */
        sceneModePicker: false,
        /** 页面下方的时间条 */
        timeline: true,
        /** 右上角帮助按钮 */
        navigationHelpButton: false,
        /** 是否展开帮助 */
        navigationInstructionsInitiallyVisible: false,
        /** 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源 */
        scene3DOnly: true,
        /** 控制渲染循环 */
        useDefaultRenderLoop: true,
        /**HTML面板中显示错误信息 */
        showRenderLoopErrors: false,
        /** 如果为true，则以浏览器建议的分辨率渲染并忽略window.devicePixelRatio */
        useBrowserRecommendedResolution: true,
        /** 自动追踪最近添加的数据源的时钟设置 */
        automaticallyTrackDataSourceClocks: true,
        /** 如果为true并且配置支持它，则使用顺序无关的半透明性 */
        orderIndependentTranslucency: true,
        /**阴影效果 */
        shadows: false,
        /** 透视投影和正投影之间切换 */
        projectionPicker: false,
        /**在指定情况下进行渲染 ,提高性能 */
        requestRenderMode: true,
        /** 瓦片地址 */
        imagery: {
            url: "http://114.115.182.191/data/globeimage/{z}/{x}/{reverseY}.jpg",
            type: "ylxyz",
            fileExtension: "jpg"
        },
        /** 地形URL */
        terrain: {
            url: "http://114.115.182.191/data/terrain",
            provider: "cesium",
        },
        /** 默认的DIV */
        div: "clodGISContainer",
        mode: 3,// 2 or 3D

    }
    /**
     * 
     * @param input 输入参数，里面的值代替已有的默认参数
     * @param _projectID 项目ID
     */
    constructor(input: any[], _projectID?: string) {
        for (let i in input) {
            this.baseSetting[i] = input[i];
        }
        this.init();
    }

    init() { }
    /**
     * 
     * @returns 返回viewer
     */
    getViewer(){
        return this.viewer
    }
    /**
     * 
     * @param destination 目标地点的经度、维度、高度
     * @param orientation 视角：heading和pitch 
     */
    setView(destination: Destination, orientation: Orientation) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(destination[0], destination[1], destination[2]),
            orientation: {
                heading: Cesium.Math.toRadians(orientation.heading),
                pitch: Cesium.Math.toRadians(orientation.pitch),
            }
        });
    }
    /**
     * 
     * @param destination  目标地点的经度、维度、高度,数组
     *  @param orientation 视角：heading和pitch 
     */
    flyTo(destination: Destination, orientation: Orientation) {
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(destination[0], destination[1], destination[2]),
            orientation: {
                heading: Cesium.Math.toRadians(orientation.heading),
                pitch: Cesium.Math.toRadians(orientation.pitch),
            }
        });
    }
    /**
     * 获取的基础设置参数 ，编辑器使用
     * @param input  JSON格式
     */
    setBaseSetting(input: any) {
        this.baseSetting = input;
    }
    /**返回基础设置参数 */
    getBaseSetting() {

    }
    /**
     * 保存基础配置到数据库
     * @param _projectID 项目ID
     */
    saveToDB(_projectID?: string) {

    }
}


export { BaseScene }