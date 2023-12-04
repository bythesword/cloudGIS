import { PoiBase, ObjectContentJSON } from "../../common/poiBase"
import *  as Cesium from "cesium";
import { Destination, StatusOfObjectString, ObjectStatus } from "../../common/baseConfig"
// import { Locations } from "../../common/baseLocation"
/**
 * url: image 的URL，每种的
 */
interface ImageContent {

    /** cesium billborad 的image */
    image: string | undefined




    /** 坐标可以每个状态不同 */
    // position?: Destination | undefined//
    position?: Cesium.Cartesian3

    width?: number | undefined
    height?: number | undefined


    /**确定是否显示此广告牌。使用它来隐藏或显示广告牌，而不是将其删除并将其重新添加到集合中。
     * Default Value: true，封装定义默认为false，多个状态，normal默认true
     */
    show: boolean

    /**
     * 获取或设置与广告牌纹理相乘的颜色。这有两个常见的用例。首先，许多不同的广告牌可以使用相同的白色纹理，每个广告牌都有不同的颜色，以创建彩色广告牌。其次，颜色的 alpha 分量可用于使广告牌半透明，如下所示。 alpha 为 0.0 使广告牌透明，而 1.0 使广告牌不透明。 
     * new Cesium.Color(1.0, 1.0, 1.0, 0.5);
     * Cesium.Color.YELLOW;
    */
    color?: Cesium.Color | undefined

    /**获取或设置与相机的距离，在该距离处禁用深度测试，例如，防止对地形进行裁剪。当设置为零时，始终应用深度测试。当设置为 Number.POSITIVE_INFINITY 时，永远不会应用深度测试。 */
    disableDepthTestDistance?: number

    /**获取或设置条件，指定此广告牌将在距相机多远的距离处显示。 */

    distanceDisplayCondition?: Cesium.DistanceDisplayCondition | undefined

    /** 获取或设置此广告牌的水平原点，确定广告牌是在其锚点位置的左侧、中心还是右侧。
     * b.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
     * b.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    */
    horizontalOrigin?: Cesium.HorizontalOrigin | undefined

    /**
     * 获取或设置屏幕空间中相对于该广告牌原点的像素偏移量。这通常用于在同一位置对齐多个广告牌和标签，例如图像和文本。屏幕空间原点是画布的左上角； x 从左到右增加， y 从上到下增加。
     */
    pixelOffset?: Cesium.Cartesian2 | undefined


    /***
     * 根据广告牌与相机的距离，获取或设置广告牌的近距和远距像素偏移缩放属性。广告牌的像素偏移将在 NearFarScalar#nearValue 和 NearFarScalar#farValue 之间缩放，而相机距离落在指定的 NearFarScalar#near 和 NearFarScalar#far 的上下限内。在这些范围之外，广告牌的像素偏移比例保持在最近的范围内。如果未定义，pixelOffsetScaleByDistance 将被禁用。
    Examples:
    // Example 1.
    // Set a billboard's pixel offset scale to 0.0 when the
    // camera is 1500 meters from the billboard and scale pixel offset to 10.0 pixels
    // in the y direction the camera distance approaches 8.0e6 meters.
    b.pixelOffset = new Cesium.Cartesian2(0.0, 1.0);
    b.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0);
    // Example 2.
    // disable pixel offset by distance
    b.pixelOffsetScaleByDistance = undefined;
     */
    pixelOffsetScaleByDistance?: Cesium.NearFarScalar | undefined

    /**获取或设置以弧度为单位的旋转角度。 */
    rotation?: number | undefined

    /**获取或设置与广告牌图像大小相乘的统一比例（以像素为单位）。 1.0 的比例不会改变广告牌的大小；大于 1.0 的比例会放大广告牌；小于 1.0 的正比例会缩小广告牌。 */
    scale?: number | undefined

    /**获取或设置广告牌大小是否以米或像素为单位。 true 的以米为单位的广告牌大小；否则，大小以像素为单位。Default Value: false 
     * 
    */
    sizeInMeters?: false | undefined

    /** 获取或设置此广告牌的垂直原点，确定广告牌是在其锚点位置的上方、下方还是中心。
     * Top,Center,Baseline,Bottom
     * // Use a bottom, left origin
     * b.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
     * b.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    */
    verticalOrigin?: Cesium.VerticalOrigin | undefined
}
export interface ImageContentJSON {
    /**normal 为 true，手动设置 */
    default: boolean
    /** cesium billborad 的image */
    url: string | undefined

    /** 描述 */
    description: string | undefined

    /** 坐标可以每个状态不同 */
    coord?: Destination | undefined//position : Cartesian3

    width?: number | undefined
    height?: number | undefined


    /**确定是否显示此广告牌。使用它来隐藏或显示广告牌，而不是将其删除并将其重新添加到集合中。
     * Default Value: true，封装定义默认为false，多个状态，normal默认true
     */
    show?: boolean

