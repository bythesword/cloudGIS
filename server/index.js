
import fs from "fs"
import * as Cesium from 'cesium';
import { getViewMatrix } from "./src/math.js"
import { vec2, vec3, vec4, mat4, mat3 } from "wgpu-matrix";
// import { data as pointsOfLangLatDepth } from "./lldddd.json"

// function getTTT() {
let langRight = 116.43;
let latBottom = 39.758976;
let langLeft = 116.4;
let latTop = 39.794677;
let R = 18000;

///////////////////////////////////////////////////////////////////////////////////////
//center and local matrix

let center = Cesium.Cartesian3.fromDegrees((langRight - langLeft) / 2 + langLeft, (latTop - latBottom) / 2 + latBottom, 0);
let plane = [center.x, center.y, center.z];
let M4 = getViewMatrix(plane);
let M4_inverse = mat4.inverse(M4);

///////////////////////////////////////////////////////////////////
//未使用
let A = Cesium.Cartesian3.fromDegrees(langLeft, latBottom, 0);
let B = Cesium.Cartesian3.fromDegrees(langRight, latBottom, 0);
let C = Cesium.Cartesian3.fromDegrees(langLeft, latTop, 0);
let D = Cesium.Cartesian3.fromDegrees(langRight, latTop, 0);
let pointsList = [];
pointsList.push(A, B, C, D);
////////////////////////////////////////////////////////////////////////////////////
//plane ，从三维笛卡尔到local坐标的矩阵
let dataFromFile = fs.readFileSync("lldddd.json");
let pointsOfLangLatDepth = JSON.parse(dataFromFile);
// let pointsOfLangLatDepth = [
//     [
//         langLeft, latBottom, [1500, 500, 500, 500]
//     ],
//     [
//         langRight, latBottom, [1500, 500, 500, 500]
//     ],
//     [
//         langLeft, latTop, [1500, 500, 500, 500]
//     ]
// ]
///////////////////////////////////////////////////////////////////////////////////////
//local 坐标
let pointsOne = {
    top: {
        index: [],
        position: [],
        objectList: {
            // name:"",
            // index:0
        }
    },
    bottom: {
        index: [],
        position: [],
        objectList: {}
    },
    side: {
        index: [],
        position: [],
        objectList: {}
    },
    topNetworks: {
        index: [],
        position: [],
        objectList: {}
    },
    bottomNetworks: {
        index: [],
        position: [],
        objectList: {}
    },
    sideNetworks: {
        index: [],
        position: [],
        objectList: {}
    },
    frameLines: {
        index: [],
        position: [],
        objectList: {}
    },
    networks: {
        index: [],
        position: [],
    }
};
let allTerrain = {};
let level = ["one", "two", "three"]
for (let i of level) {
    allTerrain[i] = JSON.parse(JSON.stringify(pointsOne));
}
// for (let i of pointsOfLangLatDepth) {
//     let perOne = vec3.create(i.x - center.x, i.y - center.y, i.z - center.z);
//     //console.log("局部控制中相减后的坐标", perOne);
//     let per = vec3.transformMat4(perOne, M4_inverse);
//     points.push(per);
// }

