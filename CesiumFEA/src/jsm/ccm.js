
import * as Cesium from "cesium";
import { material } from "./material";
// import { WindGL } from "../jsm/wm/wind"
///////////////////////////////////////////////////////////////////////////////////
import weaveVS from './shaders/water/weave.vs.glsl?raw';
import weaveFS from './shaders/water/weave.fs.glsl?raw';

class CCM {
    constructor(modelMatrix, oneJSON, channel = false) {

        // this.image = new Image();
        // this.image.src = '/public/leaves.jpg';

        this.channel = channel;
        this.oneJSON = oneJSON;
        this._modelMatrix = modelMatrix
        this.visible = true;
        // this.input = input;
        // this.origin = Cesium.Cartesian3.fromDegrees(input.coordinate[0], input.coordinate[1], input.coordinate[2]);
        // this._modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(this.origin);

        this.CMs = [];
        this.setting = {
            modelMatrix: [],
            initFinish: false,
        };
        this.timer = {
            visible: false,
            timer: false,
            timerIndex: 0,//for timer ++
        };
        //this.createTextures();
        this.iTime = 0.0;
        this.material = new material();
        this.listCommands = [];
        this.updateOfListCommands = true;
        this.cmType=oneJSON.cmType
        this.init(oneJSON);
        // if (fun) {
        //     fun(window.mainGL);
        // }

    }
    initWind() {
        // window.wind = new WindGL(window.mainGL);
    }
    updateSource(oneJSON,level = 0, name = 0) {
        this.CMs=[];
        this.CMs.push(oneJSON);
        this.updateCM(level , name ) 
    }
    init(oneJSON) {
        // let tfl = new TFL();
        this.CMs.push(oneJSON);
        if (this.CMs.length > 0)
            this.setting.initFinish = true;
    }

