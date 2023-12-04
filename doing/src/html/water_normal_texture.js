
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import "/public/cesium/Widgets/widgets.css";

// import { CustomPrimitive, initFinished } from '../../../cesium-dc-command/src/jsm/customPrimitive';
// import *  as Util from "../../../cesium-dc-command/src/jsm/baseUtil"

// import cmWaterC12FS from "../shaders/CM/cmWaterC12.fs.glsl?raw"
// import cm4FS from "../shaders/CM/cm4.fs.glsl?raw"
// import redFS from "../shaders/base/red.FS.glsl?raw"
// import copyFS from "../shaders/base/cp.FS.glsl?raw"

// import baseVS from "../shaders/base/base.VS.glsl?raw"
// import quadVS from "../shaders/base/quad.VS.glsl?raw"

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

// viewer.camera.setView({
//     destination: Cesium.Cartesian3.fromDegrees(116.39, 39.811, 1000),
//     orientation: {
//         heading: Cesium.Math.toRadians(0.0),
//         pitch: Cesium.Math.toRadians(-90.0),
//     }
// });
// window.Cesium = Cesium;//add by tom
// window.viewer = viewer;

// var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

// let FBO = {};

// let option2 = {
//     name: 1,
//     commandType: 'Draw',
//     // attributes: {
//     //     "position": {
//     //         index: 0,
//     //         componentsPerAttribute: 3,
//     //         vertexBuffer: [
//     //             //34
//     //             //12
//     //             // -10000, -10000, 0, // 1
//     //             // 10000, -10000, 0, // 2
//     //             // 10000, 10000, 0, // 4

//     //             // -10000, -10000, 0, // 1
//     //             // 10000, 10000, 0,//4
//     //             // -10000, 10000, 0, //3 

//     //             // //34
//     //             // //12
//     //             -1000, -1000, 0,//1
//     //             1000, -1000, 0,//2
//     //             -1000, 1000, 0,//3

//     //             1000, -1000, 0,//2
//     //             1000, 1000, 0,//4
//     //             -1000, 1000, 0,//3
//     //         ],//normal array
//     //         componentDatatype: Cesium.ComponentDatatype.FLOAT
//     //     },
//     //     "uv": {
//     //         index: 1,
//     //         componentsPerAttribute: 2,
//     //         vertexBuffer: [
//     //             // 0, 0,
//     //             // 1, 0,
//     //             // 1, 1,

//     //             // 0, 0,
//     //             // 1, 1,
//     //             // 0, 1,


//     //             0,0,
//     //             1,0,
//     //             0,1,

//     //             1,0,
//     //             1,1,
//     //             0,1,
//     //         ],//normal array
//     //         componentDatatype: Cesium.ComponentDatatype.FLOAT
//     //     }
//     // },

//     attributes: {
//         "position": {
//             index: 0,
//             componentsPerAttribute: 3,
//             vertexBuffer: [
//                 -100, -100, 0, // 1
//                 100, -100, 0, // 2
//                 100, 100, 0, // 4

//                 -100, -100, 0, // 1
//                 100, 100, 0,//4
//                 -100, 100, 0, //3 
//             ],//normal array
//             componentDatatype: Cesium.ComponentDatatype.FLOAT
//         },
//         "uv": {
//             index: 1,
//             componentsPerAttribute: 2,
//             vertexBuffer: [
//                 0, 0,
//                 1, 0,
//                 1, 1,

//                 0, 0,
//                 1, 1,
//                 0, 1,
//             ],//normal array
//             componentDatatype: Cesium.ComponentDatatype.FLOAT
//         }
//     },
//     modelMatrix: modelMatrix,
//     primitiveType: Cesium.PrimitiveType.TRIANGLES,
//     uniformMap: {
//         // iChannel0: () => { return this.particleStateTexture0; },

