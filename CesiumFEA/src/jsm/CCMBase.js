import * as Cesium from "cesium";
class CCMBase {
    //     timer= {
    //         timer: false,
    //         timerIndex: 0,//for timer ++
    //         currentLevel: 0,
    //         play: {
    //             /** 循环次数，0=一直循环 */
    //             circle: 0,
    //             /** 间隔秒数，建议：0.5 */
    //             interval: 0.5,
    //             /** 已经循环的次数， */
    //             circleCounts: 0,
    //         }
    //     };
    //     /** setting  */
    //     setting = {
    //         z: {
    //             /** 是否使用 dem，默认：true */
    //             dem: true,

    //             /** 是否使用zbed 填平zbed面 */
    //             zbed_up: true,//old is zbed_up

    //             /** 基础高度，默认：0 */
    //             base_z: 0,

    //             /**是否使用基础高度 */
    //             base_z_enable: true,

    //             /** zbed 放大倍率，default：1  */
    //             RateZbed: 1,

    //             /** dem放大倍率，default：1 */
    //             RateDEM: 1,
    //         },
    //         wind: {
    //             /**  how fast the particle trails fade on each frame */
    //             fadeOpacity: 0.996,

    //             /** how fast the particles move */
    //             speedFactor: 0.25,

    //             /**  how often the particles move to a random place */
    //             dropRate: 0.003,

    //             /** drop rate increase relative to individual particle spe */
    //             dropRateBump: 0.01,

    //             /** 速度色表 */
    //             defaultRampColors: {
    //                 0.0: '#3288bd',
    //                 0.1: '#66c2a5',
    //                 0.2: '#abdda4',
    //                 0.3: '#e6f598',
    //                 0.4: '#fee08b',
    //                 0.5: '#fdae61',
    //                 0.6: '#f46d43',
    //                 1.0: '#d53e4f'
    //             },

    //             /** 点数量 */
    //             counts: 4096,// 4096,

    //             /** 点的尺寸，WEBGL中的尺寸 */
    //             pointSize: 1,

    //             /**
    //              * UV的 过滤条件，
    //              * ture ：是否同时过滤UV=0，即 U和V都为0，是过滤
    //              * false，只有UV一个为0，即过滤掉
    //              *  */
    //             UV_and_or: true,//and ==  true ,or =false
    //         },
    //         cmType: "cm",//"w2",//cm,cmBLue,wind
    //         cmTarget: "zbed",//"zbed",
    //         visible: true,
    //     }

    //     /** 是否完成了init */
    //     initFinish = false

    //     /** shader 使用的iTime */
    //     iTime = 0.0

    //     /**
    //  *  CMs是几个对象，默认为1个，数组内容如下：
    //  *      {
    //             index: [],
    //             tp: [],
    //             uv: [],
    //         }
    //  */
    //     CMs = [];

    //     /**
    //  * cesium 的frameState
    //  */
    //     frameState;

    //     /** 
    //      * 此class 的返回的cesium的类别
    //      * 
    //      *   */
    //     listCommands = []

    //     /** 是否更新cesium 的command ，默认为：true*/
    //     updateOfListCommands = true


    //     /**传入的参数 */
    //     oneJSON = {}
    //     resizeFlag = false;
    //     visible = true;
    //     _modelMatrix = []
    //     DS = [];

