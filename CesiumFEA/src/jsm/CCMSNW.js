import * as Cesium from "cesium";
import { CCMBase } from "./CCMBase";

// import { drawVert, drawFrag, quadVert, opFrag, NupdateFrag, cpFS, cpTextureFS, uvsVS, uvsFS, cmFS, cmVS, cmAFS, cmAVS, cmW1, cmW2, cmW3, cmWS1, cmWS2, cmBlue6, cmBlue } from "./shaders/ccmIMG/material";
import drawVert from './shaders/ccmIMG/draw.vert.glsl?raw';
import drawFrag from './shaders/ccmIMG/draw.frag.glsl?raw';
import quadVert from './shaders/ccmIMG/quad.vert.glsl?raw';
import opFrag from './shaders/ccmIMG/op.frag.glsl?raw';
import NupdateFrag from './shaders/ccmIMG/Nupdate.frag.glsl?raw';
// import NupdateNLFrag from './shaders/ccmIMG/Nupdate.NL.frag.glsl?raw';
import cpFS from './shaders/ccmIMG/cp.fs.glsl?raw';
import cpTextureFS from './shaders/ccmIMG/cpTexture.fs.glsl?raw';//修改显示u_wind
import uvsVS from './shaders/ccmIMG/uvs.vs.glsl?raw';
import uvsFS from './shaders/ccmIMG/uvs.fs.glsl?raw';
import cmFS from './shaders/ccmIMG/cm.fs.glsl?raw';
import cmBlue6 from './shaders/ccmIMG/cmBlue6.fs.glsl?raw';
import cmBlue from './shaders/ccmIMG/cmBlue.fs.glsl?raw';
import cmVS from './shaders/ccmIMG/cm.vs.glsl?raw';
import cmAFS from './shaders/ccmIMG/cmArrow.fs.glsl?raw';
import cmAVS from './shaders/ccmIMG/cmArrow.vs.glsl?raw';
import cmW1 from './shaders/ccmIMG/cmW1.fs.glsl?raw';
import cmW2 from './shaders/ccmIMG/cmW2.fs.glsl?raw';
import cmW3 from './shaders/ccmIMG/cmW3.fs.glsl?raw';
import cmWS1 from './shaders/ccmIMG/wave2DDir.fs.glsl?raw';
import cmWS2 from './shaders/ccmIMG/wave2DDirGabor.fs.glsl?raw';


import cmflVS from './shaders/ccmIMG/cmfl.vs.glsl?raw';
import framelineFS from './shaders/ccmIMG/frameline.fs.glsl?raw';

// import { cmWaterC12FS, cmWaterBlue6ColorFS, cmWaterBlue12ColorFS, cmWaterBlue6ABS1FS } from "./shaders/cmwater/cmWater"
import cmWaterC12FS from "./shaders/cmwater/cmWaterC12.fs.glsl?raw"
import cmWaterBlue12ColorFS from "./shaders/cmwater/cmWaterBlue12.fs.glsl?raw"
import cmWaterBlue6ColorFS from "./shaders/cmwater/cmWaterBlue6.fs.glsl?raw"
import cmWaterBlue6ABS1FS from "./shaders/cmwater/cmWaterBlue6ABS1.fs.glsl?raw"


import CNAACPFS from './shaders/CMAA/cp.fs.glsl?raw';
import CMAA1 from './shaders/CMAA/cmaa1.fs.glsl?raw';
import CMAA2 from './shaders/CMAA/cmaa2.fs.glsl?raw';
import CMAA3 from './shaders/CMAA/cmaa3.fs.glsl?raw';

class CCMSNW extends CCMBase {

    init() {
        if (typeof this.setting.CMAA != "undefined" && this.setting.CMAA === false) {
            this.setting.CMAA = false;
        }
        else {
            this.setting.CMAA = true;
        }
        this.setting.dynWindMapMM = {
            start: {
                x: false,
                y: false,
            },
            end: {
                x: false,
                y: false,
            },
            // range: 10,
        }
        if (typeof this.inputSetting.dynWindMapMM == "undefined" || typeof this.inputSetting.dynWindMapMM.range == "undefined")
            this.setting.dynWindMapMM.range = 50;
        else
            this.setting.dynWindMapMM.range = this.inputSetting.dynWindMapMM.range;
        this.viewer = false;
        if (typeof this.setting.viewer != "undefined" && this.setting.viewer !== false) {
            this.viewer = this.setting.viewer;
        }
        this.CMAA = false;
        this.CMAA1 = false;
        this.CMAA2 = false;
        this.CMAA3 = false;
        this.CMAA_compute_flag = false;
        this.CMAA_compute_flag_first = true;
        // this.material = new Material();
        /**global texture source */
        this.GTS = {
        };
        if (typeof window.GTS != "undefined") {
            this.GTS = window.GTS;
        }
        else
            window.GTS = this.GTS;
        this.WMs = [
            {
                index: [],
                tp: [],
                uv: [],
            }
        ];
        this.CMs = [
            {
                index: [],
                tp: [],
                uv: [],
            }
        ];
        let cols = this.oneJSON.dem.cols;
        let rows = this.oneJSON.dem.rows;
        this.imageW = cols;
        this.imageH = rows;
        let tIndex = 0;
        this.textures = {};

        this.framelines = {
            index: [],
            tp: []
        };
        for (let ri = 0; ri < rows - 1; ri++) {
            for (let ci = 0; ci < cols - 1; ci++) {
                //12 
                this.framelines.index.push((ci + 0) + (ri + 0) * cols);
                this.framelines.index.push((ci + 1) + (ri + 0) * cols);
                this.framelines.tp.push(0, 1);
                //13 
                this.framelines.index.push((ci + 0) + (ri + 0) * cols);
                this.framelines.index.push((ci + 0) + (ri + 1) * cols);
                this.framelines.tp.push(0, 2);
            }
        }

        //12
        //34
        for (let ri = 0; ri < rows - 1; ri++) {
            for (let ci = 0; ci < cols - 1; ci++) {
                if (tIndex == 6) tIndex = 0;
                //124
                this.CMs[0].index.push((ci + 0) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 1) * cols);

                // this.CMs[0].tp.push(tIndex++, tIndex++, tIndex++);
                this.CMs[0].tp.push(0, 1, 2);

                //旧版云图与贴图不能统一UV
                //143
                // this.CMs[0].index.push((ci + 0) + (ri + 0) * cols);
                // this.CMs[0].index.push((ci + 1) + (ri + 1) * cols);
                // this.CMs[0].index.push((ci + 0) + (ri + 1) * cols);


                //134
                this.CMs[0].index.push((ci + 0) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 0) + (ri + 1) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 1) * cols);