//     },
//     textures: {
//         iChannel0: "0",
//         iChannel1: "1",
//     },
//     vertexShaderSource: quadVS,
//     fragmentShaderSource: cmWaterC12FS,
//     // rawRenderState:
//     //     Util.createRawRenderState({
//     //         // undefined value means let Cesium deal with it
//     //         viewport: undefined,
//     //         depthTest: {
//     //             enabled: true
//     //         },
//     //         depthMask: true
//     //     }),
//     // framebuffer: this.framebuffers.segments,
//     autoClear: false,
//     preInit: async (scope) => {
//         //grayNoise64x64.png
//         scope.DS_textures[0] = await Util.createTextureFromUrl(scope.frameState.context, "/water/waterNormalsSmall1.jpg");
//         scope.DS_textures[1] = await Util.createTextureFromUrl(scope.frameState.context, "/water/waterNormalsSmall2.jpg");
//         // scope.DS_textures[1]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/gray/noise_clouds.png");
//         console.log("pre init")
//         //pebbles.png


//     }
// }

// let oneCommand1 = new CustomPrimitive(option2)

// window.main = [oneCommand1,];


// viewer.scene.globe.depthTestAgainstTerrain = true;
// viewer.scene.primitives.add(oneCommand1);



// water 1
// //河道关键点数组
var River1Point = [
    115.5985634205044, 32.43079913513041,
    116.5985634205044, 32.43079913513041,
    116.5985634205044, 33.43079913513041,
    115.5985634205044, 33.43079913513041,
];
// //河道1多边形
// var polygon1 = new Cesium.PolygonGeometry({
//     polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(River1Point)),
//     extrudedHeight: 0,
//     height: 0,
//     vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
// });
// var River1 = new Cesium.Primitive({
//     geometryInstances: new Cesium.GeometryInstance({
//         geometry: polygon1
//     }),
//     appearance: new Cesium.EllipsoidSurfaceAppearance({
//         aboveGround: true
//     }),
//     show: true
// });
// var River1_Material = new Cesium.Material({
//     fabric: {
//         type: 'Water',
//         uniforms: {
//             normalMap: '/water/waterNormalsSmall1.jpg',
//             frequency: 100.0,
//             animationSpeed: 0.01,
//             amplitude: 10.0
//         }
//     }
// });
// var scene = viewer.scene;
// River1.appearance.material = River1_Material;
// scene.primitives.add(River1);           //添加到场景

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(115.5985634205044, 32.43079913513041, 300000)
});




// //water 2
// //_polygonArr 为polygon的坐标
let waterPrimitive = new Cesium.Primitive({
    allowPicking: false,
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
            // polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3
            //     .fromDegreesArrayHeights(_polygonArr)),
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(River1Point)),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        })
    }),
    // 使用内置的水面shader
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: true,
        material: new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    baseWaterColor: new Cesium.Color(37/255, 66/255, 124/255, 1.0),
                    // baseWaterColor: new Cesium.Color(3/255, 153/255, 98/255, 1),
                    // baseWaterColor: new Cesium.Color(162/255, 249/255, 245/255, 1),
                    //设置水面使用的图片，
                    //此图片在Cesium源码Source\Assets\Textures文件夹中
                    normalMap: '/material/water/normal/waterNormalsSmall1.jpg',
                    //频率速度设置
                    frequency: 200.0,//波纹数量
                    animationSpeed: 0.01,//水流速度
                    amplitude: 50.0,//波纹振幅
                    specularIntensity:0,//镜面反射强度
                    u_alpha:1
                }
            }
        }),
        fragmentShaderSource: 'varying vec3 v_positionMC;\n' +
'varying vec3 v_positionEC;\n' +
'varying vec2 v_st;\n' +
// 'uniform float alpha;\n'+
'void main()\n' +
'{\n' +
  'czm_materialInput materialInput;\n' +
  'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
  '#ifdef FACE_FORWARD\n' +
  'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
  '#endif\n' +
  'materialInput.s = v_st.s;\n' +
  'materialInput.st = v_st;\n' +
  'materialInput.str = vec3(v_st, 0.0);\n' +
  'materialInput.normalEC = normalEC;\n' +
  'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
  'vec3 positionToEyeEC = -v_positionEC;\n' +
  'materialInput.positionToEyeEC = positionToEyeEC;\n' +
  'czm_material material = czm_getMaterial(materialInput);\n' +
   '#ifdef FLAT\n' +
   'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
   '#else\n' +
     'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n' +
   'gl_FragColor.a=u_alpha_6;\n' +
   '#endif\n' +
'}\n',
    })
});
//添加水面数据到viewer中
viewer.scene.primitives.add(waterPrimitive);



