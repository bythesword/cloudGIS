
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import "/public/cesium/Widgets/widgets.css";

import { CustomPrimitive } from '../jsm/customPrimitive';
import *  as Util from "../jsm/baseUtil"

import cubeClippingFS from "../webgl2/base/cubeClipping.fs.glsl?raw"
import cubeVS from "../webgl2/base/cube.VS.glsl?raw"
import whiteFS from "../webgl2/base/white.fs.glsl?raw"
import baseVS from "../webgl2/base/base.VS.glsl?raw"
import poscolorFS from "../webgl2/base/poscolor.fs.glsl?raw"


import { cube } from '../jsm/cube';

import * as oneTriangle from "../../public/onetriangle.json";
import { getTTT } from '../jsm/index';

//////////////////////////
//cesium base 
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
let lang = 116.396, lat = 39.811;
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(lang, lat - 0.0150, 10000),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
    }
});
const scene = viewer.scene;
window.Cesium = Cesium;//add by tom
window.viewer = viewer;
////////////////////////////////
//matrix 
var origin = Cesium.Cartesian3.fromDegrees(lang, lat, 0)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)


//////////////////////////
//plane 



//////////////////////////////////
//main Draw command 
window.command = [];
let level = ["one", "two", "three"];
let list = ["top", "bottom", "side"];
let listnetwork = ["topNetworks", "bottomNetworks", "sideNetworks"];
// let oneTriangle = getTTT();
for (let i of level) {
    for (let j of listnetwork) {
        let perOne = oneTriangle[i][j];
        let option = {
            commandType: 'Draw',
            attributes: {
                "position": {
                    index: 0,
                    componentsPerAttribute: 3,
                    vertexBuffer: perOne.position,
                    // vertexBuffer: perOne.position,
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },

            },
            modelMatrix: modelMatrix,
            primitiveType: Cesium.PrimitiveType.LINES,
            // primitiveType: Cesium.PrimitiveType.TRIANGLES,
            uniformMap: {
                // u_plane: () => { return { x: 0 - planeOne.normal.x, y: 0 - planeOne.normal.y, z: 0 - planeOne.normal.z, w: planeOne.distance } },
            },
            pass: Cesium.Pass.TRANSLUCENT,
            vertexShaderSource: baseVS,
            fragmentShaderSource: whiteFS,
            rawRenderState:
                Util.createRawRenderState({
                    // undefined value means let Cesium deal with it
                    // viewport: undefined,
                    depthTest: {
                        enabled: true
                    },
                    depthMask: true,
                    polygonOffset: {
                        enabled: true,
                        factor: 100.1,
                        units: 200.5
                    },
                }),
            // framebuffer: this.framebuffers.segments,
            autoClear: false
        }
        let oneCommand1 = new CustomPrimitive(option)
        viewer.scene.primitives.add(oneCommand1);
        window.command.push(oneCommand1);
    }
}
for (let i of level) {
    for (let j of list) {
        let perOne = oneTriangle[i][j];
        let option = {
            commandType: 'Draw',
            attributes: {
                "position": {
                    index: 0,
                    componentsPerAttribute: 3,
                    vertexBuffer: perOne.position,
                    // vertexBuffer: perOne.position,
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },

            },
            modelMatrix: modelMatrix,
            // primitiveType: Cesium.PrimitiveType.LINES,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            uniformMap: {
                // u_plane: () => { return { x: 0 - planeOne.normal.x, y: 0 - planeOne.normal.y, z: 0 - planeOne.normal.z, w: planeOne.distance } },
            },
            pass: Cesium.Pass.TRANSLUCENT,
            vertexShaderSource: baseVS,
            fragmentShaderSource: poscolorFS,
            rawRenderState:
                Util.createRawRenderState({
                    // undefined value means let Cesium deal with it
                    // viewport: undefined,
                    depthTest: {
                        enabled: true
                    },
                    // depthMask: true
                }),
            // framebuffer: this.framebuffers.segments,
            autoClear: false
        }
        let oneCommand1 = new CustomPrimitive(option)
        viewer.scene.primitives.add(oneCommand1);
        window.command.push(oneCommand1);
    }
}
//////////////////////////////////
// Draw command 2



viewer.scene.globe.depthTestAgainstTerrain = true;
