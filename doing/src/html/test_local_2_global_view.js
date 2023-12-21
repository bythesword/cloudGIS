
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

/////////////////////////////////////////////////////////////////////////////////////////////
//a
/////////////////////////////////////////////////////////////////////////////////////////////
let a = Cesium.Cartesian3.fromDegrees(x1, y1, 0);
var en_a_local_martix = Cesium.Transforms.eastNorthUpToFixedFrame(a);

//axis Z normal
let axis_z_normal = Cesium.Cartesian3.normalize(a, new Cesium.Cartesian3());

//axis x ,normal 
let up = new Cesium.Cartesian3(0, 0, 1);
let axis_x = Cesium.Cartesian3.cross(up, axis_z_normal, new Cesium.Cartesian3());
let axis_x_normal = Cesium.Cartesian3.normalize(axis_x, new Cesium.Cartesian3());

//axis y , normal 
let axis_y = Cesium.Cartesian3.cross(axis_z_normal, axis_x_normal, new Cesium.Cartesian3());
let axis_y_normal = Cesium.Cartesian3.normalize(axis_y, new Cesium.Cartesian3());
// var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

// Create the Matrix3:
// [1.0, 2.0, 3.0]
// [1.0, 2.0, 3.0]
// [1.0, 2.0, 3.0]

const v = [axis_x_normal.x, axis_x_normal.y, axis_x_normal.z, 0,
axis_y_normal.x, axis_y_normal.y, axis_y_normal.z, 0,
axis_z_normal.x, axis_z_normal.y, axis_z_normal.z, 0,
    0, 0, 0, 1];
const viewMatrix = Cesium.Matrix4.fromArray(v);



viewer.entities.add(new Cesium.Entity({
    position: a,
    label: {
        text: "A\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.RED,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));

/////////////////////////////////////////////////////////////////////////////////////////////
//b
/////////////////////////////////////////////////////////////////////////////////////////////
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



/////////////////////////////////////////////////////////////////////////////////////////////
//c 投影
/////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////
//c100
/////////////////////////////////////////////////////////////////////////////////////////////
let C1 = new Cesium.Cartesian3(5.8, 666, 2.13);//b点的apply invers matrix
let c100 = Cesium.Matrix4.multiplyByPoint(en_a_local_martix, C1, new Cesium.Cartesian3());

viewer.entities.add(new Cesium.Entity({
    position: c100,
    label: {
        text: "c100\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.BLUE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));
/////////////////////////////////////////////////////////////////////////////////////////////
// print 
/////////////////////////////////////////////////////////////////////////////////////////////
let c1x = b.x - c.x;
let c1y = b.y - c.y;
let c1z = b.z - c.z


console.log("a=", a);
console.log("a_normail_z=", axis_z_normal);
console.log("up=", up);
console.log("axis_x=", axis_x);
console.log("axis_x_normal=", axis_x_normal);
console.log("axis_y=", axis_y);
console.log("axis_y_normal=", axis_y_normal);


console.log("b=", b);
console.log("a--b距离,cesium 计算:", Cesium.Cartesian3.distance(a, b));
console.log("a--b距离:sqrt", Math.sqrt(c1x * c1x + c1y * c1y + c1z * c1z));
console.log("a--b距离局部(5.8, 666, 2.13):sqrt", Math.sqrt(5.8 * 5.8 + 666 * 666 + 2.13 * 2.13));
// console.log("c=", c);
;
console.log("\n");

console.log("a点的地表局部坐标到全局的矩阵:", en_a_local_martix);
console.log("\n");



console.log("c=", c, c1x, c1y, c1z)
/////////////////////////////////////////////////////////////////////////////////////////////
// view matrix 部分
/////////////////////////////////////////////////////////////////////////////////////////////
//使用自己计算的view matrix，这个与cesium ease north的矩阵是基本相同，只是没有xyz的module部分
let np1 = new Cesium.Cartesian3(c1x, c1y, c1z);
let inverse_viewMatrix=Cesium.Matrix4.inverse (viewMatrix,  new Cesium.Matrix4())
let np2 = Cesium.Matrix4.multiplyByPoint(inverse_viewMatrix, np1, new Cesium.Cartesian3());
console.log("np2 自己计算          =", np2);

//使用cesium计算的去除xyz偏移量的 matrix
let axis3 = Cesium.Matrix4.clone(en_a_local_martix);
axis3[12] = 0;
axis3[13] = 0;
axis3[14] = 0;
np2 = Cesium.Matrix4.multiplyByPoint(axis3, np1, new Cesium.Cartesian3());
console.log("np2 使用cesium,去除xyz=", np2);


//C1去apply view inverse matrix
let inverse_axis3=Cesium.Matrix4.inverse (axis3,  new Cesium.Matrix4())
np2 = Cesium.Matrix4.multiplyByPoint(inverse_axis3, C1, new Cesium.Cartesian3());
console.log("np2 C1的view的inverse=", np2);