    getCMList() {
        return {
            "name list:": this.CMs[0].cmName,
            "name Num list:": "0..." + (this.CMs[0].data.length - 1),
            "CM type is :": this.CMs[0].cmType,
            "current CM is :": this.CMs[0].cmIndex,
        }
    }
    play(s = 0.1, fn) {
        this.stop();
        if (this.timer.timer === false) {

            let that = this;
            let timerIndexList = [];
            for (let i in this.CMs[0].data) {
                timerIndexList.push(i);
            }
            that.timer.timerIndex = this.getCurrentLevelByIndex();
            this.timer.timer = setInterval(function () {


                that.updateCM(that.timer.timerIndex);

                if (typeof fun == "function") {
                    fun(that.setting.currentCMLevel, that);
                }

                if (that.timer.timerIndex >= timerIndexList.length - 1) {
                    that.timer.timerIndex = 0;
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

    getCurrentLevelByIndex() {
        return this.CMs[0].cmIndex[0];
    }

    updateCM(level = 0, name = 0) {
        if (typeof level == "number" && level <= this.CMs[0].data.length - 1)
            this.CMs[0].cmIndex[0] = level;
        else {
            console.error("name is index of 'name Num list ,start from 0' ")
        }
        if (typeof name == "number")
            this.CMs[0].cmIndex[1] = name;
        else {
            console.error("name is index of 'name list' ")
        }
        this.setUpdateOfListCommands(true);
    }
    setUpdateOfListCommands(flag = true) {
        this.updateOfListCommands = flag;
    }

    getWorldBoxObject() {
        return this.CMs;
    }

    getTFL(frameState, peroneJSON, modelMatrix) {
        let list = [];
        let attributes = {};

        attributes = {
            position: peroneJSON.position,
            uv: peroneJSON.uv,
            cm: peroneJSON.data[peroneJSON.cmIndex[0]][peroneJSON.cmIndex[1]],
            indices: peroneJSON.indices,
        };
        let nc = [];

        nc.push(this.createCommandOfCMMesh(frameState, modelMatrix, attributes, peroneJSON.cmType));




        return nc;

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
        if(typeof this.frameState =="undefined")
         this.frameState=frameState;
        if (this.visible)
            if (this.setting.initFinish)
                for (let perOne of this.getCommands(frameState, this._modelMatrix)) {
                    for (let perNC of perOne)
                        frameState.commandList.push(perNC);
                }
    }
    // update(frameState) {
    //     if (this.visible)
    //         if (this.setting.initFinish)
    //             for (let perOne of this.getCommands(frameState, this._modelMatrix)) {
    //                 if (perOne)
    //                     frameState.commandList.push(perOne);
    //             }
    // }

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
    updateChannel(image) {
        this.image.src = image;
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
    createCommandOfCMMesh(frameState, modelMatrix, attributes, cmType) {
        let material;
        let scope = this;
        if (cmType == "testShader") {
            material = this.material.testShader;
        }
        else if (cmType == "cm") {
            material = this.material.TriangleShaderFilter;
        }
        else if (cmType == "cmBlue") {
            material = this.material.TriangleShaderBlueFilter;
        }
        else if (cmType == "water") {
            material = this.material.shaderToyT1;
        }
        else if (cmType == "wind") {
            material = this.material.Channal0;
        }
        else if (cmType == "fire") {
            material = this.material.fire_Channal0;
        }
        else if (cmType == "weaves") {
            material = {
                vertexShader: weaveVS,
                fragmentShader: weaveFS,
            };
        }
        const attributeLocations = {
            "position": 0,
            // "color": 5,
            "uv": 1,
            "cm": 2
        };
        const uniformMap = {
            mm: () => {
                return { x: 1, y: 1 };
            },
            u_color: () => {
                return Cesium.Color.HONEYDEW;
            },
            u_max: () => {
                return this.oneJSON.dataContent[this.oneJSON.cmName[this.oneJSON.cmIndex[1]]].max;

            },
            u_min: () => {
                return this.oneJSON.dataContent[this.oneJSON.cmName[this.oneJSON.cmIndex[1]]].min;
            },
            u_filterV: () => {
                return this.oneJSON.dataContent[this.oneJSON.cmName[this.oneJSON.cmIndex[1]]].filterValue;
            },
            u_filterT: () => {
                return this.oneJSON.dataContent[this.oneJSON.cmName[this.oneJSON.cmIndex[1]]].filterKind;
            },//1=percent ,2=value
            u_filter: () => {
                return this.oneJSON.dataContent[this.oneJSON.cmName[this.oneJSON.cmIndex[1]]].filter;
            },
            iTime: () => { this.iTime += 0.0051; return this.iTime },
            u_channel0: () => {
                // if (this.channel) {
                //     return new Cesium.Texture({
                //         context: frameState.context,
                //         source: this.channel.getDataUrl()
                //     })
                // }
                // else
                if (scope.texture)
                    return scope.texture;
                else {
                    scope.createTextures(frameState.context);
                    return new Cesium.Texture({
                        context: frameState.context,
                        source: scope.image
                    });

                }

            }
        };


        const cmBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.cm),
            context: frameState.context,
        });
        const uvBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.uv),
            context: frameState.context,
        });
        // const colorBuffer = Cesium.Buffer.createVertexBuffer({
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     typedArray: new Float32Array(attributes.color),
        //     context: frameState.context,
        // });
        const positionBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.position),
            context: frameState.context,
        });
        // const indexBuffer = Cesium.Buffer.createIndexBuffer({
        //     context: frameState.context,
        //     typedArray: new Uint32Array(attributes.indices),
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     indexDatatype: Cesium.IndexDatatype.UNSIGNED_INT,
        // })

        const vertexArray = new Cesium.VertexArray({
            context: frameState.context,
            attributes: [{
                index: 0, // 等于 attributeLocations['position']
                vertexBuffer: positionBuffer,
                componentsPerAttribute: 3,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }
                ,
            {
                index: 1, // 等于 attributeLocations['position']
                vertexBuffer: uvBuffer,
                componentsPerAttribute: 2,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            },
            {
                index: 2, // 等于 attributeLocations['position']
                vertexBuffer: cmBuffer,
                componentsPerAttribute: 3,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }],
            // indexBuffer: indexBuffer
        });

        const program = Cesium.ShaderProgram.fromCache({
            context: frameState.context,
            vertexShaderSource: material.vertexShader,
            fragmentShaderSource: material.fragmentShader,
            attributeLocations: attributeLocations,
        });
        if (typeof window.mainGL == "undefined") {
            window.mainGL = program._gl;
        }
        const renderState = new Cesium.RenderState({
            depthTest: {
                enabled: true
            },
            // lineWidth: 1,
            // polygonOffset: {
            //     enabled: true,
            //     factor: 0.1,
            //     units: 2.5
            // },
        });

        // var program = new Cesium.Appearance({
        //     renderState: {
        //         blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,  //混合
        //         depthTest: { enabled: true }, //深度测试
        //         depthMask: true
        //     },
        //     fragmentShaderSource:  this.material.TriangleShader.fragmentShader,
        //     vertexShaderSource: this.material.TriangleShader.vertexShader
        // });

        return new Cesium.DrawCommand({
            modelMatrix: modelMatrix,
            vertexArray: vertexArray,
            shaderProgram: program,
            uniformMap: uniformMap,
            renderState: renderState,
            //pass: Cesium.Pass.OPAQUE,//不透明
            pass: Cesium.Pass.TRANSLUCENT,//透明
            primitiveType: Cesium.PrimitiveType.TRIANGLES
        });
    }

    createCommandOfLine(frameState, modelMatrix, attributes) {
        const attributeLocations = {
            "position": 0,
            // "color": 5,
            // "uv": 1,
            "cm": 2
        };
        const uniformMap = {
            u_color() {
                return Cesium.Color.HONEYDEW;
            },
        };


        const cmBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.cm),
            context: frameState.context,
        });
        // const uvBuffer = Cesium.Buffer.createVertexBuffer({
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     typedArray: new Float32Array(attributes.uv),
        //     context: frameState.context,
        // });
        // const colorBuffer = Cesium.Buffer.createVertexBuffer({
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     typedArray: new Float32Array(attributes.color),
        //     context: frameState.context,
        // });
        const positionBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.position),
            context: frameState.context,
        });

        let matrix = [];
        let M4 = new Matrix4();
        for (let mi of modelMatrix) {
            let M4t = new Matrix4();
            M4t.elements = mi;
            M4.multiply(M4t);
        }
        matrix = M4.elements;

        const vertexArray = new Cesium.VertexArray({
            context: frameState.context,
            attributes: [{
                index: 0, // 等于 attributeLocations['position']
                vertexBuffer: positionBuffer,
                componentsPerAttribute: 3,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }
                ,
            // {
            //     index: 1, // 等于 attributeLocations['position']
            //     vertexBuffer: uvBuffer,
            //     componentsPerAttribute: 2,
            //     componentDatatype: Cesium.ComponentDatatype.FLOAT
            // },
            {
                index: 2, // 等于 attributeLocations['position']
                vertexBuffer: cmBuffer,
                componentsPerAttribute: 2,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }]
        });
        const program = Cesium.ShaderProgram.fromCache({
            context: frameState.context,
            vertexShaderSource: this.material.LineShader.vertexShader,
            fragmentShaderSource: this.material.LineShader.fragmentShader,
            attributeLocations: attributeLocations,
        });
        const renderState = Cesium.RenderState.fromCache({
            depthTest: {
                enabled: true
            }
        });
        return new Cesium.DrawCommand({
            modelMatrix: matrix,
            vertexArray: vertexArray,
            shaderProgram: program,
            uniformMap: uniformMap,
            renderState: renderState,
            pass: Cesium.Pass.OPAQUE,
            primitiveType: Cesium.PrimitiveType.LINE_LOOP
        });
    }
    createCommandOfFrameLine(frameState, modelMatrix, attributes) {
        const attributeLocations = {
            "position": 0,
            "color": 5,
            // "uv": 1,
            // "cm": 2
        };
        const uniformMap = {
            u_color() {
                return Cesium.Color.HONEYDEW;
            },
        };


        // const cmBuffer = Cesium.Buffer.createVertexBuffer({
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     typedArray: new Float32Array(attributes.cm),
        //     context: frameState.context,
        // });
        // const uvBuffer = Cesium.Buffer.createVertexBuffer({
        //     usage: Cesium.BufferUsage.STATIC_DRAW,
        //     typedArray: new Float32Array(attributes.uv),
        //     context: frameState.context,
        // });
        const colorBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.color),
            context: frameState.context,
        });
        const positionBuffer = Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(attributes.position),
            context: frameState.context,
        });

        let matrix = [];
        let M4 = new Matrix4();
        for (let mi of modelMatrix) {
            let M4t = new Matrix4();
            M4t.elements = mi;
            M4.multiply(M4t);
        }
        matrix = M4.elements;

        const vertexArray = new Cesium.VertexArray({
            context: frameState.context,
            attributes: [{
                index: 0, // 等于 attributeLocations['position']
                vertexBuffer: positionBuffer,
                componentsPerAttribute: 3,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }
                ,
            // {
            //     index: 1, // 等于 attributeLocations['position']
            //     vertexBuffer: uvBuffer,
            //     componentsPerAttribute: 2,
            //     componentDatatype: Cesium.ComponentDatatype.FLOAT
            // },
            {
                index: 5, // 等于 attributeLocations['position']
                vertexBuffer: colorBuffer,
                componentsPerAttribute: 3,
                componentDatatype: Cesium.ComponentDatatype.FLOAT
            }]
        });
        const program = Cesium.ShaderProgram.fromCache({
            context: frameState.context,
            vertexShaderSource: this.material.FrameLine.vertexShader,
            fragmentShaderSource: this.material.FrameLine.fragmentShader,
            attributeLocations: attributeLocations,
        });
        const renderState = Cesium.RenderState.fromCache({
            depthTest: {
                enabled: true
            },
            // lineWidth: 1,
            polygonOffset: {
                enabled: true,
                factor: -0.1,
                units: -2.5
            },
        });
        return new Cesium.DrawCommand({
            modelMatrix: matrix,
            vertexArray: vertexArray,
            shaderProgram: program,
            uniformMap: uniformMap,
            renderState: renderState,
            pass: Cesium.Pass.OPAQUE,
            primitiveType: Cesium.PrimitiveType.LINES
        });
    }

}

export { CCM };