
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
let b = Cesium.Cartesian3.fromDegrees(x1, y1+0.006, 1000);

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

let c = Cesium.Cartesian3.projectVector(a, b, result);


viewer.entities.add(new Cesium.Entity({
    position: c,
    label: {
        text: "C\n",
        font: "42px Helvetica",
        fillColor: Cesium.Color.BLUE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
}));

console.log("a=", a);
console.log("b=", b);
console.log("result=", result, result.x - b.x, result.y - b.y);
console.log("c=", c);
