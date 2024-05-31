import * as Cesium from 'cesium';
import { getViewMatrix } from "./src/math.js"
import { vec2, vec3, vec4, mat4, mat3 } from "wgpu-matrix";

let langRight = 116.461963;
let latBottom = 39.758976;
let langLeft = 116.048341;
let latTop = 39.894677;
let R = 18000;

///////////////////////////////////////////////////////////////////////////////////////
//center and local matrix

let center = Cesium.Cartesian3.fromDegrees((langRight - langLeft) / 2 + langLeft, (latTop - latBottom) / 2 + latBottom, 0);
console.log((langRight - langLeft) / 2 + langLeft, (latTop - latBottom) / 2 + latBottom)
let A = Cesium.Cartesian3.fromDegrees(langLeft, latBottom, 0);
let B = Cesium.Cartesian3.fromDegrees(langRight, latBottom, 0);
let C = Cesium.Cartesian3.fromDegrees(langLeft, latTop, 0);
let D = Cesium.Cartesian3.fromDegrees(langRight, latTop, 0);
let depth = [75.84876251, 60.84876633, 35.84876633, 10.84876585];
let pointsList = [];
pointsList.push(A, B, C, D);
// console.log("三维笛卡尔", A, B, C, D)

let centerMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(A);
let centerMatrix_inverse = Cesium.Matrix4.inverse(centerMatrix, new Cesium.Matrix4())

//验证用
// //通过经纬度和当前点的逆矩阵得到的，local坐标
// let A1 = Cesium.Matrix4.multiplyByPoint(centerMatrix_inverse, A, new Cesium.Cartesian3());
// let B1 = Cesium.Matrix4.multiplyByPoint(centerMatrix_inverse, B, new Cesium.Cartesian3());
// let C1 = Cesium.Matrix4.multiplyByPoint(centerMatrix_inverse, C, new Cesium.Cartesian3());
// let D1 = Cesium.Matrix4.multiplyByPoint(centerMatrix_inverse, D, new Cesium.Cartesian3());
// let localPoints = [];//逆矩阵转换后的三维笛卡尔
// localPoints.push(A1, B1, C1, D1);
// // console.log("local 空间中的ABCD", A1, B1, C1, D1)

////////////////////////////////////////////////////////////////////////////////////
//plane ，从三维笛卡尔到local坐标的矩阵
let plane = [A.x, A.y, A.z];
let M4 = getViewMatrix(plane);
let M4_inverse = mat4.inverse(M4);



///////////////////////////////////////////////////////////////////////////////////////
//local 坐标
let llList = [];//2次转换后的三维笛卡尔
let points = [];
for (let i of pointsList) {
    // let perOne = vec3.create(i.x , i.y , i.z );
    let perOne = vec3.create(i.x - A.x, i.y - A.y, i.z - A.z);
    console.log("局部控制中相减后的坐标", perOne);
    let per = vec3.transformMat4(perOne, M4_inverse);
    //以下验证正确
    // let x = parseFloat(per[0]), y = parseFloat(per[1]), z = parseFloat(per[2]);
    // let c3O = new Cesium.Cartesian3(x, y, z);
    // let c3 = Cesium.Matrix4.multiplyByPoint(centerMatrix, c3O, new Cesium.Cartesian3());
    // // llList.push(c3)
    points.push(per);
}
// console.log(llList)