for (let i = 0; i < pointsOfLangLatDepth.length; i += 3) {
    let perOneA = pointsOfLangLatDepth[i];
    let perOneB = pointsOfLangLatDepth[i + 1];
    let perOneC = pointsOfLangLatDepth[i + 2];
    let AdepthZ = [];
    let BdepthZ = [];
    let CdepthZ = [];
    for (let j = 0; j < level.length; j++) {
        if (j === 0) {
            let value_A_depth;
            let value_B_depth;
            let value_C_depth;
            for (let depth_i in perOneA[2]) {
                if (depth_i == 0) {
                    value_A_depth = perOneA[2][0];
                    value_B_depth = perOneB[2][0];
                    value_C_depth = perOneC[2][0];
                }
                else {
                    value_A_depth -= perOneA[2][depth_i];
                    value_B_depth -= perOneB[2][depth_i];
                    value_C_depth -= perOneC[2][depth_i];
                }
                AdepthZ.push(value_A_depth);
                BdepthZ.push(value_B_depth);
                CdepthZ.push(value_C_depth);
            }
        }

        let terrain = allTerrain[level[j]];
        //坐标转换到三维笛卡尔
        let A_top = Cesium.Cartesian3.fromDegrees(perOneA[0], perOneA[1], AdepthZ[j]);
        let B_top = Cesium.Cartesian3.fromDegrees(perOneB[0], perOneB[1], BdepthZ[j]);
        let C_top = Cesium.Cartesian3.fromDegrees(perOneC[0], perOneC[1], CdepthZ[j]);
        let A_bottom = Cesium.Cartesian3.fromDegrees(perOneA[0], perOneA[1], AdepthZ[j + 1]);
        let B_bottom = Cesium.Cartesian3.fromDegrees(perOneB[0], perOneB[1], BdepthZ[j + 1]);
        let C_bottom = Cesium.Cartesian3.fromDegrees(perOneC[0], perOneC[1], CdepthZ[j + 1]);

        let A_top_local = vec3.transformMat4(vec3.create(A_top.x - center.x, A_top.y - center.y, A_top.z - center.z), M4_inverse);
        let B_top_local = vec3.transformMat4(vec3.create(B_top.x - center.x, B_top.y - center.y, B_top.z - center.z), M4_inverse);
        let C_top_local = vec3.transformMat4(vec3.create(C_top.x - center.x, C_top.y - center.y, C_top.z - center.z), M4_inverse);
        let A_bottom_local = vec3.transformMat4(vec3.create(A_bottom.x - center.x, A_bottom.y - center.y, A_bottom.z - center.z), M4_inverse);
        let B_bottom_local = vec3.transformMat4(vec3.create(B_bottom.x - center.x, B_bottom.y - center.y, B_bottom.z - center.z), M4_inverse);
        let C_bottom_local = vec3.transformMat4(vec3.create(C_bottom.x - center.x, C_bottom.y - center.y, C_bottom.z - center.z), M4_inverse);

        terrain.top.position.push(A_top_local[0], A_top_local[1], A_top_local[2], B_top_local[0], B_top_local[1], B_top_local[2], C_top_local[0], C_top_local[1], C_top_local[2]);
        terrain.top.index.push(i, i + 1, i + 2);
        terrain.bottom.position.push(A_bottom_local[0], A_bottom_local[1], A_bottom_local[2], B_bottom_local[0], B_bottom_local[1], B_bottom_local[2], C_bottom_local[0], C_bottom_local[1], C_bottom_local[2]);
        terrain.bottom.index.push(i, i + 1, i + 2);
        //侧面，记录三个点的index，不是三角形
        let side1 = [i, i + 1].sort().join("_");
        let side2 = [i + 1, i + 2].sort().join("_");
        let side3 = [i + 2, i].sort().join("_");
        if (typeof terrain.side.objectList[side1] == 'undefined') {
            terrain.side.objectList[side1] = { index: [i, i + 1], show: 0 };
        }
        else {
            terrain.side.objectList[side1].show += 1;
        }

        if (typeof terrain.side.objectList[side2] == 'undefined') {
            terrain.side.objectList[side2] = { index: [i + 1, i + 2], show: 0 };
        }
        else {
            terrain.side.objectList[side2].show += 1;
        }

        if (typeof terrain.side.objectList[side3] == 'undefined') {
            terrain.side.objectList[side3] = { index: [i + 2, i], show: 0 };
        }
        else {
            terrain.side.objectList[side3].show += 1;
        }
        // terrain.side.objectList[side2] = [i + 1, i + 2];
        // terrain.side.objectList[side3] = [i + 2, i];
        // //console.log(terrain.side.objectList[side_index]);

        //上下两个三角形的边框，计算一个，后期增加深度
        let nwTop1 = [i, i + 1].sort().join("_");
        let nwTop2 = [i + 1, i + 2].sort().join("_");
        let nwTop3 = [i + 2, i].sort().join("_");
        terrain.topNetworks.objectList[nwTop1] = [i, i + 1];
        terrain.topNetworks.objectList[nwTop2] = [i + 1, i + 2];
        terrain.topNetworks.objectList[nwTop3] = [i + 2, i];

        let nwBottom1 = [i, i + 1].sort().join("_");
        let nwBottom2 = [i + 1, i + 2].sort().join("_");
        let nwBottom3 = [i + 2, i].sort().join("_");
        terrain.bottomNetworks.objectList[nwBottom1] = [i, i + 1];
        terrain.bottomNetworks.objectList[nwBottom2] = [i + 1, i + 2];
        terrain.bottomNetworks.objectList[nwBottom3] = [i + 2, i];


        let nwSide1 = [i, i].sort().join("_");
        let nwSide2 = [i + 1, i + 1].sort().join("_");
        let nwSide3 = [i + 2, i + 2].sort().join("_");

        if (typeof terrain.sideNetworks.objectList[nwSide1] == 'undefined') {
            terrain.sideNetworks.objectList[nwSide1] = { index: [i, i], show: 0 };
        }
        else {
            terrain.sideNetworks.objectList[nwSide1].show += 1;
        }

        if (typeof terrain.sideNetworks.objectList[nwSide2] == 'undefined') {
            terrain.sideNetworks.objectList[nwSide2] = { index: [i + 1, i + 1], show: 0 };
        }
        else {
            terrain.sideNetworks.objectList[nwSide2].show += 1;
        }
        if (typeof terrain.sideNetworks.objectList[nwSide3] == 'undefined') {
            terrain.sideNetworks.objectList[nwSide3] = { index: [i + 2, i + 2], show: 0 };
        }
        else {
            terrain.sideNetworks.objectList[nwSide3].show += 1;
        }
    }
}