    /**
     * 内容：red?: number, green?: number, blue?: number, alpha?: number
     * 获取或设置与广告牌纹理相乘的颜色。这有两个常见的用例。首先，许多不同的广告牌可以使用相同的白色纹理，每个广告牌都有不同的颜色，以创建彩色广告牌。其次，颜色的 alpha 分量可用于使广告牌半透明，如下所示。 alpha 为 0.0 使广告牌透明，而 1.0 使广告牌不透明。 
     * new Cesium.Color(1.0, 1.0, 1.0, 0.5);
     * Cesium.Color.YELLOW;
    */
    color?: { red?: number, green?: number, blue?: number, alpha?: number } | undefined

    /**获取或设置与相机的距离，在该距离处禁用深度测试，例如，防止对地形进行裁剪。当设置为零时，始终应用深度测试。当设置为 Number.POSITIVE_INFINITY 时，永远不会应用深度测试。 */
    disableDepthTestDistance?: number

    /**获取或设置条件，指定此广告牌将在距相机多远的距离处显示。 */

    distanceDisplayCondition?: { near?: number, far?: number } | undefined

    /** 获取或设置此广告牌的水平原点，确定广告牌是在其锚点位置的左侧、中心还是右侧。
     * b.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
     * b.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    */
    horizontalOrigin?: Cesium.HorizontalOrigin.RIGHT | Cesium.HorizontalOrigin.LEFT | Cesium.HorizontalOrigin.CENTER | undefined

    /**
     * 获取或设置屏幕空间中相对于该广告牌原点的像素偏移量。这通常用于在同一位置对齐多个广告牌和标签，例如图像和文本。屏幕空间原点是画布的左上角； x 从左到右增加， y 从上到下增加。
     *  Cesium.Cartesian2
     *  A 2D Cartesian point.
     *  [x = 0.0] - The X component.
     *  [y = 0.0] - The Y component.
     */
    pixelOffset?: { x?: number, y?: number } | undefined


    /***
     * 根据广告牌与相机的距离，获取或设置广告牌的近距和远距像素偏移缩放属性。广告牌的像素偏移将在 NearFarScalar#nearValue 和 NearFarScalar#farValue 之间缩放，而相机距离落在指定的 NearFarScalar#near 和 NearFarScalar#far 的上下限内。在这些范围之外，广告牌的像素偏移比例保持在最近的范围内。如果未定义，pixelOffsetScaleByDistance 将被禁用。
     * Cesium.NearFarScalar
    Examples:
    // Example 1.
    // Set a billboard's pixel offset scale to 0.0 when the
    // camera is 1500 meters from the billboard and scale pixel offset to 10.0 pixels
    // in the y direction the camera distance approaches 8.0e6 meters.
    b.pixelOffset = new Cesium.Cartesian2(0.0, 1.0);
    b.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0);
    // Example 2.
    // disable pixel offset by distance
    b.pixelOffsetScaleByDistance = undefined;
     */
    pixelOffsetScaleByDistance?: { near?: number, nearValue?: number, far?: number, farValue?: number } | undefined

    /**获取或设置以弧度为单位的旋转角度。 */
    rotation?: number | undefined

    /**获取或设置与广告牌图像大小相乘的统一比例（以像素为单位）。 1.0 的比例不会改变广告牌的大小；大于 1.0 的比例会放大广告牌；小于 1.0 的正比例会缩小广告牌。 */
    scale?: number | undefined

    /**获取或设置广告牌大小是否以米或像素为单位。 true 的以米为单位的广告牌大小；否则，大小以像素为单位。Default Value: false 
     * 
    */
    sizeInMeters?: false | undefined

    /** 获取或设置此广告牌的垂直原点，确定广告牌是在其锚点位置的上方、下方还是中心。
     * Top,Center,Baseline,Bottom
     * // Use a bottom, left origin
     * b.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
     * b.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    */
    verticalOrigin?: Cesium.VerticalOrigin.BASELINE | Cesium.VerticalOrigin.BOTTOM | Cesium.VerticalOrigin.CENTER | Cesium.VerticalOrigin.TOP | undefined
}


class PoiIMG extends PoiBase {

    contnet: ObjectStatus<Cesium.Entity>={}
    contnetJSON: ObjectContentJSON<ImageContentJSON> = {
        obj: {} as ObjectStatus<ImageContentJSON>,
        // {
        //     'normal': <ImageContentJSON>{},
        //     'selected': <ImageContentJSON>{} ,
        //     'over': <ImageContentJSON>{},
        //     'move': <ImageContentJSON>{},
        //     'alert': <ImageContentJSON>{},
        //     'offline': <ImageContentJSON>{},
        // },
        type: "image"
    };