    /**
 * 构造函数
 * @param modelMatrix 坐标矩阵
 * @param oneJSON 传入的初始化参数
 * @param setting 传入的设置
 */
    constructor(modelMatrix, oneJSON, setting = false) {
        this.inputSetting = setting;
        this.timer = {
            timer: false,
            timerIndex: 0,//for timer ++
            currentLevel: 0,
            play: {
                /** 循环次数，0=一直循环 */
                circle: 0,
                /** 间隔秒数，建议：0.5 */
                interval: 0.5,
                /** 已经循环的次数， */
                circleCounts: 0,
            }
        };
        this.RofBoundingSphere = 0.1;
        if (typeof setting.RofBoundingSphere != "undefined") {
            this.RofBoundingSphere = setting.RofBoundingSphere;
        }
        /** setting  */
        this.setting = {
            z: {
                /** 是否使用 dem，默认：true */
                dem: false,

                /** 是否使用zbed 填平zbed面 */
                zbed_up: false,//old is zbed_up

                /** 基础高度，默认：0 */
                base_z: 0,

                /**是否使用基础高度 */
                base_z_enable: false,

                /** zbed 放大倍率，default：1  */
                RateZbed: 1,

                /** dem放大倍率，default：1 */
                RateDEM: 1,
            },
            wind: {
                /**  how fast the particle trails fade on each frame */
                fadeOpacity: 0.996,

                /** how fast the particles move */
                speedFactor: 0.25,

                /**  how often the particles move to a random place */
                dropRate: 0.003,

                /** drop rate increase relative to individual particle spe */
                dropRateBump: 0.01,

                /** 速度色表 */
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

                /** 点数量 */
                counts: 4096,// 4096,

                /** 点的尺寸，WEBGL中的尺寸 */
                pointSize: 1,
                /** uv max and min scale */
                scaleOfUV: 1,
                /** filter uv =0 */
                filterUVofZeroOfGB: false,

                /**
                 * UV的 过滤条件，
                 * ture ：是否同时过滤UV=0，即 U和V都为0，是过滤
                 * false，只有UV一个为0，即过滤掉
                 *  */
                UV_and_or: true,//and ==  true ,or =false
            },
            cmType: "cm",//"w2",//cm,cmBLue,wind
            cmTarget: "zbed",//"zbed",
            visible: true,
            framlines: false,
        }
        for (let i in setting) {
            if (typeof setting[i] == "object" && typeof this.setting[i] != "undefined") {

                for (let j in setting[i]) {
                    this.setting[i][j] = setting[i][j];
                }
            }
            else
                this.setting[i] = setting[i];
        }
        /** 是否完成了init */
        this.initFinish = false

        /** shader 使用的iTime */
        this.iTime = 0.0
        this.timestamp = new Date().getTime();
        /**
     *  CMs是几个对象，默认为1个，数组内容如下：
     *      {
                index: [],
                tp: [],
                uv: [],
            }
     */
        this.CMs = [];

        /**
     * cesium 的frameState
     */
        this.frameState;

        /** 
         * 此class 的返回的cesium的类别
         * 
         *   */
        this.listCommands = []

        /** 是否更新cesium 的command ，默认为：true*/
        this.updateOfListCommands = true


        /**传入的参数 */
        this.oneJSON = {}
        this.resizeFlag = false;
        this.visible = true;
        this._modelMatrix = []
        this.DS = [];

        this.oneJSON = oneJSON;
        this._modelMatrix = modelMatrix
        this._modelMatrix_inverse = Cesium.Matrix4.inverse(this._modelMatrix, new Cesium.Matrix4());
        // if (setting) {
        //     for (let i in setting) {
        //         let perOne = setting[i];
        //         // if (Object.keys(perOne).length > 1)
        //         if (typeof perOne === "object")
        //             for (let j in perOne) {
        //                 this.setting[i][j] = setting[i][j];
        //             }
        //     }
        //     // if (typeof setting.z != "undefined") {
        //     //     for (let i in setting.z) {
        //     //         this.setting.z[i] = setting.z[i];
        //     //     }
        //     // }
        //     // if (typeof setting.wind != "undefined") {
        //     //     for (let i in setting.wind) {
        //     //         this.setting.wind[i] = setting.wind[i];
        //     //     }
        //     // }
        //     // if (typeof setting.cmType != "undefined") {
        //     //     this.setting.cmType = setting.cmType;
        //     // }
        // }


        this.onReSzie();
        this.initFinish = this.init();
    }
    init() {
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
        // window.addEventListener("resize", function (event) {
        //     scope.resize(event, scope);
        // });
    }
    resize() {

    }
    /**
     * 需要覆写的，每个不同
     * @param {*} level 
     */
    updateCM(level) {

    }
    play(s = 0.5, fn) {
        this.stop();
        if (s == 0.0)
            s = this.getPlayIntervalTime();
        else {
            this.setPlayIntervalTime(s);
        }
        //复位已经播放次数
        this.timer.play.circleCounts = 0;
        //timer 没有初始化
        if (this.timer.timer === false) {

            let that = this;
            let timerIndexList = [];
            //帧数
            for (let i in this.oneJSON.data) {
                timerIndexList.push(i);
            }

            that.timer.timerIndex = this.getCurrentLevelByIndex();//当前开始的帧数
            this.timer.timer = setInterval(function () {
                that.updateCM(that.timer.timerIndex);

                if (typeof fn == "function") {
                    fn(that.getCurrentLevelByIndex(), that);
                }
                //到最后帧
                if (that.timer.timerIndex >= timerIndexList.length - 1) {
                    that.timer.timerIndex = 0;
                    let counts = that.getPlayCircle();
                    //播放几次
                    if (counts !== 0 && counts == that.timer.play.circleCounts) {
                        that.stop();
                        that.timer.play.circleCounts = 0;
                        return;
                    }
                    that.timer.play.circleCounts++;
                }
                else {
                    that.timer.timerIndex++;
                }
                that.setCurrentLevelByIndex(that.timer.timerIndex);

            }, s * 1000);

        }
    }
    stop() {
        clearInterval(this.timer.timer);
        this.timer.timer = false;
    }
    /** 获取当前的层级（index，从0开始），时间帧 */
    getCurrentLevelByIndex() {
        return this.timer.currentLevel;
    }
    /** 设置时间帧 
     * 从0开始
    */
    setCurrentLevelByIndex(lll = 0) {
        this.timer.currentLevel = lll;
        this.updateCM(lll);
    }
    /**
     * 设置云图
     * @param {*} cm  类型
     * @param {*} cm2  目标
     */
    setCMType(cm = "cm", cm2 = "zbed") {
        this.setting.cmType = cm;
        this.setting.cm = cm2;
        this.setUpdateOfListCommands(true);
        // console.log("设置仿真类型为：", cm);
    }
    /**
     * 返回当前云图的设置
     * @returns {cmType:string,cm:string}
     */
    getCMType() {
        return {
            cmType: this.setting.cmType,
            cm: this.setting.cm,
        }
        // console.log("设置仿真类型为：", cm);
    }
    /**
     *  设置play的循环次数
     * @param {*} circle ,默认=0，无限循环
     */
    setPlayCircle(circle = 0) {
        this.timer.play.circle = circle;
    }
    /**
     * 返回play的循环次数
     * @returns :number
     */
    getPlayCircle() {
        return this.timer.play.circle;
    }
    /**
     * 设置播放间隔
     * @param {*} s 秒数：默认0.5
     */
    setPlayIntervalTime(s = 0.5) {
        this.timer.play.interval = s;
    }
    /**
     * 返回播放间隔
     * @returns 秒数，间隔
     */
    getPlayIntervalTime() {
        return this.timer.play.interval;
    }
    /**
     * 更新数据源
     * @param {*} oneJSON 
     */
    updateSource(oneJSON) {
        this.visible = false;

        this.init(oneJSON);
        this.setUpdateOfListCommands(true);

        // this.updateCM(level, name)
    }
    /////////////////////////////////////////////////////////////////////////////////////
    // update 相关

