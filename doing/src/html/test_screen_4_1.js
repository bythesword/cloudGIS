
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
let en_a_local_martix = Cesium.Transforms.eastNorthUpToFixedFrame(a);
let en_a_local_martix_inverse = Cesium.Matrix4.inverse(en_a_local_martix, new Cesium.Matrix4());

viewer.entities.add(new Cesium.Entity({
    position: a,
    label: {
        text: "A\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.RED,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));
//////////////////////////////////////////////////////////////////////
const getViewExtend = () => {
    let params = {};
    let extend = viewer.camera.computeViewRectangle();
    if (typeof extend === "undefined") {
        //2D下会可能拾取不到坐标，extend返回undefined,因此作如下转换
        let canvas = viewer.scene.canvas;
        let upperLeft = new Cesium.Cartesian2(0, 0); //canvas左上角坐标转2d坐标
        let lowerRight = new Cesium.Cartesian2(
            canvas.clientWidth,
            canvas.clientHeight
        ); //canvas右下角坐标转2d坐标

        let ellipsoid = viewer.scene.globe.ellipsoid;
        let upperLeft3 = viewer.camera.pickEllipsoid(upperLeft, ellipsoid); //2D转3D世界坐标

        let lowerRight3 = viewer.camera.pickEllipsoid(lowerRight, ellipsoid); //2D转3D世界坐标

        let upperLeftCartographic =
            viewer.scene.globe.ellipsoid.cartesianToCartographic(upperLeft3); //3D世界坐标转弧度
        let lowerRightCartographic =
            viewer.scene.globe.ellipsoid.cartesianToCartographic(lowerRight3); //3D世界坐标转弧度

        let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude); //弧度转经纬度
        let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude); //弧度转经纬度

        let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude); //弧度转经纬度
        let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude); //弧度转经纬度

        console.log("经度：" + minx + "----" + maxx);
        console.log("纬度：" + miny + "----" + maxy);

        params.minx = minx;
        params.maxx = maxx;
        params.miny = miny;
        params.maxy = maxy;
    } else {
        //3D获取方式
        params.maxx = Cesium.Math.toDegrees(extend.east);
        params.maxy = Cesium.Math.toDegrees(extend.north);

        params.minx = Cesium.Math.toDegrees(extend.west);
        params.miny = Cesium.Math.toDegrees(extend.south);
    }

    // 返回屏幕所在经纬度范围
    return params;
};

let rect = getViewExtend();
console.log(rect);
let min = Cesium.Cartesian3.fromDegrees(rect.minx, rect.miny);
let max = Cesium.Cartesian3.fromDegrees(rect.maxx, rect.maxy);

let orgin_min = Cesium.Matrix4.multiplyByPoint(en_a_local_martix_inverse, min, new Cesium.Cartesian3());
let orgin_max = Cesium.Matrix4.multiplyByPoint(en_a_local_martix_inverse, max, new Cesium.Cartesian3());
console.log(min, max);
console.log(orgin_min, orgin_max);