                // this.CMs[0].tp.push(tIndex++, tIndex++, tIndex++);
                this.CMs[0].tp.push(3, 4, 5);
            }
        }
        this.WMs = this.CMs[0];// JSON.parse(JSON.stringify(this.CMs[0]));
        this.WMs_origin = this.CMs[0];
        /** data source ,已有的数据源，GL的texture */
        this.DS = [];
        // this.setting.currentLevel = 0;
        this.loadDS = false
        this.loadDSing = false;
        this.visible = true;

        return true;
    }
    /**
* 是否进行绑定resize 。
* 非FBO，设置空函数即可
* 如果存在FBO，在需要定义，例子如下：
*    window.addEventListener("resize", function (event) {
*       that.resize(event, that);
*       });
*/
    onReSzie() {
        let scope = this;
        window.addEventListener("resize", function (event) {
            scope.resize(event, scope);
        });
    }




    getTFL(frameState, peroneJSON, modelMatrix) {
        let list = [];
        let nc = [];
        if (this.loadDS === false && this.updateOfListCommands === true) {
            if (this.loadDSing === false)
                this.initData(frameState.context);//替换gl 同 cesium
            if (this.setting.cmType == "wind") {
                if (typeof this.FBO1 == "undefined") {
                    //init other 
                    // this.initData(frameState.context, this.setting.currentLevel);//替换gl 同 cesium
                    this.setColorRamp(frameState.context, this.setting.wind.defaultRampColors);
                    this.set_numParticles(frameState.context, this.setting.wind.counts);//替换gl 同 cesium
                    // init frame bufer
                    this.FBO1 = this.createFramebuffer(frameState.context);
                    this.FBO2 = this.createFramebuffer(frameState.context);
                }
                else {
                    this.FBO1.destroy();
                    this.FBO2.destroy();
                    this.FBO1 = this.createFramebuffer(frameState.context);
                    this.FBO2 = this.createFramebuffer(frameState.context);
                }
            }
        } else if (this.setting.cmType == "wind" && (this.resizeFlag == true || this.renewFlag == true) && this.updateOfListCommands === true) {
            this.FBO1.destroy();
            this.FBO2.destroy();
            this.FBO1 = this.createFramebuffer(frameState.context);
            this.FBO2 = this.createFramebuffer(frameState.context);
            this.set_numParticles(frameState.context, this.setting.wind.counts);//替换gl 同 cesium
        }


        if (this.setting.CMAA === true && this.loadDS !== false && this.CMAA_compute_flag === true) {
            // let uniformMapCMAA1 = {
            //     u_channel0: () => { return this.DS[this.getCurrentLevelByIndex()]; },

            //     u_Umin: () => { return this.oneJSON.dataContent.U.min },
            //     u_Vmin: () => { return this.oneJSON.dataContent.V.min },
            //     u_Umax: () => { return this.oneJSON.dataContent.U.max },
            //     u_Vmax: () => { return this.oneJSON.dataContent.V.max },

            //     u_w: () => { return this.CMAA_w; },
            //     u_h: () => { return this.CMAA_h; },

            //     u_rate3: () => { return 1. },
            //     u_rate2: () => { return 0.98 },
            //     u_rate1: () => { return 0.96 },

            //     u_limit: () => { return 0.0 },
            //     u_alpha: () => { return 1.0 },

            // };
            // nc.push(this.createCommandOfCompute(uniformMapCMAA1, CMMAA1, this.CMAA1));
            // let uniformMapCMAA2 = {
            //     u_channel0: () => { return this.CMAA1; },
            //     u_rate3: () => { return 1. },
            //     u_rate2: () => { return 0.9 },
            //     u_rate1: () => { return 0.8 },
            //     u_limit: () => { return 0.0 },
            //     u_alpha: () => { return 0.950 },
            //     u_w: () => { return this.CMAA_w; },
            //     u_h: () => { return this.CMAA_h; },
            //     u_Umin: () => { return this.oneJSON.dataContent.U.min },
            //     u_Vmin: () => { return this.oneJSON.dataContent.V.min },
            //     u_Umax: () => { return this.oneJSON.dataContent.U.max },
            //     u_Vmax: () => { return this.oneJSON.dataContent.V.max },
            // };
            // nc.push(this.createCommandOfCompute(uniformMapCMAA2, CMMAA1, this.CMAA2));
            // let uniformMapCMAA3 = {
            //     u_channel0: () => { return this.CMAA2; },
            //     u_rate3: () => { return 1. },
            //     u_rate2: () => { return 0.9 },
            //     u_rate1: () => { return 0.8 },
            //     u_limit: () => { return 0.0 },
            //     u_alpha: () => { return 0.930 },
            //     u_w: () => { return this.CMAA_w; },
            //     u_h: () => { return this.CMAA_h; },
            //     u_Umin: () => { return this.oneJSON.dataContent.U.min },
            //     u_Vmin: () => { return this.oneJSON.dataContent.V.min },
            //     u_Umax: () => { return this.oneJSON.dataContent.U.max },
            //     u_Vmax: () => { return this.oneJSON.dataContent.V.max },
            // };
            // nc.push(this.createCommandOfCompute(uniformMapCMAA3, CMMAA1, this.CMAA3));
            // // this.CMAA = this.CMAA3;
            // let uniformMapCMAA4 = {
            //     u_channel0: () => { return this.CMAA3; },
            //     u_rate3: () => { return 1. },
            //     u_rate2: () => { return 0.8 },
            //     u_rate1: () => { return 0.6 },
            //     u_limit: () => { return -0.30 },
            //     u_alpha: () => { return 0.30 },
            //     u_w: () => { return this.CMAA_w; },
            //     u_h: () => { return this.CMAA_h; },
            //     u_Umin: () => { return this.oneJSON.dataContent.U.min },
            //     u_Vmin: () => { return this.oneJSON.dataContent.V.min },
            //     u_Umax: () => { return this.oneJSON.dataContent.U.max },
            //     u_Vmax: () => { return this.oneJSON.dataContent.V.max },
            // };
            // nc.push(this.createCommandOfCompute(uniformMapCMAA4, CMMAA1, this.CMAA2));
            // let uniformMapCMAA5 = {
            //     u_channel0: () => { return this.CMAA2; },
            //     u_rate3: () => { return 1. },
            //     u_rate2: () => { return 0.8 },
            //     u_rate1: () => { return 0.6 },
            //     u_limit: () => { return -0.30 },
            //     u_alpha: () => { return 0.30 },
            //     u_w: () => { return this.CMAA_w; },
            //     u_h: () => { return this.CMAA_h; },
            //     u_Umin: () => { return this.oneJSON.dataContent.U.min },
            //     u_Vmin: () => { return this.oneJSON.dataContent.V.min },
            //     u_Umax: () => { return this.oneJSON.dataContent.U.max },
            //     u_Vmax: () => { return this.oneJSON.dataContent.V.max },
            // };
            // nc.push(this.createCommandOfCompute(uniformMapCMAA5, CMMAA1, this.CMAA1));
            // this.CMAA = this.CMAA1;



            let uniformMapCMAA1 = {
                u_channel0: () => {
                    if (this.updateOfListCommands === true || this.CMAA_compute_flag_first === true) {
                        this.CMAA_compute_flag_first = false;
                        return this.DS[this.getCurrentLevelByIndex()];
                    }
                    else {
                        return this.CMAA1;
                    }
                },
                u_origin: () => {
                    if (this.updateOfListCommands === true || this.CMAA_compute_flag_first === true) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                u_Umin: () => { return this.oneJSON.dataContent.U.min },
                u_Vmin: () => { return this.oneJSON.dataContent.V.min },
                u_Umax: () => { return this.oneJSON.dataContent.U.max },
                u_Vmax: () => { return this.oneJSON.dataContent.V.max },

                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },

                u_w: () => { return this.CMAA_w; },
                u_h: () => { return this.CMAA_h; },

                u_round: () => { return 5.0 },
                u_limit: () => { return -1.0 },


            };
            nc.push(this.createCommandOfCompute(uniformMapCMAA1, CMAA2, this.CMAA2));

            let uniformMapCMAA_CP = {
                u_channel0: () => {
                    // return this.DS[this.getCurrentLevelByIndex()]
                    return this.CMAA2;
                },
            };
            nc.push(this.createCommandOfCompute(uniformMapCMAA_CP, CNAACPFS, this.CMAA));
            nc.push(this.createCommandOfCompute(uniformMapCMAA_CP, CNAACPFS, this.CMAA1));

        }

        if (this.loadDS && this.setting.cmType == "wind") {
            let attributesFC = {
                "position": {
                    index: 0,
                    componentsPerAttribute: 2,
                    vertexBuffer: [
                        0, 0,
                        1, 0,
                        0, 1,
                        0, 1,
                        1, 0,
                        1, 1
                    ],//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },

            };
            // //Draw 
            // // // // //draw 衰减
            let uniformMap0 = {
                iTime: () => {
                    this.iTime += 0.0051;
                    let iTime = (new Date().getTime() - this.timestamp) / 1000.0;
                    return iTime;
                    //return this.iTime
                },
                u_opacity: () => { return this.setting.wind.fadeOpacity; },
            };
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, uniformMap0, { vertexShader: quadVert, fragmentShader: opFrag }, Cesium.PrimitiveType.TRIANGLES, [this.FBO2], this.FBO1));//op
            // nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, uniformMap0, { vertexShader: this.material.quadVert, fragmentShader: this.material.opFrag }, Cesium.PrimitiveType.TRIANGLES, [this.FBO2], this.FBO1));//op

            let uniformMapPoints = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_particles_res: () => { return this.particleStateResolution },
                u_w: () => { return this.particleStateResolution },
                u_h: () => { return this.particleStateResolution },

                u_wind_Umin: () => { return this.oneJSON.dataContent.U.min },
                u_wind_Vmin: () => { return this.oneJSON.dataContent.V.min },
                u_wind_Umax: () => { return this.oneJSON.dataContent.U.max },
                u_wind_Vmax: () => { return this.oneJSON.dataContent.V.max },
                u_color_ramp: () => { return this.colorRampTexture; },
                u_wind: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                u_channel0: () => { return this.particleStateTexture0; },

                u_pointSize: () => { return this.getWMPointSize(); },
                //20231221
                u_xy_mm: () => {
                    return {
                        x: this.setting.dynWindMapMM.start.x,
                        y: this.setting.dynWindMapMM.start.y,
                        z: this.setting.dynWindMapMM.end.x,
                        w: this.setting.dynWindMapMM.end.y
                    }
                },
                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
            };
            let attributesPoints = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: this.particleIndices,
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                }
            };
            // // // // ////points 
            // nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesPoints, uniformMapPoints, { vertexShader: this.material.drawVert, fragmentShader: this.material.drawFrag }, Cesium.PrimitiveType.POINTS, [], this.FBO1));
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesPoints, uniformMapPoints, { vertexShader: drawVert, fragmentShader: drawFrag }, Cesium.PrimitiveType.POINTS, [], this.FBO1));

            let uniformMapPointsUP = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_speed_factor: () => { return this.setting.wind.speedFactor },
                u_drop_rate: () => { return this.setting.wind.dropRate },
                u_drop_rate_bump: () => { return this.setting.wind.dropRateBump },
                u_rand_seed: () => { return Math.random(); },


                u_particles_res: () => { return this.particleStateResolution },
                u_w: () => { return this.particleStateResolution },
                u_h: () => { return this.particleStateResolution },
                u_imgW: () => { return this.imageW; },
                u_imgH: () => { return this.imageH; },

                u_wind_Umin: () => { return this.oneJSON.dataContent.U.min },
                u_wind_Vmin: () => { return this.oneJSON.dataContent.V.min },
                u_wind_Umax: () => { return this.oneJSON.dataContent.U.max },
                u_wind_Vmax: () => { return this.oneJSON.dataContent.V.max },

                u_color_ramp: () => { return this.colorRampTexture; },
                u_wind: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                u_channel0: () => { return this.particleStateTexture0; },
                U_scaleOfUV: () => { return this.setting.wind.scaleOfUV; },
                u_filterUVofZeroOfGB: () => { return this.setting.wind.filterUVofZeroOfGB; },
                //20231226
                u_xy_mm: () => {
                    return {
                        x: this.setting.dynWindMapMM.start.x,
                        y: this.setting.dynWindMapMM.start.y,
                        z: this.setting.dynWindMapMM.end.x,
                        w: this.setting.dynWindMapMM.end.y
                    }
                },
                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
            };
            // // // // // // // update to  PST2
            // nc.push(this.createCommandOfCompute(uniformMapPointsUP, NupdateNLFrag, this.particleStateTexture1));

            nc.push(this.createCommandOfCompute(uniformMapPointsUP, NupdateFrag, this.particleStateTexture1));
            // nc.push(this.createCommandOfCompute(uniformMapPointsUP, this.material.NupdateFrag, this.particleStateTexture1));
            let uniformMapPointsUPCP = {
                u_channel0: () => { return this.particleStateTexture1; },
            };
            // // // // // // // update to  PST2
            nc.push(this.createCommandOfCompute(uniformMapPointsUPCP, cpTextureFS, this.particleStateTexture0));
            // nc.push(this.createCommandOfCompute(uniformMapPointsUPCP, this.material.cpTextureFS, this.particleStateTexture0));



            // // // // // // //copy to  screen 
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: this.WMs.index,//normal array
                    // vertexBuffer: peroneJSON.index,//normal array ,全屏&&全部三角形
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },

                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: this.WMs.tp,//normal array
                    // vertexBuffer: peroneJSON.tp,//normal array,全屏&&全部三角形
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMapUVS = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },

                u_filterGlobalMM: () => { return { x: this.oneJSON.dataContent.zbed.global_MM, y: this.oneJSON.dataContent.U.global_MM, z: this.oneJSON.dataContent.V.global_MM } },

                u_filterKind: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[1],
                    }
                },

                u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                // u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                u_channel0: () => { return this.FBO1.getColorTexture(0); },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v
                u_UV_and: () => { return this.getWMUV_and_or() },
                //20231221
                u_xy_mm: () => {
                    return {
                        x: this.setting.dynWindMapMM.start.x,
                        y: this.setting.dynWindMapMM.start.y,
                        z: this.setting.dynWindMapMM.end.x,
                        w: this.setting.dynWindMapMM.end.y
                    }
                },

            };
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMapUVS, { vertexShader: uvsVS, fragmentShader: uvsFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1], undefined, true));//copy uvs ,需要透明，copy的时候
            // nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, {}, { vertexShader: this.material.uvsVS, fragmentShader: this.material.uvsFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1]));//copy uvs

            // // // // // // //copy to FBO2
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, {}, { vertexShader: quadVert, fragmentShader: cpFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1], this.FBO2));//copy 
            //  nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, {}, { vertexShader: this.material.quadVert, fragmentShader: this.material.cpFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1], this.FBO2));//copy 
        }
        else if (this.loadDS && (this.setting.cmType == "cm" || this.setting.cmType == "cmBlue" || this.setting.cmType == "cmBlue6")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },

                u_filterGlobalMM: () => { return { x: this.oneJSON.dataContent.zbed.global_MM, y: this.oneJSON.dataContent.U.global_MM, z: this.oneJSON.dataContent.V.global_MM } },

                u_filterKind: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[1],
                    }
                },

                // u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                // u_channel0: () => { return this.particleStateTexture0; },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v
                u_DS_new: () => { return this.CMAA; },//20231213
                u_enable_CMAA: () => { return this.setting.CMAA; },//20231213

            };
            if (this.setting.cmType == "cmBLue") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmBlue }, Cesium.PrimitiveType.TRIANGLES));
            }
            else if (this.setting.cmType == "cmBLue6") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmBlue6 }, Cesium.PrimitiveType.TRIANGLES));
            }
            else {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmFS }, Cesium.PrimitiveType.TRIANGLES));
            }
        }
        else if (this.loadDS && (this.setting.cmType == "cmWater" || this.setting.cmType == "cmWaterBlue12" || this.setting.cmType == "cmWaterBlue6" || this.setting.cmType == "cmWaterBlue6ABS1") || this.setting.cmType == "cmWaterC12") {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },

                u_filterGlobalMM: () => { return { x: this.oneJSON.dataContent.zbed.global_MM, y: this.oneJSON.dataContent.U.global_MM, z: this.oneJSON.dataContent.V.global_MM } },

                u_filterKind: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[1],
                    }
                },




                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v
                iChannel0: () => {
                    if (typeof this.textures["grayNoise64x64"] != "undefined") return this.textures["grayNoise64x64"]
                },
                iChannel1: () => {
                    if (typeof this.textures["pebbles"] != "undefined") return this.textures["pebbles"]
                },
                u_water_wave_speed: () => {
                    return this.getCMWaterWaveSpeed();
                },
                u_water_wave_scale: () => {
                    return this.getCMWaterWaveScale();
                },
                u_water_wave_opacity: () => {
                    return this.getCMWaterWaveOpacity();
                },
                u_DS: () => {
                    // console.log(this.DS[this.getCurrentLevelByIndex()])
                    return this.DS[this.getCurrentLevelByIndex()];
                },


                u_DS_new: () => { return this.CMAA; },

                // u_DS_new: () => {
                //     // console.log(this.DS[this.getCurrentLevelByIndex()])
                //     return this.DS[this.getCurrentLevelByIndex()];
                // },
                // u_DS: () => {
                //     return this.CMAA;
                // },//20231213
                u_enable_CMAA: () => { return this.setting.CMAA; },//20231213


            };
            if (this.setting.cmType == "cmWaterBlue6ABS1") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmWaterBlue6ABS1FS }, Cesium.PrimitiveType.TRIANGLES));
            }
            else if (this.setting.cmType == "cmWaterBlue6") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmWaterBlue6ColorFS }, Cesium.PrimitiveType.TRIANGLES));
            }
            else if (this.setting.cmType == "cmWaterBlue12") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmWaterBlue12ColorFS }, Cesium.PrimitiveType.TRIANGLES));
            }
            else {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmWaterC12FS }, Cesium.PrimitiveType.TRIANGLES));
            }
        }
        else if (this.loadDS && (this.setting.cmType == "arrow")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },

                u_filterGlobalMM: () => { return { x: this.oneJSON.dataContent.zbed.global_MM, y: this.oneJSON.dataContent.U.global_MM, z: this.oneJSON.dataContent.V.global_MM } },

                u_filterKind: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex()].V.filterValue[1],
                    }
                },

                // u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                // u_channel0: () => { return this.particleStateTexture0; },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v
                u_filterUVofZeroOfGB: () => { return this.setting.wind.filterUVofZeroOfGB; },

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmAVS, fragmentShader: cmAFS }, Cesium.PrimitiveType.TRIANGLES));

        }

        else if (this.loadDS && (this.setting.cmType == "w1")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },



                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },


                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: uvsVS, fragmentShader: cmW1 }, Cesium.PrimitiveType.TRIANGLES));

        }
        else if (this.loadDS && (this.setting.cmType == "w2")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },



                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },


                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: uvsVS, fragmentShader: cmW2 }, Cesium.PrimitiveType.TRIANGLES));

        }
        else if (this.loadDS && (this.setting.cmType == "w3")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },



                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },


                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: uvsVS, fragmentShader: cmW3 }, Cesium.PrimitiveType.TRIANGLES));

        }
        else if (this.loadDS && (this.setting.cmType == "ws1")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },



                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },


                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmAVS, fragmentShader: cmWS1 }, Cesium.PrimitiveType.TRIANGLES));

        }
        else if (this.loadDS && (this.setting.cmType == "ws2")) {
            let attributesUVS = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                // "a_uv": {
                //     index: 1,
                //     componentsPerAttribute: 2,
                //     vertexBuffer: peroneJSON.uv,//normal array
                //     componentDatatype: Cesium.ComponentDatatype.FLOAT
                // },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },

                u_U_mm: () => { return { x: this.oneJSON.dataContent.U.min, y: this.oneJSON.dataContent.U.max } },
                u_V_mm: () => { return { x: this.oneJSON.dataContent.V.min, y: this.oneJSON.dataContent.V.max } },
                u_dem_mm: () => { return { x: this.oneJSON.dataContent.DEM.min, y: this.oneJSON.dataContent.DEM.max } },
                u_zbed_mm: () => { return { x: this.oneJSON.dataContent.zbed.min, y: this.oneJSON.dataContent.zbed.max } },



                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },


                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };

            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmAVS, fragmentShader: cmWS2 }, Cesium.PrimitiveType.TRIANGLES));

        }
        else {
            this.updateOfListCommands = true;
        }
        if (this.loadDS && this.setting.framlines === true) {
            let attributes = {
                "a_index": {
                    index: 0,
                    componentsPerAttribute: 1,
                    vertexBuffer: this.framelines.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: this.framelines.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMap = {
                // u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                u_DS: () => {
                    // console.log(this.DS[this.getCurrentLevelByIndex()])
                    return this.DS[this.getCurrentLevelByIndex()];
                },
                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return this.getEnableDEM() },
                u_dem_base: () => { return this.getBaseZ() },

                u_z_enable_dem_rate: () => { return this.getRateDEM() },
                u_z_baseZ: () => { return this.getBaseZ() },
                u_z_rateZbed: () => { return this.getRateZbed() },
            };
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributes, uniformMap, { vertexShader: cmflVS, fragmentShader: framelineFS }, Cesium.PrimitiveType.LINES));

        }
        return nc;

    }
    /**
     * 设置更新command，数据变更
     * @param {*} flag :boolean ,default=true
     */
    setUpdateOfListCommands(flag = true) {
        this.updateOfListCommands = flag;
    }
    /**
     * 加载数据源
     * @param {*} context :any,cesium 上下文
     * @param {*} url   ：image
     * @param {*} index     ：number ,第几帧数据
     * @param {*} first ：是否为第一次加载，默认：false（不是）
     */
    loadDataSource(context, url, index, first = false) {
        let scope = this;
        let windImage = new Image();

        windImage.src = url;
        let n = parseInt(index);

        windImage.onload = function () {
            // scope.windData = windData;
            scope.DS[n] = new Cesium.Texture({
                context: context,
                width: scope.getCols(),
                height: scope.getRows(),
                pixelFormat: Cesium.PixelFormat.RGBA,
                pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                source: windImage,
                sampler: new Cesium.Sampler({
                    minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                    magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                })
            });
            if (first === true)
                scope.loadDS = true;
        };
    }
    async createTextureFromUrl(context, url, samplerFlag = false, repeat = true) {

        let img = new Image();
        img.src = url;
        const wrap = repeat ? Cesium.TextureWrap.REPEAT : Cesium.TextureWrap.CLAMP_TO_EDGE;
        let texture = await new Promise(resolve => {
            img.onload = function () {
                resolve(new Cesium.Texture({
                    context: context,
                    width: img.width,
                    height: img.height,
                    pixelFormat: Cesium.PixelFormat.RGBA,
                    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                    source: img,
                    sampler: new Cesium.Sampler({
                        // 	minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                        // 	magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                        wrapS: wrap,
                        wrapT: wrap,
                    })
                })
                )
            }
        })
        // console.log("createTextureFromUrl")
        return texture;
    }
    async createTextureNearestFromUrl(context, url) {

        let img = new Image();
        img.src = url;

        let texture = await new Promise(resolve => {
            img.onload = function () {
                resolve(new Cesium.Texture({
                    context: context,
                    width: img.width,
                    height: img.height,
                    pixelFormat: Cesium.PixelFormat.RGBA,
                    pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
                    source: img,
                    sampler: new Cesium.Sampler({
                        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
                    })
                })
                )
            }
        })
        // console.log("createTextureFromUrl")
        return texture;
    }
    /**
     * 初始化数据源
     * @param {*} context cesium 上下文
     */
    async initData(context) {
        console.log("浮点纹理", context.floatingPointTexture);
        this.loadDSing = true;
        let data = this.oneJSON.data;
        //已有global texture source

        this.textures["grayNoise64x64"] = await this.createTextureFromUrl(context, "/noise/grayNoise64x64.png");
        this.textures["pebbles"] = await this.createTextureFromUrl(context, "/noise/pebbles.png");

        if (Object.keys(this.GTS).length == 2) {
            this.DS = this.GTS.textureArray;
        }
        else {
            for (let i in data) {
                this.DS[parseInt(i)] = await this.createTextureNearestFromUrl(context, data[i].png);
                if (i === "0") {
                    // console.log("DS texture:", this.DS[parseInt(i)]);
                    this.set_CMAA(context, this.DS[parseInt(i)]._width, this.DS[parseInt(i)]._height);
                }
                // if (i == 0) {
                //     this.loadDataSource(context, data[i].png, i, true);
                // }
                // else {
                //     this.loadDataSource(context, data[i].png, i, false);
                // }
            }
            this.loadDS = true;
            this.GTS.textureArray = this.DS;
            this.GTS.dataArray = data;
        }
    }

    set_CMAA(context, w, h) {
        const CMMAA_array = new Float32Array(w * h * 4);//1024*4,RGBA
        // const CMMAA_array = new Uint8Array(w * h * 4);//1024*4,RGBA
        for (let i = 0; i < w * h * 4; i++)
            CMMAA_array[i] = 1000.0;

        const colorTextureOptions = {
            context: context,
            width: w,
            height: h,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.FLOAT
            // pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
            ,
            sampler: new Cesium.Sampler({
                // the values of texture will not be interpolated
                minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
            })
        };
        this.CMAA1 = this.createTexture(colorTextureOptions, CMMAA_array);
        this.CMAA2 = this.createTexture(colorTextureOptions, CMMAA_array);
        this.CMAA = this.createTexture(colorTextureOptions, CMMAA_array);
        this.CMAA_compute_flag = true;
        this.CMAA_w = w;
        this.CMAA_h = h;
    }
    /**
     * 二维网格的cols
     * @returns :number
     */
    getCols() {
        return this.oneJSON.dem.cols;
    }
    /**
     * 二维网格的rows
     * @returns :number
     */
    getRows() {
        return this.oneJSON.dem.rows;
    }

    //////////////////////////////////////////////
    // wind map

    set_numParticles(context, numParticles) {
        let temp_numParticles = false;
        if (this.particleStateTexture0) {
            // return;
            this.particleStateTexture0.destroy();
            this.particleStateTexture1.destroy();
            temp_numParticles = this._numParticles;
        }
        // let width = context.drawingBufferWidth;
        // let height = context.drawingBufferHeight;
        // this.w = width;
        // this.h = height;
        // console.log(this.w, this.h)
        const particleRes = this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
        this._numParticles = particleRes * particleRes;
        const particleState = new Uint8Array(particleRes * particleRes * 4);//1024*4,RGBA

        for (let i = 0; i < particleRes * particleRes * 4; i++)
            particleState[i] = Math.floor(Math.random() * 256);

        const colorTextureOptions = {
            context: context,
            width: particleRes,
            height: particleRes,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
            ,
            sampler: new Cesium.Sampler({
                // the values of texture will not be interpolated
                minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
                magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
            })
        };

        this.particleStateTexture0 = this.createTexture(colorTextureOptions, particleState);
        this.particleStateTexture1 = this.createTexture(colorTextureOptions, particleState);

        if (temp_numParticles === this._numParticles && this.particleIndexBuffer) { }
        else {

            const particleIndices = new Float32Array(this._numParticles);
            for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
            this.particleIndices = particleIndices;
            this.particleIndexBuffer = this.createVAO(context, particleIndices);// = util.createBuffer(gl, particleIndices);
        }
    }
    get_numParticles() {
        return this._numParticles;
    }
    setColorRamp(context, colors) {
        if (this.colorRampTexture) return;
        // lookup texture for colorizing the particles according to their speed
        const colorTextureOptions = {
            context: context,
            width: 16,
            height: 16,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
        };
        // this.colorRampTexture = UtilFBO.createTexture(colorTextureOptions, this.getColorRamp(colors));
        let data = this.getColorRamp(colors)
        this.colorRampTexture = new Cesium.Texture({
            context: context,
            width: 16,
            height: 16,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
            source: { arrayBufferView: data }
        });
    }
    getColorRamp(colors) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 256;
        canvas.height = 1;

        const gradient = ctx.createLinearGradient(0, 0, 256, 0);
        for (const stop in colors) {
            gradient.addColorStop(+stop, colors[stop]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 1);
        // canvas.style = "   position: absolute; z-index: 1;"
        // document.body.appendChild(canvas);
        return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
    }

    ///////////////////////////////////////////////////
    // cesium ext.


    ///////////////////////////////////////////////////////////////
    // base function
    /**
     * 返回帧数及当前帧的index
     * @returns [index,total]
     */
    getIndexListOfCM() {
        return [this.getCurrentLevelByIndex(), this.oneJSON.data.length];
    }
    // getCMNameList(){
    //     return 
    // }
    updateSource(oneJSON) {
        this.visible = false;
        for (let i of this.DS) {
            i.destroy();
        }
        this.init(oneJSON);
        this.setUpdateOfListCommands(true);

        // this.updateCM(level, name)
    }


    /**
     * 设置是否使用DEM
     * @param {*} enable :boolen ,default=true
     */
    setEnableDEM(enable = true) {
        this.setting.z.dem = enable;
    }
    /**
     * 设置是否使用zbed
     * @param {*} enable :boolen ,default=true
     */
    setEnableZbed(enable = true) {
        this.setting.z.zbed_up = enable;
    }
    /**
     * 设置是否使用基础高度
     * @param {*} enable :boolen ,default=true
     */
    setEnableBaseZ(enable = true) {
        this.setting.z.base_z_enable = enable;
    }


    /**
     * 设置是基础高度
     * @param {*} enable :number ,default=0
     */
    setBaseZ(z = 0) {
        this.setting.z.base_z = z;
    }
    /**
 * 设置是zbed的倍率，
 * @param {*} enable :number ,default=1
 */
    setRateZbed(rate = 1) {
        this.setting.z.RateZbed = rate;
    }
    /**
 * 设置是dem的倍率
 * @param {*} enable :number ,default=1
 */
    setRateDEM(rate = 1) {
        this.setting.z.RateDEM = rate;
    }
    /**
     * 获取当前设置的基础高度
     * @returns 基础高度，默认为0
     */
    getBaseZ() {
        if (this.setting.z.base_z_enable === true)
            return this.setting.z.base_z;
        else
            return 0;
    }
    /**
 * 获取当前设置的zbed的倍率
 * @returns 基础高度，默认为1
 */
    getRateZbed() {
        if (this.setting.z.zbed_up === true)
            return this.setting.z.RateZbed;
        else
            return 1;
    }
    /**
* 获取当前设置的dem的倍率
* @returns 基础高度，默认为1
*/

    getEnableDEM() {
        if (this.setting.z.dem === true) {
            return true;
        }
        else
            return false;
    }


    getRateDEM() {
        if (this.getEnableDEM() === true) {
            return this.setting.z.RateDEM;
        }
        else
            return 1;
    }

    /**
     * 风场粒子数量
     * @param {*} value :number ,默认：4096 
     */
    setWMCounts(value = 4096) {
        this.setting.wind.counts = value;
    }
    /**
     * 设置粒子衰减率
     * @param {*} value :number ,default 0.996
     */
    setWMFadeOpacity(value = 0.996) {
        this.setting.wind.fadeOpacity = value;
    }
    /**
     * 设置速度因子
     * @param {*} value :number ,default 0.25
     */
    setWMSpeedFactor(value = 0.25) {
        this.setting.wind.fadeOpacity = value;
    }

    /**
     * 设置掉落倍率
     * @param {*} value :number ,default 0.003
     */
    setWMDropRate(value = 0.003) {
        this.setting.wind.dropRate = value;
    }
    /**
     * 掉落随机率
     * @param {*} value :number ,default 0.01
     */
    setWMDropRateBump(value = 0.01) {
        this.setting.wind.dropRateBump = value;
    }

    /**
     * 设置速度色表
     * @param {*} value :{}
     */
    setWMDefaultRampColors(value) {
        this.setting.wind.defaultRampColors = value;
    }
    /**
     * 设置zbed是否使用全局过滤
     * @param {*} g :boolean,default true
     */
    setFilterZbedGlobal(g = true) {
        this.oneJSON.dataContent.zbed.global_MM = g;
    }
    /**
     * 设置VU是否使用全局过滤
     * @param {*} g :boolean,default true
     */
    setFilterUVGlobal(g = true) {
        this.oneJSON.dataContent.U.global_MM = g;
        this.oneJSON.dataContent.V.global_MM = g;
    }
    ////////////////////////////////

    /**
     * 设置zbed的过滤种类
     * 
     * @param {number } g,default 1，
     * 
     * 1= 数值
     * 
     * 2=百分比
     */
    setFilterZbedfilterKind(g = 1) {
        this.oneJSON.dataContent.zbed.filterKind = g;
    }

    /**
     * 设置UV的过滤种类
     * 
     * @param {number } g,default 1，
     * 
     * 1= 数值
     * 
     * 2=百分比
     */
    setFilterUVfilterKind(g = 1) {
        this.oneJSON.dataContent.U.filterKind = g;
        this.oneJSON.dataContent.V.filterKind = g;
    }
    /**
     * 设置zbed是否应用过滤
     * @param {*} g :boolean ,default true
     */
    setEnableFilterZbed(g = true) {
        this.oneJSON.dataContent.zbed.filter = g;
    }

    /**
     * 设置UV是否使用过滤
     * @param boolean g ,default true
     */
    setEnableFilterUV(g = true) {
        this.oneJSON.dataContent.U.filter = g;
        this.oneJSON.dataContent.V.filter = g;
    }
    /**
     * 设置zbed的过滤范围，因种类不同而不同
     * @param number[] g 
     */
    setFilterZbedfilterValue(g = []) {
        this.oneJSON.dataContent.zbed.filterValue = g;
    }
    /**
     * 设置UV的过滤范围，因种类不同而不同
     * @param number[] g 
     */
    setFilterUVfilterValue(g = []) {
        this.oneJSON.dataContent.U.filterValue = g;
        this.oneJSON.dataContent.V.filterValue = g;
    }



    resize(event, that) {
        if (this.setting.cmType == "wind") {
            that.updateOfListCommands = true;
            that.resizeFlag = true;
        }        // const gl = this.gl;
        // const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
        // // screen textures to hold the drawn screen for the previous and the current frame
        // this.backgroundTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
        // this.screenTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
    }
    /**
     * 设置风场粒子大小（像素）
     * @param number size ,default 1
     */
    setWMPointSize(size = 1) {
        size = parseInt(size);
        this.setting.wind.pointSize = size;
    }
    /**
     * 获取风场粒子大小（尺寸）
     * @returns number,粒子尺寸
     */
    getWMPointSize() {
        return this.setting.wind.pointSize;
    }

    /**
     * 设置UV过滤的 逻辑：and /or
     * @param boolean and 
     * 
     * default true (and) 
     * 
     * fale(or)
     */
    setWMUV_and_or(and = true) {
        this.setting.wind.UV_and_or = and;
    }

    /**
     *  设置UV过滤的 逻辑：and /or
     *
     * 
     * default true (and) 
     * 
     * fale(or)
     * 
     * @returns  boolean 
     */
    getWMUV_and_or() {
        return this.setting.wind.UV_and_or;
    }


    /**
     * 需要覆写的，每个不同
     * @param {*} level 
     */
    updateCM(level) {

    }

    ///////////////////////////////////////////////////
    //CM water 
    getCMWaterWaveSpeed() {
        if (typeof this.setting.cmWater != undefined && typeof this.setting.cmWater.speed != "undefined") {
            return this.setting.cmWater.speed;
        }
        else
            return 1.0
        // cmWater: {
        //     speed: 1.,
        //     scale: 0.5,
        //     opacity: 0.105,
        // },
    }
    getCMWaterWaveScale() {
        if (typeof this.setting.cmWater != undefined && typeof this.setting.cmWater.scale != "undefined") {
            return this.setting.cmWater.scale;
        }
        else
            return 1.0
    }
    getCMWaterWaveOpacity() {
        if (typeof this.setting.cmWater != undefined && typeof this.setting.cmWater.opacity != "undefined") {
            return this.setting.cmWater.opacity;
        }
        else
            return 0.105;
    }

    /**
     * 核心入口，cesium规范
    * @param {FrameState} frameState
    */
    update(frameState) {
        if (this.setting.cmType == "wind" && this.viewer !== false) {
            this.checkWindMapSize();
            // this.setUpdateOfListCommands(true);
        }
        else if (this.setting.cmType == "wind" && this.viewer === false) {
            // console.log("风场模式,但input的JSON中没有viewer");
            throw new Error("风场模式,但input的JSON中没有viewer");
        }
        if (typeof this.frameState == "undefined")
            this.frameState = frameState;
        if (this.visible)
            if (this.initFinish)
                for (let perOne of this.getCommands(frameState, this._modelMatrix)) {
                    for (let perNC of perOne)
                        frameState.commandList.push(perNC);
                }
    }
    checkWindMapSize() {
        let ds = this.oneJSON.dem;
        let rate = 1.0;
        let rateScale = 0.5;
        let mm = this.setting.dynWindMapMM;
        let rect = this.getViewExtend();
        let min = Cesium.Cartesian3.fromDegrees(rect.minx, rect.miny);
        let max = Cesium.Cartesian3.fromDegrees(rect.maxx, rect.maxy);


        let orgin_min = Cesium.Matrix4.multiplyByPoint(this._modelMatrix_inverse, min, new Cesium.Cartesian3());
        let orgin_max = Cesium.Matrix4.multiplyByPoint(this._modelMatrix_inverse, max, new Cesium.Cartesian3());
        let doit = false;
        let new_mm = {
            min: {
                x: parseInt(orgin_min.x / ds.cellsize),
                y: parseInt(orgin_min.y / ds.cellsize)
            },
            max: {
                x: parseInt(orgin_max.x / ds.cellsize),
                y: parseInt(orgin_max.y / ds.cellsize)
            }
        };

        if (mm.start.x === false) {
            doit = true;
        }
        else if ((
            (new_mm.min.x < mm.start.x && mm.start.x > 0) || (new_mm.min.y < mm.start.y && mm.start.y > 0)//left xy > 0
            || (new_mm.max.x > mm.end.x && mm.end.x < ds.cols) || (new_mm.max.y > mm.end.y && mm.end.y < ds.rows)//right xy >max ,并且未大于 行列数
            // || (new_mm.max.x < mm.end.x && mm.end.x == ds.cols) || (new_mm.max.y < mm.end.y && mm.end.y == ds.rows)// right xy > 行数或列数
            || (mm.end.x - new_mm.max.x > mm.range * rate) || (mm.end.y - new_mm.max.y > mm.range * rate)//max over range
            || (new_mm.min.x - mm.start.x > mm.range * rate) || (new_mm.min.y - mm.start.y > mm.range * rate)//min over range 

            // || (mm.end.x - new_mm.max.x < rateScale * mm.range * rate) || (mm.end.y - new_mm.max.y < rateScale * mm.range * rate)
            // || (new_mm.min.x - mm.start.x < rateScale * mm.range * rate) || (new_mm.min.y - mm.start.x < rateScale * mm.range * rate)
        ) && ((new_mm.min.x != parseInt(mm.start.x + mm.range * rate)) || (new_mm.min.y != parseInt(mm.start.x + mm.range * rate)))
        ) {
            doit = true;
        }
        if (doit) {
            // console.log(mm, new_mm);
            // console.log("&& 1", (new_mm.min.x != parseInt(mm.start.x - mm.range * rate)));
            // console.log("&& 2", (new_mm.min.y != parseInt(mm.start.x - mm.range * rate)));
            // console.log("|| 1", (new_mm.min.x < mm.start.x && mm.start.x > 0));
            // console.log("|| 2", (new_mm.min.y < mm.start.y && mm.start.y > 0));
            // console.log("|| 3", (new_mm.max.x > mm.end.x && mm.end.x < ds.cols));
            // console.log("|| 4", (new_mm.max.y > mm.end.y && mm.end.y < ds.rows));
            // console.log("|| 5", (mm.end.x - new_mm.max.x > mm.range * rate));
            // console.log("|| 6", (mm.end.y - new_mm.max.y > mm.range * rate));
            // console.log("|| 7", (new_mm.min.x - mm.start.x > mm.range * rate));
            // console.log("|| 8",  (new_mm.min.y - mm.start.y > mm.range * rate));


            if (orgin_min.x <= 0) {
                mm.start.x = 0;
            }
            else {
                mm.start.x = parseInt(orgin_min.x / ds.cellsize);
                if (mm.start.x - mm.range <= 0) {
                    mm.start.x = 0;
                }
                else {
                    mm.start.x -= mm.range;
                }
            }
            if (orgin_min.y <= 0) {
                mm.start.y = 0;
            }
            else {
                mm.start.y = parseInt(orgin_min.y / ds.cellsize);
                if (mm.start.y - mm.range <= 0) {
                    mm.start.y = 0;
                }
                else {
                    mm.start.y -= mm.range;
                }
            }

            if (orgin_max.x >= ds.cols * ds.cellsize) {
                mm.end.x = ds.cols;
            }
            else {
                mm.end.x = parseInt(orgin_max.x / ds.cellsize);
                if (mm.end.x + mm.range >= ds.cols * ds.cellsize) {
                    mm.end.x = ds.cols;
                }
                else {
                    mm.end.x += mm.range;
                }
            }
            if (orgin_max.y >= ds.rows * ds.cellsize) {
                mm.end.y = ds.rows;
            }
            else {
                mm.end.y = parseInt(orgin_max.y / ds.cellsize);
                if (mm.end.y + mm.range >= ds.rows * ds.cellsize) {
                    mm.end.y = ds.rows;
                }
                else {
                    mm.end.y += mm.range;
                }
            }
            let cols = this.oneJSON.dem.cols;
            let rows = this.oneJSON.dem.rows;
            let mmx = mm.end.x - mm.start.x;
            let mmy = mm.end.y - mm.start.y;
            if (mmx > cols * 0.5 || mmy > rows * 0.5) {

                if (this.WMs_origin.index.length == this.WMs.index.length) {
                    this.updateOfListCommands = false;
                }
                else {
                    this.WMs = this.WMs_origin;
                    this.updateOfListCommands = true;
                }

                return;
            } else {
                this.renewNetworkDS(mm);
                this.renewFlag = true;
                this.updateOfListCommands = true;
            }


        }

    }
    renewNetworkDS(mm) {
        let cols = this.oneJSON.dem.cols;
        let rows = this.oneJSON.dem.rows;
        // let mmx = mm.end.x - mm.start.x;
        // let mmy = mm.end.y - mm.start.y;
        // if (mmx > cols * 0.5 || mmy > rows * 0.5) {
        //     this.WMs = this.WMs_origin;
        //     return;
        // }
        this.WMs =
        {
            index: [],
            tp: [],
            uv: [],
        }
            ;
        for (let ri = mm.start.y; ri < mm.end.y; ri++) {
            for (let ci = mm.start.x; ci < mm.end.x; ci++) {
                //124
                this.WMs.index.push((ci + 0) + (ri + 0) * cols);
                this.WMs.index.push((ci + 1) + (ri + 0) * cols);
                this.WMs.index.push((ci + 1) + (ri + 1) * cols);
                this.WMs.tp.push(0, 1, 2);
                //134
                this.WMs.index.push((ci + 0) + (ri + 0) * cols);
                this.WMs.index.push((ci + 0) + (ri + 1) * cols);
                this.WMs.index.push((ci + 1) + (ri + 1) * cols);
                this.WMs.tp.push(3, 4, 5);
            }
        }
    }
    getViewExtend() {
        let params = {};
        let extend = this.viewer.camera.computeViewRectangle();
        if (typeof extend === "undefined") {
            //2D下会可能拾取不到坐标，extend返回undefined,因此作如下转换
            let canvas = this.viewer.scene.canvas;
            let upperLeft = new Cesium.Cartesian2(0, 0); //canvas左上角坐标转2d坐标
            let lowerRight = new Cesium.Cartesian2(
                canvas.clientWidth,
                canvas.clientHeight
            ); //canvas右下角坐标转2d坐标

            let ellipsoid = this.viewer.scene.globe.ellipsoid;
            let upperLeft3 = this.viewer.camera.pickEllipsoid(upperLeft, ellipsoid); //2D转3D世界坐标

            let lowerRight3 = this.viewer.camera.pickEllipsoid(lowerRight, ellipsoid); //2D转3D世界坐标

            let upperLeftCartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(upperLeft3); //3D世界坐标转弧度
            let lowerRightCartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(lowerRight3); //3D世界坐标转弧度

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

}

export { CCMSNW };

