
window.CESIUM_BASE_URL = '/public/cesium/';
import * as Cesium from 'cesium';
import { CCM } from "../jsm/ccm"
import { TFL } from "../jsm/TFL";
import "/public/cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjNiZTgxOS0xZDYwLTQzNzctYWRkOS00ZjJkZDI2YjA5MGMiLCJpZCI6ODMyOTksImlhdCI6MTY0NTY3MTU4NH0.2bu4bjqgk1yx5JMdC1iU8j65IlMztD4KI11scmH_sHQ';

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",//行政普通
    }),
});
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 2500),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-65.0),
    }
});
window.Cesium = Cesium;//add by tom
window.viewer = viewer;

var origin = Cesium.Cartesian3.fromDegrees(116.3915382409668, 39.8085, 1)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

let tfl = new TFL();

window.tfl=tfl;
let oneCCM = new CCM(modelMatrix, tfl.nw);

window.main = oneCCM;

viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.primitives.add(oneCCM);