
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

let planeOne = new Cesium.ClippingPlane(
    new Cesium.Cartesian3(0.0, 1.0, 0.0),
    0.0);
//保存的old plane 参数
let planeOneOld = Cesium.ClippingPlane.clone(planeOne);
//console.log(planeOneOld)
let selectedPlane;
// Select plane when mouse down
const downHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
);
let click = false;


downHandler.setInputAction(function (movement) {
    const pickedObject = scene.pick(movement.position);
    if (
        Cesium.defined(pickedObject) &&
        Cesium.defined(pickedObject.id) &&
        Cesium.defined(pickedObject.id.plane)
    ) {
        selectedPlane = pickedObject.id.plane;
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.5);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        scene.screenSpaceCameraController.enableInputs = false;
        click = true;
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

// Release plane on mouse up
const upHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
);
upHandler.setInputAction(function () {
    if (Cesium.defined(selectedPlane)) {
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        selectedPlane = undefined;
        click = false;
    }

    scene.screenSpaceCameraController.enableInputs = true;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

let targetY = 0.0;
// Update plane on mouse move
const moveHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
);
moveHandler.setInputAction(function (movement) {
    if (Cesium.defined(selectedPlane) && click) {
        const deltaY = movement.startPosition.y - movement.endPosition.y;
        // //console.log(deltaY, targetY)
        targetY -= deltaY;
        planeOne.distance = targetY;
        // //console.log(planeOne.distance)

    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

function createPlaneUpdateFunction(plane) {
    return function () {
        plane.distance = targetY;
        return plane;
    };
}
// createPlaneUpdateFunction(selectedPlane)
const planeEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lang, lat, 200),
    plane: {
        dimensions: new Cesium.Cartesian2(5500, 5500),
        material: Cesium.Color.WHITE.withAlpha(0.1),
        plane: new Cesium.CallbackProperty(
            createPlaneUpdateFunction(planeOne),
            false
        ),
        outline: true,
        outlineColor: Cesium.Color.WHITE,
    },
});


//////////////////////////////////
//main Draw command 

let selected = true;
let selectedNotNull = true;


viewer.scene.globe.depthTestAgainstTerrain = true;
window.command = [];
let level = ["one", "two", "three"];
let list = ["top", "bottom", "side"];
let listnetwork = ["networks"];
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
                u_plane: () => { return { x: 0 - planeOne.normal.x, y: 0 - planeOne.normal.y, z: 0 - planeOne.normal.z, w: planeOne.distance } },
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
                u_plane: () => { return { x: 0 - planeOne.normal.x, y: 0 - planeOne.normal.y, z: 0 - planeOne.normal.z, w: planeOne.distance } },
            },
            pass: Cesium.Pass.TRANSLUCENT,
            vertexShaderSource: cubeVS,
            fragmentShaderSource: cubeClippingFS,
            //  vertexShaderSource: baseVS,
            // fragmentShaderSource: poscolorFS,
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



//////////////////////////////////
// Draw command 2

let cubeBox = new cube();
window.cube = cubeBox;
cubeBox.generateNetworksBydata(oneTriangle.one.networks.position);
cubeBox.getDelaunay2D([planeOne.normal.x, planeOne.normal.y, planeOne.normal.z, planeOne.distance]);
let option2 = {
    commandType: 'Draw',
    attributes: {
        "position": {
            index: 0,
            componentsPerAttribute: 3,
            vertexBuffer: cubeBox.clippingTriangles,
            componentDatatype: Cesium.ComponentDatatype.FLOAT
        },

    },
    modelMatrix: modelMatrix,
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    uniformMap: {
        u_plane: () => { return { x: 0 - planeOne.normal.x, y: 0 - planeOne.normal.y, z: 0 - planeOne.normal.z, w: planeOne.distance } },
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
            // depthMask: true
        }),
    // framebuffer: this.framebuffers.segments,
    autoClear: false,
    reNew: function (scope) {
        if (planeOne.normal.x != planeOneOld.normal.x || planeOne.normal.y != planeOneOld.normal.y || planeOne.normal.z != planeOneOld.normal.z
            || planeOne.distance != planeOneOld.distance) {
            // console.log("distance 变换", planeOne.distance, planeOneOld.distance)
            cubeBox.getDelaunay2D([planeOne.normal.x, planeOne.normal.y, planeOne.normal.z, planeOne.distance]);
            if (cubeBox.clippingTriangles.length > 0) {
                scope.attributes.position.vertexBuffer = cubeBox.clippingTriangles;
                selectedNotNull = true;
            }
            else {
                selectedNotNull = false;
            }
            planeOneOld = Cesium.ClippingPlane.clone(planeOne);
            return true;
        }
        else {
            return false;
        }


    },
    ready: () => {
        if (selected && selectedNotNull) {
            return true;
        }
        else {
            return false;
        }
    }
}
let oneCommand2 = new CustomPrimitive(option2)
window.command2 = oneCommand2;