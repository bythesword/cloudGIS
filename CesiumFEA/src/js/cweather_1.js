import "/public/cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import { CWeather } from "../jsm/Cweather"







Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjNiZTgxOS0xZDYwLTQzNzctYWRkOS00ZjJkZDI2YjA5MGMiLCJpZCI6ODMyOTksImlhdCI6MTY0NTY3MTU4NH0.2bu4bjqgk1yx5JMdC1iU8j65IlMztD4KI11scmH_sHQ';


const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false,
    selectionIndicator: false,
    shadows: false,
    shouldAnimate: false,
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //  url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",//image map
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
    }),
    animation: false,    //左下角的动画仪表盘
    baseLayerPicker: false,  //右上角的图层选择按钮
    geocoder: false,  //搜索框
    homeButton: false,  //home按钮
    sceneModePicker: false, //模式切换按钮
    timeline: false,    //底部的时间轴
    navigationHelpButton: false,  //右上角的帮助按钮，
    fullscreenButton: false, //右下角的全屏按钮
});
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.396, 39.811, 1000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
    }
});


window.Cesium = Cesium;//add by tom
window.viewer = viewer;

var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

//多个网格
// let setting = {
//     dem: true,
//     base_z: 0,
//     multiUVs: true,
// }
// let CMAtt = new DNW(abc, "cm", setting);
// CMAtt.nw.cmType = "wind";
// window.CMAtt=CMAtt;


let oneCCM = new CWeather(modelMatrix, { cmType: "rainGras" });

window.main = oneCCM;

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(oneCCM);

