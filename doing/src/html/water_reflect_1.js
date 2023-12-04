
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


viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(115.5985634205044, 32.43079913513041, 300000)
});


var River1Point = [
    115.5985634205044, 32.43079913513041,
    116.5985634205044, 32.43079913513041,
    116.5985634205044, 33.43079913513041,
    115.5985634205044, 33.43079913513041,
];


const appearance = new Cesium.EllipsoidSurfaceAppearance({ aboveGround: true });

// // 设置该 framebuffer 的 color attachments 0 为 sampler2D uniform
// let context = Cesium.Context();
// const texture = Cesium.Texture.fromFramebuffer({
//     context,
// });
// texture.type = "sampler2D";

// console.log("=============FBO==========", context)



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



