<template>
    <div id="cesiumContainer" style="width: 100%;height: 100%;"></div>
</template>
<script setup lang="ts">
// import { Viewer } from "cesium";
import *  as Cesium from "cesium";
import { onMounted } from "vue";
declare global {
    interface Window {
        CESIUM_BASE_URL: string
        Viewer: any
    }
}
import "/public/cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = '/public/cesium/';

onMounted(() => {
    window.Viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            // url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",//image map
            url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
        }),
        animation: true, // * 左下角圆盘 速度控制器
        shouldAnimate: true, // * 当动画控件出现，用来控制是否通过旋转控件，旋转场景
        baseLayerPicker: false, // * 右上角图层选择器
        fullscreenButton: false, // * 右下角全屏按钮
        vrButton: false, // * 右下角vr按钮
        homeButton: false, // * 右上角地图恢复到初始页面按钮
        selectionIndicator: false, // * 点击后地图上显示的选择控件
        infoBox: false, // * 右上角鼠标点击后信息展示框
        sceneModePicker: false, // * 右上角2D和3D之间的切换
        timeline: true, // * 页面下方的时间条
        navigationHelpButton: false, // * 右上角帮助按钮
        navigationInstructionsInitiallyVisible: false, // * 是否展开帮助
        scene3DOnly: true, // * 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        useDefaultRenderLoop: true, // * 控制渲染循环
        showRenderLoopErrors: false, // * HTML面板中显示错误信息
        useBrowserRecommendedResolution: true, // * 如果为true，则以浏览器建议的分辨率渲染并忽略window.devicePixelRatio
        automaticallyTrackDataSourceClocks: true, // * 自动追踪最近添加的数据源的时钟设置
        orderIndependentTranslucency: true, // * 如果为true并且配置支持它，则使用顺序无关的半透明性
        shadows: false, // * 阴影效果
        projectionPicker: false, // * 透视投影和正投影之间切换
        requestRenderMode: true, // * 在指定情况下进行渲染,提高性能
    });
    window.Viewer._cesiumWidget._creditContainer.style.display = "none"; // * 隐藏版权信息
    window.Viewer.scene.globe.depthTestAgainstTerrain = true; // * 开启深度测试
    window.Viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.396, 39.811, 1000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
        }
    });

});
</script>