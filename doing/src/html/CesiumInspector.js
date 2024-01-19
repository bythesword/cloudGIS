
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

viewer.extend(Cesium.viewerCesiumInspectorMixin);
window.viewer=viewer;