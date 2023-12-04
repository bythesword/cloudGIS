import { CCMBase } from "./CCMBase";
import { Material } from "./shaders/weather/material";

class CWeather extends CCMBase {
    constructor(modelMatrix, oneJSON, setting = false) {
        super(modelMatrix, oneJSON, setting);
        this.material = new Material();
    }
    init() {
        this.CMs = [1];

        this.setting.currentLevel = 0;
        this.loadDS = false
        this.loadDSing = false;
        this.visible = true;

        return true;
    }
    getTFL(frameState, peroneJSON, modelMatrix) {
        let list = [];
        let attributes = {};

        let nc = [];
        let attributesFC = {
            "position": {
                index: 0,
                componentsPerAttribute: 3,
                vertexBuffer: [
                    -1, -1, 0, // 1
                    1, -1, 0, // 2
                    1, 1, 0, // 4

                    -1, -1, 0, // 1
                    1, 1, 0,//4
                    -1, 1, 0, //3 
                ],
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            },
            "uv": {
                index: 1,
                componentsPerAttribute: 2,
                vertexBuffer: [
                    0, 0,
                    1, 0,
                    1, 1,

                    0, 0,
                    1, 1,
                    0, 1,
                ],
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            },
        };
        let uniformMap = {
            iTime: () => { this.iTime += 0.0051; return this.iTime },

            iResolution: () => { return { x: frameState.context.drawingBufferWidth, y: frameState.context.drawingBufferHeight } },
        }
        // nc.push(this.createCommandOfCMMesh(frameState, modelMatrix, attributes, peroneJSON.cmType));
        nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, uniformMap, { vertexShader: this.material.cpVS, fragmentShader: this.material.raingrassFS }, Cesium.PrimitiveType.TRIANGLES));




        return nc;

    }
}

export { CWeather }