    /**
     * 获取此类中的对象（webGL属性数据）
     * @returns []，CM对象的数组，默认一个
     */
    getWorldBoxObject() {
        return this.CMs;
    }
    /**
     * 新建/更新 commands（集合），update调用此函数
     * @param {*} frameState 
     * @param {*} modelMatrix 
     * @returns 
     */
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
     * 新建/更新每个mesh的command（单个）
     * @param {*} frameState 
     * @param {*} peroneJSON 每个mesh的JSON
     * @param {*} modelMatrix 
     * @returns 
     */
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

        // nc.push(this.createCommandOfCMMesh(frameState, modelMatrix, attributes, peroneJSON.cmType));




        return nc;

    }
    /**
     * 核心入口，cesium规范
    * @param {FrameState} frameState
    */
    update(frameState) {
        if (typeof this._pickId == "undefined") {
            this._pickId = frameState.context.createPickId({
                primitive: this,
                id: "ccm_" + new Date(),
            });
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
    /**
     * 全屏的矩形/单个矩形;
     * 
     * 
     *1、 点位如下：
     *    3 4
     *    1 2
     * 
     * 
     * 2、返回属性
     * 
     * @returns attributes 属性{position:[],uv:[]}
     */
    getFullscreenAtt() {
        //3  4
        //1  2
        let attributes = {
            position: [
                -1, -1, 0, // 1
                1, -1, 0, // 2
                1, 1, 0, // 4

                -1, -1, 0, // 1
                1, 1, 0,//4
                -1, 1, 0, //3 
            ],
            uv: [
                0, 0,
                1, 0,
                1, 1,

                0, 1,
                1, 1,
                0, 1,
            ],


        };
        return attributes;
    }


    ///////////////////////////////////////////////////
    // cesium ext.
    /**
     * 创建纹理
     * @param {*} context 
     * @returns 
     */
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

    createCommandOfChannel(frameState, modelMatrix, attributes, uniform, material, type = Cesium.PrimitiveType.TRIANGLES, Channal = [], fbo = undefined, alpha = false) {
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
                    // viewport: undefined,
                    cull: {
                        enabled: false,
                    },
                    depthTest: {
                        enabled: false,
                        // func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                        func: Cesium.DepthFunction.LESS,

                    },
                    // depthMask: true,
                    // blending: {
                    //     enabled: true,
                    //     color: {
                    //         red: 0.0,
                    //         green: 0.0,
                    //         blue: 0.0,
                    //         alpha: 0.0
                    //     },
                    //     // equationRgb: Cesium.BlendEquation.ADD,
                    //     // equationAlpha: Cesium.BlendEquation.ADD,
                    //     functionSourceRgb: Cesium.BlendFunction.ONE,
                    //     // functionSourceAlpha: Cesium.BlendFunction.ONE,
                    //     // functionDestinationRgb: Cesium.BlendFunction.ZERO,
                    //     functionDestinationAlpha: Cesium.BlendFunction.ZERO
                    // }
                });
                // renderState = Cesium.RenderState.fromCache(this.rawRenderState);
            }
            // console.log(renderState.get);
            // var renderState = Cesium.RenderState.fromCache(this.rawRenderState);

            let pass = Cesium.Pass.OPAQUE;
            if (alpha === true) {
                pass = Cesium.Pass.TRANSLUCENT;
            }
            else {
                pass = Cesium.Pass.OPAQUE;
            }

            let coordinate = new Cesium.Cartesian3();
            if (typeof this.setting.coordinate != "undefined") {
                coordinate=   Cesium.Cartesian3.fromDegrees(this.setting.coordinate[0], this.setting.coordinate[1], this.setting.coordinate[2]);
            }
            return new Cesium.DrawCommand({
                // boundingVolume: new Cesium.BoundingSphere(),
                // boundingVolume: new Cesium.BoundingSphere(coordinate, 0),
                modelMatrix: modelMatrix,
                vertexArray: vertexArray,
                shaderProgram: program,
                uniformMap: uniformMap,
                renderState: renderState,
                framebuffer: fbo,
                pass: pass,
                // pass: fbo == undefined ? Cesium.Pass.TRANSLUCENT : Cesium.Pass.OPAQUE,//old,可以工作
                // pass: fbo == "undefined" || fbo == undefined ? Cesium.Pass.OPAQUE : Cesium.Pass.TRANSLUCENT,//wind map error ，颜色不对了
                // pass: Cesium.Pass.OPAQUE,//不透明
                // pass: Cesium.Pass.TRANSLUCENT,//透明
                primitiveType: type
            });
        }
        else {
            console.warn("attributes 需要2个属性");
            return false;
        }
    }
    /**
     * 计算shader
     * @param {*} uniform : {}  ,uniform 参数
     * @param {*} fs :fs的字符串
     * @param {*} outputTexture :通过this.createTexture 创建的纹理
     * @returns 
     */
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


    /**
     * 创建FBO从texture，深度缓冲是单独创建的（待查）
     * @param {*} context 
     * @param {*} Color  已有的纹理
     * @returns 
     */
    createFramebufferFromTexture(context, Color) {
        let texture = this.createRenderingTextures(context);
        return new Cesium.Framebuffer({
            context: context,
            colorTextures: [Color],
            depthTexture: texture.Depth

        });
    }

    /**
     * 创建FBO，空的FBO
     * @param {*} context 
     * @returns 
     */
    createFramebuffer(context) {
        let texture = this.createRenderingTextures(context);
        return new Cesium.Framebuffer({
            context: context,
            colorTextures: [texture.Color],
            depthTexture: texture.Depth
        });
    }

    /**
     * 创建VAO
     * @param {*} context 
     * @param {*} typedArray 
     * @returns 
     */
    createVAO(context, typedArray) {
        return Cesium.Buffer.createVertexBuffer({
            usage: Cesium.BufferUsage.STATIC_DRAW,
            typedArray: new Float32Array(typedArray),
            context: context,
        });
    }

    /**
     * 创建cesium 纹理
     * 
     * 
     * @param {*} options ：例子
     * 
     * const colorTextureOptions = {
     *       context: context,
     *       width: particleRes,
     *       height: particleRes,
     *       pixelFormat: Cesium.PixelFormat.RGBA,
     *       pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE            ,
     *       sampler: new Cesium.Sampler({
     *           // the values of texture will not be interpolated
     *           minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
     *           magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
     *       })
     *   };
     * 
     * 
     * @param {*} typedArray : 例子 const particleState = new Uint8Array(particleRes * particleRes * 4);//1024*4,RGBA
     * @returns 
     */
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

    /**
     * 创建渲染纹理2个color 和 depth，为创建FBO使用
     * @param {*} context 
     * @returns {Color: {},Depth: {},}
     */
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
}
export { CCMBase }