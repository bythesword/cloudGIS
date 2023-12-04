
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import "/public/cesium/Widgets/widgets.css";

import { CustomPrimitive, initFinished } from '../jsm/customPrimitive';
import *  as Util from "../jsm/baseUtil"


import cmWatershadertoyOriginFS from "../shaders/CM/cmWatershadertoyOrigin.fs.glsl?raw"
import cmWaterBlue1FS from "../shaders/CM/cmWaterBlue1.fs.glsl?raw"
import cm4FS from "../shaders/CM/cm4.fs.glsl?raw"
import redFS from "../shaders/base/red.FS.glsl?raw"
import copyFS from "../shaders/base/cp.FS.glsl?raw"

import baseVS from "../shaders/base/base.VS.glsl?raw"
import quadVS from "../shaders/base/quad.VS.glsl?raw"

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjNiZTgxOS0xZDYwLTQzNzctYWRkOS00ZjJkZDI2YjA5MGMiLCJpZCI6ODMyOTksImlhdCI6MTY0NTY3MTU4NH0.2bu4bjqgk1yx5JMdC1iU8j65IlMztD4KI11scmH_sHQ';

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
    }),
});
// viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 2500),
//     orientation: {
//         heading: Cesium.Math.toRadians(0.0),
//         pitch: Cesium.Math.toRadians(-65.0),
//     }
// });

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.811, 1000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
    }
});
window.Cesium = Cesium;//add by tom
window.viewer = viewer;

var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

let FBO = {};

let option2 = {
    name: 1,
    commandType: 'Draw',
    // attributes: {
    //     "position": {
    //         index: 0,
    //         componentsPerAttribute: 3,
    //         vertexBuffer: [
    //             //34
    //             //12
    //             // -10000, -10000, 0, // 1
    //             // 10000, -10000, 0, // 2
    //             // 10000, 10000, 0, // 4

    //             // -10000, -10000, 0, // 1
    //             // 10000, 10000, 0,//4
    //             // -10000, 10000, 0, //3 

    //             // //34
    //             // //12
    //             -1000, -1000, 0,//1
    //             1000, -1000, 0,//2
    //             -1000, 1000, 0,//3

    //             1000, -1000, 0,//2
    //             1000, 1000, 0,//4
    //             -1000, 1000, 0,//3
    //         ],//normal array
    //         componentDatatype: Cesium.ComponentDatatype.FLOAT
    //     },
    //     "uv": {
    //         index: 1,
    //         componentsPerAttribute: 2,
    //         vertexBuffer: [
    //             // 0, 0,
    //             // 1, 0,
    //             // 1, 1,

    //             // 0, 0,
    //             // 1, 1,
    //             // 0, 1,


    //             0,0,
    //             1,0,
    //             0,1,

    //             1,0,
    //             1,1,
    //             0,1,
    //         ],//normal array
    //         componentDatatype: Cesium.ComponentDatatype.FLOAT
    //     }
    // },

    attributes: {
        "position": {
            index: 0,
            componentsPerAttribute: 3,
            vertexBuffer: [
                -100, -100, 0, // 1
                100, -100, 0, // 2
                100, 100, 0, // 4

                -100, -100, 0, // 1
                -100, 100, 0, //3 
                100, 100, 0,//4

            ],//normal array
            componentDatatype: Cesium.ComponentDatatype.FLOAT
        },
        "uv": {
            index: 1,
            componentsPerAttribute: 2,
            vertexBuffer: [
                0, 0,
                1, 0,
                1, 1,

                0, 0,
                1, 0,
                1, 1,
            ],//normal array
            componentDatatype: Cesium.ComponentDatatype.FLOAT
        }
    },
    modelMatrix: modelMatrix,
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    uniformMap: {
        // iChannel0: () => { return this.particleStateTexture0; },

    },
    textures: {
        iChannel0: "0",
        iChannel1: "1",
    },
    vertexShaderSource: quadVS,
    fragmentShaderSource: cmWaterBlue1FS,
    // rawRenderState:
    //     Util.createRawRenderState({
    //         // undefined value means let Cesium deal with it
    //         viewport: undefined,
    //         depthTest: {
    //             enabled: true
    //         },
    //         depthMask: true
    //     }),
    // framebuffer: this.framebuffers.segments,
    autoClear: false,
    preInit: async (scope) => {
        //grayNoise64x64.png
        // scope.DS_textures[0]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/grayNoise256x256.png");
        scope.DS_textures[0] = await Util.createTextureFromUrl(scope.frameState.context, "/noise/grayNoise64x64.png");
        // scope.DS_textures[1]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/london512x512.jpg");
        scope.DS_textures[1] = await Util.createTextureFromUrl(scope.frameState.context, "/noise/pebbles.png");
        // scope.DS_textures[1]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/gray/noise_clouds.png");
        console.log("pre init")
        //pebbles.png


    }
}

let oneCommand1 = new CustomPrimitive(option2)

window.main = [oneCommand1,];


viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(oneCommand1);
