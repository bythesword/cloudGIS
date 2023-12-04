import { BaseObject } from "../common/baseobject";
import *  as Cesium from "cesium";
/**
 * test ball 功能类
 */
class TestBall extends BaseObject {
    loadFromJSON(_oneJSON: {}) {
        throw new Error("Method not implemented.");
    }
    load(_pjid: string) {
        throw new Error("Method not implemented.");
    }
    save(_pjid: string, _attribueJsong: {}) {
        throw new Error("Method not implemented.");
    }

    /** 覆写init(),实现画个红色透明球 */
    init() {
        let height=1000;
        const czml = [
            {
                id: "document",
                name: "CZML Geometries: Spheres and Ellipsoids",
                version: "1.0",
            },

            {
                id: "redSphere",
                name: "Red sphere with black outline",
                position: {
                    cartographicDegrees: [this.coordinate[0], this.coordinate[1], this.coordinate[1] - height/2],
                },
                ellipsoid: {
                    radii: {
                        cartesian: [1000.0, 1000.0, height],
                    },
                    fill: true,
                    material: {
                        solidColor: {
                            color: {
                                rgba: [255, 0, 0, 100],
                            },
                        },
                    },
                    outline: true,
                    outlineColor: {
                        rgbaf: [0, 0, 0, 1],
                    },
                },
            },

        ];
        const dataSourcePromise = Cesium.CzmlDataSource.load(czml);
        this.viewer.dataSources.add(dataSourcePromise);

    }
}
export { TestBall }