    init() {
        if (this.PJID !== "") {
            // let arrayIMG: ImageContentJSON[] = this.load(this.PJID);
            // for (let i of arrayIMG) {
            //     this.viewer.entities.add({
            //         position: Cesium.Cartesian3.fromDegrees(this.coordinate[0], this.coordinate[1], this.coordinate[2]),
            //         billboard: {
            //             image: "POI/test1/1.png",
            //             width: 100,
            //             height: 100,
            //         },
            //     });
            // }
        }
        else {
            console.log("PJID='' ")
        }
    }
    /**
     * 
     * @param list 是ImageContentJSON的结构
     */
    loadFromJSON(list: ObjectContentJSON<ImageContentJSON>): any {
        this.contnetJSON = list;
        for (let i in list.obj) {
            let perOne = list.obj[i];
            if (perOne !== undefined) {
                let oneBillboard: ImageContent = {
                    show: perOne.default ? true : false,
                    image: perOne.url,
                }
                for (let j in perOne) {
                    if (j == 'coord' && perOne.coord !== undefined) {
                        oneBillboard.position = Cesium.Cartesian3.fromDegrees(perOne.coord[0], perOne.coord[1], perOne.coord[2])
                    }
                    else if (j == 'width' && perOne.width !== undefined) {
                        oneBillboard.width = perOne.width
                    }
                    else if (j == 'height' && perOne.height !== undefined) {
                        oneBillboard.height = perOne.height
                    }
                    else if (j == 'show' && perOne.show !== undefined) {
                        oneBillboard.show = perOne.show
                    }
                    else if (j == 'color' && perOne.color !== undefined) {
                        oneBillboard.color = new Cesium.Color(perOne.color.red, perOne.color.green, perOne.color.blue, perOne.color.alpha)
                    }
                    else if (j == 'disableDepthTestDistance' && perOne.disableDepthTestDistance !== undefined) {
                        oneBillboard.disableDepthTestDistance = perOne.disableDepthTestDistance
                    }
                    else if (j == 'distanceDisplayCondition' && perOne.distanceDisplayCondition !== undefined) {
                        oneBillboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(perOne.distanceDisplayCondition.near, perOne.distanceDisplayCondition.far)
                    }
                    else if (j == 'horizontalOrigin' && perOne.horizontalOrigin !== undefined) {
                        oneBillboard.horizontalOrigin = perOne.horizontalOrigin
                    }
                    else if (j == 'pixelOffsetScaleByDistance' && perOne.pixelOffsetScaleByDistance !== undefined) {
                        oneBillboard.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(perOne.pixelOffsetScaleByDistance.near, perOne.pixelOffsetScaleByDistance.nearValue, perOne.pixelOffsetScaleByDistance.far, perOne.pixelOffsetScaleByDistance.farValue)
                    }
                    else if (j == 'rotation' && perOne.rotation !== undefined) {
                        oneBillboard.rotation = perOne.rotation
                    }
                    else if (j == 'scale' && perOne.scale !== undefined) {
                        oneBillboard.scale = perOne.scale
                    }
                    else if (j == 'sizeInMeters' && perOne.sizeInMeters !== undefined) {
                        oneBillboard.sizeInMeters = perOne.sizeInMeters
                    }
                }
                let oneEntiy = new Cesium.Entity({
                    position: oneBillboard.position ? oneBillboard.position : Cesium.Cartesian3.fromDegrees(this.coordinate[0], this.coordinate[1], this.coordinate[2]),
                    billboard: oneBillboard,
                });
                this.contnet[i] = oneEntiy;
                this.add(oneEntiy);
            }

        }

    }
    load(_pjid: string): any {
        if (this.ID !== "" && this.PJID !== "") {

        }
        else {
            console.log("POI id 或 PJID 为空")
        }
    }
    save(_pjid: string, _attribueJsong: {}): any { }


    setStatus(status: StatusOfObjectString): void {
        this.currentStatus = status;
        for (let i in this.contnet) {
            if (this.contnet[i] !== undefined)
                this.contnet[i]!.show = false;
        }
        this.contnet[status]!.show = true;
    }

    statusReset(): void {
        for (let i in this.contnetJSON.obj) {
            let perOne = this.contnetJSON.obj[i];
            if (perOne !== undefined && perOne.default! === true) {
                this.setStatus(i as StatusOfObjectString);
            }
        }
    }

    add(one: Cesium.Entity): void {
        this.viewer.entities.add(one);
    }
    remove(): void {
        for (let i in this.contnet) {
            let perOne = this.contnet[i];
            if (perOne !== undefined)
                this.viewer.entities.remove(perOne);
        }
    }
    show(visble: boolean): void {
        if (this.currentStatus !== undefined)
            this.contnet[this.currentStatus]!.show = visble;
    }

}


export { PoiIMG }