//侧面，消隐不需要的side
let allTerrain_i = 0;
for (let i in allTerrain) {
    let perLevel = allTerrain[i];
    let side = perLevel.side;

    /**
     * A  B
     * C  D 
     */
    for (let j in side.objectList) {
        let oneSide = side.objectList[j];
        if (oneSide.show == 0) {
            let depthA = pointsOfLangLatDepth[oneSide.index[0]][2][0];
            let depthB = pointsOfLangLatDepth[oneSide.index[1]][2][0];
            let depthAA1 = depthA - pointsOfLangLatDepth[oneSide.index[0]][2][1];
            let depthBA1 = depthA - pointsOfLangLatDepth[oneSide.index[1]][2][1];
            for (let ii = 0; ii < allTerrain_i; ii++) {
                {
                    depthA = depthA - pointsOfLangLatDepth[oneSide.index[0]][2][1];
                    depthB = depthB - pointsOfLangLatDepth[oneSide.index[1]][2][1];
                }
                {
                    depthAA1 -= pointsOfLangLatDepth[oneSide.index[0]][2][ii + 1];
                    depthBA1 -= pointsOfLangLatDepth[oneSide.index[1]][2][ii + 1];
                }
            }
            //console.log(i, j, depthA, depthB, depthAA1, depthBA1);
            //四个点的三维笛卡尔
            let sidePointA = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[oneSide.index[0]][0], pointsOfLangLatDepth[oneSide.index[0]][1], depthA);
            let sidePointB = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[oneSide.index[1]][0], pointsOfLangLatDepth[oneSide.index[1]][1], depthB);
            let sidePointC = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[oneSide.index[0]][0], pointsOfLangLatDepth[oneSide.index[0]][1], depthAA1);
            let sidePointD = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[oneSide.index[1]][0], pointsOfLangLatDepth[oneSide.index[1]][1], depthBA1);
            //四个点的local
            let A_side_local = vec3.transformMat4(vec3.create(sidePointA.x - center.x, sidePointA.y - center.y, sidePointA.z - center.z), M4_inverse);
            let B_side_local = vec3.transformMat4(vec3.create(sidePointB.x - center.x, sidePointB.y - center.y, sidePointB.z - center.z), M4_inverse);
            let C_side_local = vec3.transformMat4(vec3.create(sidePointC.x - center.x, sidePointC.y - center.y, sidePointC.z - center.z), M4_inverse);
            let D_side_local = vec3.transformMat4(vec3.create(sidePointD.x - center.x, sidePointD.y - center.y, sidePointD.z - center.z), M4_inverse);

            //push index，after for Z axis(web) 
            side.index.push(oneSide.index[0], oneSide.index[1], oneSide.index[0], oneSide.index[1], oneSide.index[1], oneSide.index[0]);
            //push triangl non-index
            side.position.push(
                C_side_local[0], C_side_local[1], C_side_local[2],
                D_side_local[0], D_side_local[1], D_side_local[2],
                A_side_local[0], A_side_local[1], A_side_local[2],

                D_side_local[0], D_side_local[1], D_side_local[2],
                B_side_local[0], B_side_local[1], B_side_local[2],
                A_side_local[0], A_side_local[1], A_side_local[2],
            );
        }
    }
    side.objectList=null;
    allTerrain_i++;
}


