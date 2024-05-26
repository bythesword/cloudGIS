function init() {
    // 这个 tk 只能在本域名下使用
    var token = '2b7cbf61123cbe4e9ec6267a87e7442f';
// 服务域名
    var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
// 服务负载子域
    var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
    var viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true,
        selectionIndicator: true,
        animation: false,       //动画
        homeButton: false,       //home键
        geocoder: false,         //地址编码
        baseLayerPicker: false, //图层选择控件
        timeline: false,        //时间轴
        fullscreenButton: false, //全屏显示
        infoBox: false,         //点击要素之后浮窗
        sceneModePicker: false,  //投影方式  三维/二维
        navigationInstructionsInitiallyVisible: false, //导航指令
        navigationHelpButton: false,     //帮助信息
        selectionIndicator: false, // 选择
        imageryProvider: new window.Cesium.WebMapTileServiceImageryProvider({
            //影像底图
            url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + token,
            subdomains: subdomains,
            layer: "tdtImgLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
            show: true
        })
    });

    viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
        //影像注记
        url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + token,
        subdomains: subdomains,
        layer: "tdtCiaLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: true
    },    contextOptions: {
        // cesium状态下允许canvas转图片convertToImage
        webgl: {
            alpha: true,
            depth: false,
            stencil: true,
            antialias: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: true,//通过canvas.toDataURL()实现截图需要将该项设置为true
            failIfMajorPerformanceCaveat: false,
        },
        allowTextureFilterAnisotropic: true,
        requestWebgl1: true, //设置使用Webgl1
    }
    ));

// // 叠加国界服务
    var iboMap = new window.Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
        subdomains: subdomains,
        tilingScheme: new window.Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10
    });

    viewer.imageryLayers.addImageryProvider(iboMap);

    return viewer;

}

/**
 * @description: 飞行定位到一个矩形
 * @return {*}
 */
function flyToRectangle(RectangleCD) {

    // 添加定位信息
    RectangleCD = RectangleCD || [
        Cesium.Cartesian3.fromDegrees(
            67.83746196341815,
            17.00352500800621,
            0
        ),
        Cesium.Cartesian3.fromDegrees(
            137.2400439980721,
            53.97424956088774,
            0
        ),
    ];

    var rec = Cesium.Rectangle.fromCartesianArray(RectangleCD);
    var boundingSphere = Cesium.BoundingSphere.fromRectangle3D(rec);
    viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 3,
        complete: function () {
        	alert('依次单击两次，然后拖动画矩形和修改矩形，右击结束并保存 BBOX 范围！');
        },
        offset: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90),
            range: 0.0,
        },
    });
}
