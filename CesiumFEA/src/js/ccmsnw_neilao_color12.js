import "/public/cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import { CCMSNW } from "../jsm/CCMSNW"



import { TFL } from "../jsm/TFL";
// import * as rgbaJSON from "../../public/qinghe/rgba.json";
import * as rgbaJSON from "../../public/QH/rgba_721133.json";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjNiZTgxOS0xZDYwLTQzNzctYWRkOS00ZjJkZDI2YjA5MGMiLCJpZCI6ODMyOTksImlhdCI6MTY0NTY3MTU4NH0.2bu4bjqgk1yx5JMdC1iU8j65IlMztD4KI11scmH_sHQ';


const viewer = new Cesium.Viewer('cesiumContainer', {
    // terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false,
    selectionIndicator: false,
    shadows: false,
    shouldAnimate: false,
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        // url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",//image map
        // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
        url: 'https://t0.tianditu.gov.cn/vec_w/wmts?' + 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&' + 'TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + 'b826df734706d11202d422f9166be9a5',
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
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
    destination: Cesium.Cartesian3.fromDegrees(116.207069, 39.952786, 1000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
    }
});


window.Cesium = Cesium;//add by tom
window.viewer = viewer;

var origin = Cesium.Cartesian3.fromDegrees(116.207069, 39.952786, 5)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

// var origin = Cesium.Cartesian3.fromDegrees(116.207069, 39.952786, 0)
//  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)




// console.log("origin",origin)

// // Rotate a point 45 degrees counterclockwise around the x-axis.
// // const p = new Cesium.Cartesian3(5, 6, 7);
// const m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(0.30));
// console.log("m",m);


// const rotated = Cesium.Matrix3.multiplyByVector(m, origin, new Cesium.Cartesian3());
// console.log("rotated",rotated);


// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(rotated)

// // Cesium.Matrix4.multiplyByMatrix3(modelMatrix, rotation, modelMatrix);












//目前使用单个网格，测试
let setting = {
    coordinate: [116.207069, 39.952786, 0],
    RofBoundingSphere: 1,
    z: {
        // RateDEM: 10,
        dem: false,
        zbed_up: false,
        base_z: 0.0,
    },
    cmWater: {
        speed: 1.,
        //   scale: 0.725,
        opacity: 0.05,
    },
    wind: {
        fadeOpacity: 0.996, // how fast the particle trails fade on each frame
        speedFactor: 0.25, // how fast the particles move
        dropRate: 0.003, // how often the particles move to a random place
        dropRateBump: 0.01, // drop rate increase relative to individual particle spe
        defaultRampColors: {
            0.0: '#3288bd',
            0.1: '#66c2a5',
            0.2: '#abdda4',
            0.3: '#e6f598',
            0.4: '#fee08b',
            0.5: '#fdae61',
            0.6: '#f46d43',
            1.0: '#d53e4f'
        },
    },
    //cmWaterC12,有未知原因的错误，未定位，使用cmWater代替
    cmType: "cmWater",//cmWater,cmWaterBlue12,cmWaterBlue6ABS1,cmWaterC12,cm,cmBlue,cmBlue6
    cm: "zbed",
    CMAA: true,
    // framlines: true,
};
let oneCCM = new CCMSNW(modelMatrix, rgbaJSON, setting);

window.main = oneCCM;

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(oneCCM);

