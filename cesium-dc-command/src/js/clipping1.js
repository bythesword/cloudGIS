
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import "/public/cesium/Widgets/widgets.css";

import { CustomPrimitive } from '../jsm/customPrimitive';
import *  as Util from "../jsm/baseUtil"

import redCLippingFS from "../shaders/base/redClipping.fs.glsl?raw"
import baseVS from "../shaders/base/base.VS.glsl?raw"
import quadVS from "../shaders/base/quad.VS.glsl?raw"

import { cube } from '../jsm/cube';

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

let option = {
    commandType: 'Draw',
    attributes: {
        "position": {
            index: 0,
            componentsPerAttribute: 3,
            vertexBuffer: [
                -100, -100, 100, // 1
                100, -100, 100, // 2
                100, 100, 100, // 4

                -100, -100, 100, // 1
                100, 100, 100,//4
                -100, 100, 100, //3 
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

                0, 1,
                1, 1,
                0, 1,
            ],//normal array
            componentDatatype: Cesium.ComponentDatatype.FLOAT
        }
    },
    modelMatrix: modelMatrix,
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    uniformMap: {
        u_plane: () => { return { x: 1, y: 0, z: 0, w: -60 } },
    },
    vertexShaderSource: quadVS,
    fragmentShaderSource: redCLippingFS,
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
    autoClear: false
}
let oneCommand = new CustomPrimitive(option)
window.main = oneCommand;

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(oneCommand);

window.cube = new cube();