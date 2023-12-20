
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import "/public/cesium/Widgets/widgets.css";


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjNiZTgxOS0xZDYwLTQzNzctYWRkOS00ZjJkZDI2YjA5MGMiLCJpZCI6ODMyOTksImlhdCI6MTY0NTY3MTU4NH0.2bu4bjqgk1yx5JMdC1iU8j65IlMztD4KI11scmH_sHQ';

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
    }),
});


let x1 = 116.3915382409668;
let y1 = 39.9085;


viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(x1, y1, 6000)
});

let a = Cesium.Cartesian3.fromDegrees(x1, y1, 0);
var en_a_local_martix = Cesium.Transforms.eastNorthUpToFixedFrame(a);

// var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)


viewer.entities.add(new Cesium.Entity({
    position: a,
    label: {
        text: "A\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.RED,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));

// let b = new Cesium.Cartesian3(a.x + 1000, a.y + 0, a.z);
let b = Cesium.Cartesian3.fromDegrees(x1, y1 + 0.006, 0);

viewer.entities.add(new Cesium.Entity({
    position: b,
    label: {
        text: "B\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.RED,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));



let result = new Cesium.Cartesian3();


// Cesium.Cartesian3.projectVector (a, b, result) 

let c = Cesium.Cartesian3.projectVector(b, a, result);


viewer.entities.add(new Cesium.Entity({
    position: c,
    label: {
        text: "C\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.BLUE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let c1x = b.x - c.x;
let c1y = b.y - c.y;
let c1z = b.z - c.z


console.log("a=", a);
console.log("b=", b);
console.log("a--b距离,cesium 计算:", Cesium.Cartesian3.distance(a, b));
console.log("a--b距离:sqrt", Math.sqrt(c1x * c1x + c1y * c1y + c1z * c1z));
console.log("a--b距离局部(5.8, 666, 2.13):sqrt", Math.sqrt(5.8*5.8+666*666+2.13*2.13));
// console.log("c=", c);
console.log("c=", c, c1x, c1y, c1z);
console.log("\n");

console.log("a点的地表局部坐标到全局的矩阵:", en_a_local_martix);
console.log("\n");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var rotate = Cesium.Math.toRadians(0);//转成弧度
var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotate); //quat为围绕这个z轴旋转d度的四元数
var rot_mat3 = Cesium.Matrix3.fromQuaternion(quat);//rot_mat3为根据四元数求得的旋转矩阵

let C1 = new Cesium.Cartesian3(5.8, 666, 2.13);
// let C1 = new Cesium.Cartesian3(c1y, -c1x, c1z);
console.log('C1=', C1);
let m_local = Cesium.Matrix4.fromRotationTranslation(rot_mat3, Cesium.Cartesian3.ZERO);
console.log('m_local=', m_local);
let C1_m_local = Cesium.Matrix4.multiplyByTranslation(m_local, C1, m_local);//m = m X v

// const m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
// const m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
// const m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());


// let m_local = Cesium.Matrix4.multiplyByTranslation(new Cesium.Matrix4(), C1, new Cesium.Matrix4());
console.log('m_local*C1=', C1_m_local);
console.log("\n");


let c100 = Cesium.Matrix4.multiplyByPoint(en_a_local_martix, C1, new Cesium.Cartesian3());
console.log('c100=', c100);

//与矩阵成相同 start
let C1_new_matrix = Cesium.Matrix4.multiplyTransformation(en_a_local_martix, C1_m_local, new Cesium.Matrix4());
console.log('C1_new_matrix=', C1_new_matrix);
c100 = Cesium.Matrix4.getTranslation(C1_new_matrix, new Cesium.Cartesian3());
console.log('c100=', c100);
//与矩阵成相同 end


// console.log("\n");
viewer.entities.add(new Cesium.Entity({
    position: c100,
    label: {
        text: "c100\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.BLUE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));
console.log("\n"); console.log("\n"); console.log("\n"); console.log("\n");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log("\n");
let en_a_local_martix_inverse = Cesium.Matrix4.inverse(en_a_local_martix, new Cesium.Matrix4());
console.log('D1_newen_a_local_martix_inverse_matrix=', en_a_local_martix_inverse);
let D1_new_local = Cesium.Matrix4.multiplyByPoint(en_a_local_martix_inverse, b, new Cesium.Cartesian3());
// console.log("\n");
// var d = Cesium.Matrix4.getTranslation(D1_new_matrix, new Cesium.Cartesian3());
console.log('D1_new_local=', D1_new_local);
// c1x = d.x - a.x;
// c1y = d.y - a.y;
// c1z = d.z - a.z
// console.log("d-a=xyz", c1x, c1y, c1z);
// console.log("\n"); console.log("\n");
// viewer.entities.add(new Cesium.Entity({
//     position: d,
//     label: {
//         text: "D\n",
//         font: "42px Helvetica",
//         fillColor: Cesium.Color.BLUE,
//         verticalOrigin: Cesium.VerticalOrigin.BOTTOM
//     },
// }));