allTerrain_i = 0;
//网格，全部的，等同于外壳frame。没有做单个体的network，如果以后有水等，可能需要单体
for (let i in allTerrain) {
    let perLevel = allTerrain[i];
    let topNetworks = perLevel.topNetworks;
    let bottomNetworks = perLevel.bottomNetworks;
    let sideNetworks = perLevel.sideNetworks;
    for (let j in topNetworks.objectList) {
        let perOne = topNetworks.objectList[j];

        let depthA = pointsOfLangLatDepth[perOne[0]][2][0];
        let depthB = pointsOfLangLatDepth[perOne[1]][2][0];
        let depthAA1 = depthA - pointsOfLangLatDepth[perOne[0]][2][1];
        let depthBA1 = depthA - pointsOfLangLatDepth[perOne[1]][2][1];
        for (let ii = 0; ii < allTerrain_i; ii++) {
            {
                depthA = depthA - pointsOfLangLatDepth[perOne[0]][2][1];
                depthB = depthB - pointsOfLangLatDepth[perOne[1]][2][1];
            }
            {
                depthAA1 -= pointsOfLangLatDepth[perOne[0]][2][ii + 1];
                depthBA1 -= pointsOfLangLatDepth[perOne[1]][2][ii + 1];
            }
        }
        let pointA = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne[0]][0], pointsOfLangLatDepth[perOne[0]][1], depthA);
        let pointB = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne[1]][0], pointsOfLangLatDepth[perOne[1]][1], depthB);
        let A_local = vec3.transformMat4(vec3.create(pointA.x - center.x, pointA.y - center.y, pointA.z - center.z), M4_inverse);
        let B_local = vec3.transformMat4(vec3.create(pointB.x - center.x, pointB.y - center.y, pointB.z - center.z), M4_inverse);
        //console.log(A_local, B_local);
        topNetworks.index.push(perOne[0], perOne[1]);
        topNetworks.position.push(A_local[0], A_local[1], A_local[2], B_local[0], B_local[1], B_local[2]);
    }
    for (let j in bottomNetworks.objectList) {
        let perOne = bottomNetworks.objectList[j];
        let depthA = pointsOfLangLatDepth[perOne[0]][2][0];
        let depthB = pointsOfLangLatDepth[perOne[1]][2][0];
        let depthAA1 = depthA - pointsOfLangLatDepth[perOne[0]][2][1];
        let depthBA1 = depthA - pointsOfLangLatDepth[perOne[1]][2][1];
        for (let ii = 0; ii < allTerrain_i; ii++) {
            {
                depthA = depthA - pointsOfLangLatDepth[perOne[0]][2][1];
                depthB = depthB - pointsOfLangLatDepth[perOne[1]][2][1];
            }
            {
                depthAA1 -= pointsOfLangLatDepth[perOne[0]][2][ii + 1];
                depthBA1 -= pointsOfLangLatDepth[perOne[1]][2][ii + 1];
            }
        }
        let pointA = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne[0]][0], pointsOfLangLatDepth[perOne[0]][1], depthAA1);
        let pointB = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne[1]][0], pointsOfLangLatDepth[perOne[1]][1], depthBA1);
        let A_local = vec3.transformMat4(vec3.create(pointA.x - center.x, pointA.y - center.y, pointA.z - center.z), M4_inverse);
        let B_local = vec3.transformMat4(vec3.create(pointB.x - center.x, pointB.y - center.y, pointB.z - center.z), M4_inverse);
        bottomNetworks.index.push(perOne[0], perOne[1]);
        bottomNetworks.position.push(A_local[0], A_local[1], A_local[2], B_local[0], B_local[1], B_local[2]);
    }
    for (let j in sideNetworks.objectList) {

        let perOne = sideNetworks.objectList[j];
        if (perOne.show == 0) {
            let depthA = pointsOfLangLatDepth[perOne.index[0]][2][0];
            let depthB = pointsOfLangLatDepth[perOne.index[1]][2][0];
            let depthAA1 = depthA - pointsOfLangLatDepth[perOne.index[0]][2][1];
            let depthBA1 = depthA - pointsOfLangLatDepth[perOne.index[1]][2][1];
            for (let ii = 0; ii < allTerrain_i; ii++) {
                {
                    depthA = depthA - pointsOfLangLatDepth[perOne.index[0]][2][1];
                    depthB = depthB - pointsOfLangLatDepth[perOne.index[1]][2][1];
                }
                {
                    depthAA1 -= pointsOfLangLatDepth[perOne.index[0]][2][ii + 1];
                    depthBA1 -= pointsOfLangLatDepth[perOne.index[1]][2][ii + 1];
                }
            }
            // if (perOne.show === 0)
            {
                let pointA = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne.index[0]][0], pointsOfLangLatDepth[perOne.index[0]][1], depthA);
                let pointB = Cesium.Cartesian3.fromDegrees(pointsOfLangLatDepth[perOne.index[1]][0], pointsOfLangLatDepth[perOne.index[1]][1], depthAA1);
                let A_local = vec3.transformMat4(vec3.create(pointA.x - center.x, pointA.y - center.y, pointA.z - center.z), M4_inverse);
                let B_local = vec3.transformMat4(vec3.create(pointB.x - center.x, pointB.y - center.y, pointB.z - center.z), M4_inverse);
                sideNetworks.index.push(perOne.index[0], perOne.index[1]);
                sideNetworks.position.push(A_local[0], A_local[1], A_local[2], B_local[0], B_local[1], B_local[2]);
            }
        }
    }
    allTerrain_i++;
}
// //console.log("all terrian", allTerrain)

for (let i in allTerrain) {
    let perLevel = allTerrain[i];
    let topNetworks = perLevel.topNetworks;
    let bottomNetworks = perLevel.bottomNetworks;
    let sideNetworks = perLevel.sideNetworks;
    perLevel.networks.position = topNetworks.position.concat(bottomNetworks.position).concat(sideNetworks.position);
    perLevel.networks.index = topNetworks.index.concat(bottomNetworks.index).concat(sideNetworks.index);
    perLevel.topNetworks = null;
    perLevel.bottomNetworks = null;
    perLevel.sideNetworks = null;
}
var ws = fs.createWriteStream("onetriangle.json", 'utf-8');
// //console.log(JSON.stringify(dat.data.res[i]));
ws.write(JSON.stringify(allTerrain));

// return allTerrain
// }

// export { getTTT }