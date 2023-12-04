import * as Cesium from "cesium";

import {  drawVert ,drawFrag,quadVert,opFrag, NupdateFrag,cpFS,cpTextureFS,uvsVS,uvsFS ,cmFS ,cmVS,cmAFS,cmAVS,cmW1,cmW2,cmW3,cmWS1,cmWS2}  from "./shaders/ccmIMG/material";
// import drawVert from './shaders/ccmIMG/draw.vert.glsl?raw';
// import drawFrag from './shaders/ccmIMG/draw.frag.glsl?raw';
// import quadVert from './shaders/ccmIMG/quad.vert.glsl?raw';
// import opFrag from './shaders/ccmIMG/op.frag.glsl?raw';
// import NupdateFrag from './shaders/ccmIMG/Nupdate.frag.glsl?raw';
// import cpFS from './shaders/ccmIMG/cp.fs.glsl?raw';
// import cpTextureFS from './shaders/ccmIMG/cpTexture.fs.glsl?raw';//修改显示u_wind
// import uvsVS from './shaders/ccmIMG/uvs.vs.glsl?raw';
// import uvsFS from './shaders/ccmIMG/uvs.fs.glsl?raw';
// import cmFS from './shaders/ccmIMG/cm.fs.glsl?raw';
// import cmVS from './shaders/ccmIMG/cm.vs.glsl?raw';
// import cmAFS from './shaders/ccmIMG/cmArrow.fs.glsl?raw';
// import cmAVS from './shaders/ccmIMG/cmArrow.vs.glsl?raw';
// import cmW1 from './shaders/ccmIMG/cmW1.fs.glsl?raw';
// import cmW2 from './shaders/ccmIMG/cmW2.fs.glsl?raw';
// import cmW3 from './shaders/ccmIMG/cmW3.fs.glsl?raw';
// import cmWS1 from './shaders/ccmIMG/wave2DDir.fs.glsl?raw';
// import cmWS2 from './shaders/ccmIMG/wave2DDirGabor.fs.glsl?raw';

//import * as rgbaJSON from "../../public/RGBA/rgba.json";

class CNWCM {
    constructor(modelMatrix, oneJSON, setting = false) {


        this.oneJSON = oneJSON;
        this._modelMatrix = modelMatrix
        this.visible = true;
        this.resizeFlag = false;
        this.CMs = [];
        this.loadDS = false;
        this.iTime = 0.0;
        this.GTS = {
        };
        if (typeof window.GTS != "undefined") {
            this.GTS = window.GTS;
        }
        else
            window.GTS = this.GTS;

        this.setting = {
            z: {
                dem: true,
                zbed_up: true,
                base_z: 0.0,
                base_z_enable: true,
                RateZbed: 1,
                RateDEM: 1,
            },
            wind: {
                fadeOpacity: 0.996, // how fast the particle trails fade on each frame
                speedFactor: 0.25, // how fast the particles move
                dropRate: 0.003, // how often the particles move to a random place
                dropRateBump: 0.01, // drop rate increase relative to individual particle spe
                defaultRampColors: {
                    0.0: '#3288bd',
                    0.1: '#66c2a5',
                    0.2: '#abdda4',
                    0.3: '#e6f598',
                    0.4: '#fee08b',
                    0.5: '#fdae61',
                    0.6: '#f46d43',
                    1.0: '#d53e4f'
                },
                counts: 4096,
                pointSize: 1,
                UV_and_or: true,//and ==  true ,or =false
            },
            cmType: "cm",
            cm: "zbed",//zbed,U,V,UV(arrow,wind,water),""
            currentLevel: 0,
            play: {
                circle: 0,
                interval: 0.5,
                circleCounts: 0,
            }
        };
        this.DS = [];
        this.loadDSing = false;

        if (setting) {
            if (typeof setting.z != "undefined") {
                for (let i in setting.z) {
                    this.setting.z[i] = setting.z[i];
                }
            }
            if (typeof setting.wind != "undefined") {
                for (let i in setting.wind) {
                    this.setting.wind[i] = setting.wind[i];
                }
            }
            if (typeof setting.cmType != "undefined") {
                this.setting.cmType = setting.cmType;
            }
        }
        this.timer = {
            visible: false,
            timer: false,
            timerIndex: 0,//for timer ++
        };
        let that = this;
        window.addEventListener("resize", function (event) {
            that.resize(event, that);
        });

        // this.material = new Material();
        this.listCommands = [];
        this.updateOfListCommands = true;
        // this.setting.cmType = this.setting.cmType;

        this.init(oneJSON);
    }
    init(oneJSON) {
        this.CMs = [
            {
                index: [],
                tp: [],
                uv: [],
            }
        ];
        let cols = oneJSON.dem.cols;
        let rows = oneJSON.dem.rows;
        this.imageW = cols;
        this.imageH = rows;
        let tIndex = 0;

        for (let ri = 0; ri < rows - 1; ri++) {
            for (let ci = 0; ci < cols - 1; ci++) {
                if (tIndex == 6) tIndex = 0;
                this.CMs[0].index.push((ci + 0) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 1) * cols);

                this.CMs[0].tp.push(tIndex++, tIndex++, tIndex++);

                this.CMs[0].index.push((ci + 0) + (ri + 0) * cols);
                this.CMs[0].index.push((ci + 1) + (ri + 1) * cols);
                this.CMs[0].index.push((ci + 0) + (ri + 1) * cols);

                this.CMs[0].tp.push(tIndex++, tIndex++, tIndex++);
            }
        }
        this.DS = [];
        this.setting.currentLevel = 0;
        this.loadDS = false
        this.loadDSing = false;
        this.visible = true;

        this.setting.z.initFinish = true;
    }

    getWorldBoxObject() {
        return this.CMs;
    }

    getCommands(frameState, modelMatrix) {
        if (this.updateOfListCommands === true) {
            this.listCommands = [];
            for (let peroneJSON of this.getWorldBoxObject()) {
                let perCommand = this.getTFL(frameState, peroneJSON, modelMatrix);
                if (perCommand.length > 0)
                    this.listCommands.push(perCommand);

            }
            if (this.listCommands.length > 0)
                this.updateOfListCommands = false;
        }
        return this.listCommands;
    }
    /**
    * @param {FrameState} frameState
    */
    update(frameState) {
        if (typeof this.frameState == "undefined")
            this.frameState = frameState;
        if (this.visible)
            if (this.setting.z.initFinish)
                for (let perOne of this.getCommands(frameState, this._modelMatrix)) {
                    for (let perNC of perOne)
                        frameState.commandList.push(perNC);
                }
    }

    getTFL(frameState, peroneJSON, modelMatrix) {
        let list = [];
        let nc = [];
        if (this.loadDS === false || this.updateOfListCommands === true) {
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
        } else if (this.setting.cmType == "wind" && (this.resizeFlag == true || this.renewFlag == true)) {
            this.FBO1.destroy();
            this.FBO2.destroy();
            this.FBO1 = this.createFramebuffer(frameState.context);
            this.FBO2 = this.createFramebuffer(frameState.context);
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
                iTime: () => { this.iTime += 0.0051; return this.iTime },
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

            };
            // // // // // // // update to  PST2
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
                    vertexBuffer: peroneJSON.index,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },

                "a_tp": {
                    index: 1,
                    componentsPerAttribute: 1,
                    vertexBuffer: peroneJSON.tp,//normal array
                    componentDatatype: Cesium.ComponentDatatype.FLOAT
                },
            };
            let uniformMapUVS = {
                iTime: () => { this.iTime += 0.0051; return this.iTime },

                u_DS_XY: () => { return { x: this.oneJSON.dem.cols, y: this.oneJSON.dem.rows } },
                u_DS_CellSize: () => { return this.oneJSON.dem.cellsize },
                u_dem_enable: () => { return true },
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
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[1],
                    }
                },

                u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                u_channel0: () => { return this.FBO1.getColorTexture(0); },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v
                u_UV_and: () => { return this.getWMUV_and_or() },

            };
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMapUVS, { vertexShader: uvsVS, fragmentShader: uvsFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1]));//copy uvs
            // nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, {}, { vertexShader: this.material.uvsVS, fragmentShader: this.material.uvsFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1]));//copy uvs

            // // // // // // //copy to FBO2
            nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, {}, { vertexShader: quadVert, fragmentShader: cpFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1], this.FBO2));//copy 
            //  nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesFC, {}, { vertexShader: this.material.quadVert, fragmentShader: this.material.cpFS }, Cesium.PrimitiveType.TRIANGLES, [this.FBO1], this.FBO2));//copy 
        }
        else if (this.loadDS && (this.setting.cmType == "cm" || this.setting.cmType == "cmBlue")) {
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
                u_dem_enable: () => { return true },
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
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[1],
                    }
                },

                // u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                // u_channel0: () => { return this.particleStateTexture0; },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

            };
            if (this.setting.cmType == "cmBLue") {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmBlueFS }, Cesium.PrimitiveType.TRIANGLES));
            }
            else {
                nc.push(this.createCommandOfChannel(frameState, modelMatrix, attributesUVS, uniformMap, { vertexShader: cmVS, fragmentShader: cmFS }, Cesium.PrimitiveType.TRIANGLES));
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
                u_dem_enable: () => { return true },
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
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterKind,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterKind,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterKind : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterKind,
                    }
                },
                u_filter: () => {
                    return {
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filter : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filter,
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filter : this.oneJSON.data[this.getCurrentLevelByIndex].U.filter,
                        z: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filter : this.oneJSON.data[this.getCurrentLevelByIndex].V.filter,
                    }
                },
                u_filterValue_zebd: () => {
                    return {
                        // x: this.oneJSON.dataContent.zbed.filterValue[0],
                        // y: this.oneJSON.dataContent.zbed.filterValue[1]
                        x: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[0],
                        y: this.oneJSON.dataContent.zbed.global_MM ? this.oneJSON.dataContent.zbed.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].zbed.filterValue[1],
                    }
                },
                u_filterValue_U: () => {
                    return {
                        // x: this.oneJSON.dataContent.U.filterValue[0],
                        // y: this.oneJSON.dataContent.U.filterValue[1]
                        x: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[0],
                        y: this.oneJSON.dataContent.U.global_MM ? this.oneJSON.dataContent.U.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].U.filterValue[1],
                    }
                },
                u_filterValue_V: () => {
                    return {
                        // x: this.oneJSON.dataContent.V.filterValue[0],
                        // y: this.oneJSON.dataContent.V.filterValue[1]
                        x: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[0] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[0],
                        y: this.oneJSON.dataContent.V.global_MM ? this.oneJSON.dataContent.V.filterValue[1] : this.oneJSON.data[this.getCurrentLevelByIndex].V.filterValue[1],
                    }
                },

                // u_color_ramp: () => { return this.colorRampTexture; },
                u_DS: () => { return this.DS[this.getCurrentLevelByIndex()]; },
                // u_channel0: () => { return this.particleStateTexture0; },

                u_UVs: () => { return false; },
                u_CMType: () => { return 1; },//1=zbed,2=u,3=v

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
                u_dem_enable: () => { return true },
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
                u_dem_enable: () => { return true },
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
                u_dem_enable: () => { return true },
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
                u_dem_enable: () => { return true },
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
                u_dem_enable: () => { return true },
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

        return nc;

    }
    setUpdateOfListCommands(flag = true) {
        this.updateOfListCommands = flag;
    }
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
    initData(context) {
        this.loadDSing = true;
        let data = this.oneJSON.data;
        if (Object.keys(this.GTS).length == 2) {
            this.DS = this.GTS.textureArray;

        }
        else {
            for (let i in data) {
                if (i == 0) {
                    this.loadDataSource(context, data[i].png, i, true);
                }
                else {
                    this.loadDataSource(context, data[i].png, i, false);
                }
            }
            this.GTS.textureArray = this.DS;
            this.GTS.dataArray = data;
        }
    }

    getCols() {
        return this.oneJSON.dem.cols;
    }
    getRows() {
        return this.oneJSON.dem.rows;
    }
    getCurrentLevelByIndex() {
        return this.setting.currentLevel;
    }
    setCurrentLevelByIndex(lll = 0) {
        this.setting.currentLevel = lll;
        this.updateCM(lll);
    }

    //////////////////////////////////////////////
    // wind map

    set_numParticles(context, numParticles) {
        if (this.particleStateTexture0) return;
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

        const particleIndices = new Float32Array(this._numParticles);
        for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
        this.particleIndices = particleIndices;
        this.particleIndexBuffer = this.createVAO(context, particleIndices);// = util.createBuffer(gl, particleIndices);
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

    createTextures(context) {
        let scope = this;
        if (this.channel === false) return
        this.image = new Image()
        this.image.src = '/public/leaves.jpg'
        this.image.onload = () => {
            scope.texture = new Cesium.Texture({
                context: context,
                source: scope.image
            });
        }
        // if (scope.channel !== false)
        //     return new Cesium.Texture({
        //         context: frameState.context,
        //         source: scope.channel.getDataUrl()
        //     })
    }

    createCommandOfChannel(frameState, modelMatrix, attributes, uniform, material, type = Cesium.PrimitiveType.TRIANGLES, Channal = [], fbo = undefined) {
        let uniformMap = uniform;
        if (typeof Channal == "object") {
            for (let i = 0; i < Channal.length; i++) {
                if (typeof Channal[i] == "object") {
                    uniformMap["u_channel" + i] = () => { return Channal[i].getColorTexture(0) };
                }
            }
        }
        if (typeof attributes == "object") {
            let a_att = [];
            let attributeLocations = {};
            for (let i in attributes) {
                let perOne = attributes[i];
                let newOne = JSON.parse(JSON.stringify(perOne));
                newOne.vertexBuffer = Cesium.Buffer.createVertexBuffer({
                    usage: Cesium.BufferUsage.STATIC_DRAW,
                    typedArray: new Float32Array(perOne.vertexBuffer),
                    context: frameState.context,
                });
                attributeLocations[i] = newOne.index;
                a_att.push(newOne);
            }

            const vertexArray = new Cesium.VertexArray({
                context: frameState.context,
                attributes: a_att
            });

            const program = Cesium.ShaderProgram.fromCache({
                context: frameState.context,
                vertexShaderSource: material.vertexShader,
                fragmentShaderSource: material.fragmentShader,
                attributeLocations: attributeLocations,
            });

            let renderState = {};

            if (fbo == "undefined") {
                renderState = new Cesium.RenderState({
                    depthTest: {
                        enabled: false
                    },
                });
            }
            else {
                renderState = new Cesium.RenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    //depthMask: true
                });
            }
            return new Cesium.DrawCommand({
                modelMatrix: modelMatrix,
                vertexArray: vertexArray,
                shaderProgram: program,
                uniformMap: uniformMap,
                renderState: renderState,
                framebuffer: fbo,
                pass: fbo == undefined ? Cesium.Pass.TRANSLUCENT : Cesium.Pass.OPAQUE,
                //pass: Cesium.Pass.OPAQUE,//不透明
                // pass: Cesium.Pass.TRANSLUCENT,//透明
                primitiveType: type
            });
        }
        else {
            console.warn("attributes 需要2个属性");
            return false;
        }
    }
    createCommandOfCompute(uniform, fs, outputTexture) {
        let uniformMap = uniform;
        return new Cesium.ComputeCommand({
            owner: this,
            fragmentShaderSource: new Cesium.ShaderSource({
                sources: [fs]
            }),
            uniformMap: uniformMap,
            outputTexture: outputTexture,
            persists: true
        });
    }


    //创建FBO从texture，深度缓冲是单独创建的（待查）
    createFramebufferFromTexture(context, Color) {
        let texture = this.createRenderingTextures(context);
        return new Cesium.Framebuffer({
            context: context,
            colorTextures: [Color],
            depthTexture: texture.Depth

        });
    }
    //创建FBO
    createFramebuffer(context) {
        let texture = this.createRenderingTextures(context);
        return new Cesium.Framebuffer({
            context: context,
            colorTextures: [texture.Color],
            depthTexture: texture.Depth
        });
    }
    //创建VAO
    createVAO(context, typedArray) {
        return Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(typedArray),
            context: context,
        });
    }
    //创建cesium 纹理
    createTexture(options, typedArray) {
        if (Cesium.defined(typedArray)) {
            // typed array needs to be passed as source option, this is required by Cesium.Texture
            var source = {};
            source.arrayBufferView = typedArray;
            options.source = source;
        }

        var texture = new Cesium.Texture(options);
        return texture;
    }
    //创建渲染纹理2个color 和 depth，为FBO
    createRenderingTextures(context) {
        const colorTextureOptions = {
            context: context,
            width: context.drawingBufferWidth,
            height: context.drawingBufferHeight,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
        };
        const depthTextureOptions = {
            context: context,
            width: context.drawingBufferWidth,
            height: context.drawingBufferHeight,
            pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT
        };

        return {
            Color: this.createTexture(colorTextureOptions),
            Depth: this.createTexture(depthTextureOptions),

        }
    }
    ///////////////////////////////////////////////////////////////
    // base function
    getIndexListOfCM() {
        return [this.setting.currentLevel, this.oneJSON.data.length];
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

    setCMType(cm = "cm", cm2 = "zbed") {
        this.setting.cmType = cm;
        this.setting.cm = cm2;
        this.setUpdateOfListCommands(true);
        // console.log("设置仿真类型为：", cm);
    }
    getCMType() {
        return {
            cmType: this.setting.cmType,
            cm: this.setting.cm,
        }
        // console.log("设置仿真类型为：", cm);
    }
    setPlayCircle(circle = 0) {
        this.setting.play.circle = circle;
    }
    getPlayCircle() {
        return this.setting.play.circle;
    }
    setPlayIntervalTime(s = 0.5) {
        this.setting.interval = s;
    }
    getPlayIntervalTime() {
        return this.setting.interval;
    }


    setEnableDEM(enable = true) {
        this.setting.z.dem = enable;
    }
    setEnableZbed(enable = true) {
        this.setting.z.zbed_up = enable;
    }
    setEnableBaseZ(enable = true) {
        this.setting.z.base_z_enable = enable;
    }

    setBaseZ(z = 0) {
        this.setting.z.base_z = z;
    }
    setRateZbed(rate = 1) {
        this.setting.z.RateZbed = rate;
    }
    setRateDEM(rate = 1) {
        this.setting.z.RateDEM = rate;
    }

    getBaseZ() {
        if (this.setting.z.base_z_enable === true)
            return this.setting.z.base_z;
        else
            return 0;
    }
    getRateZbed() {
        if (this.setting.z.zbed_up === true)
            return this.setting.z.RateZbed;
        else
            return 1;
    }
    getRateDEM() {
        if (this.setting.z.base_z_enable === true) {
            return this.setting.z.RateDEM;
        }
        else
            return 0;
    }


    setWMCounts(value = 4096) {
        this.setting.wind.counts = value;
    }
    setWMFadeOpacity(value = 0.996) {
        this.setting.wind.fadeOpacity = value;
    }
    setWMSpeedFactor(value = 0.25) {
        this.setting.wind.fadeOpacity = value;
    }
    setWMDropRate(value = 0.003) {
        this.setting.wind.dropRate = value;
    }
    setWMDropRateBump(value = 0.01) {
        this.setting.wind.dropRateBump = value;
    }

    setWMDefaultRampColors(value) {
        this.setting.wind.defaultRampColors = value;
    }
    setFilterZbedGlobal(g = true) {
        this.oneJSON.dataContent.zbed.global_MM = g;
    }
    setFilterUVGlobal(g = true) {
        this.oneJSON.dataContent.U.global_MM = g;
        this.oneJSON.dataContent.V.global_MM = g;
    }
    ////////////////////////////////
    // 1= 数值
    // 2=百分比
    setFilterZbedfilterKind(g = 1) {
        this.oneJSON.dataContent.zbed.filterKind = g;
    }
    setFilterUVfilterKind(g = 1) {
        this.oneJSON.dataContent.U.filterKind = g;
        this.oneJSON.dataContent.V.filterKind = g;
    }
    //end
    setEnableFilterZbed(g = 1) {
        this.oneJSON.dataContent.zbed.filter = g;
    }
    setEnableFilterUV(g = 1) {
        this.oneJSON.dataContent.U.filter = g;
        this.oneJSON.dataContent.V.filter = g;
    }
    setFilterZbedfilterValue(g = []) {
        this.oneJSON.dataContent.zbed.filterValue = g;
    }
    setFilterUVfilterValue(g = []) {
        this.oneJSON.dataContent.U.filterValue = g;
        this.oneJSON.dataContent.V.filterValue = g;
    }


    play(s = 0.0, fn) {
        this.stop();
        if (s == 0.0)
            s = this.getPlayIntervalTime();
        else {
            this.setPlayIntervalTime(s);
        }
        this.setting.play.circleCounts = 0;
        if (this.timer.timer === false) {

            let that = this;
            let timerIndexList = [];
            for (let i in this.CMs[0].data) {
                timerIndexList.push(i);
            }
            that.timer.timerIndex = this.getCurrentLevelByIndex();
            this.timer.timer = setInterval(function () {
                // that.updateCM(that.timer.timerIndex);
                that.setCurrentLevelByIndex(that.timer.timerIndex);
                if (typeof fun == "function") {
                    fun(that.getCurrentLevelByIndex(), that);
                }
                if (that.timer.timerIndex >= timerIndexList.length - 1) {
                    that.timer.timerIndex = 0;
                    let counts = that.getPlayCircle();
                    if (counts !== 0 && counts == that.setting.play.circleCounts) {
                        that.stop();
                        that.setting.play.circleCounts = 0;
                        return;
                    }
                    that.setting.play.circleCounts++;
                }
                else {
                    that.timer.timerIndex++;
                }

            }, s * 1000);

        }
    }
    stop() {
        clearInterval(this.timer.timer);
        this.timer.timer = false;
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
    setWMPointSize(size = 2) {
        size = parseInt(size);
        this.setting.wind.pointSize = size;
    }
    getWMPointSize() {
        return this.setting.wind.pointSize;
    }
    setWMUV_and_or(and = true) {
        this.setting.wind.UV_and_or = and;
    }
    getWMUV_and_or() {
        return this.setting.wind.UV_and_or;
    }

}

export { CNWCM };