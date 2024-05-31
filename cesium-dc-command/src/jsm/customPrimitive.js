import * as Util from "./baseUtil"
import *  as Cesium from "cesium";
export var initFinished = 3;
export class CustomPrimitive {
    /**
     * 
     * @param any options 
     */
    constructor(options) {
        this.reConstructor(options)
    }
    reConstructor(options) {
        this.name = options.name;
        this.input = options;
        this.ready = options.ready || undefined;
        this.reNew = options.reNew || undefined;
        if (typeof options.modelMatrix !== "undefined")
            this.modelMatrix = options.modelMatrix;
        else
            this.modelMatrix = Cesium.Matrix4.IDENTITY;
        this.commandType = options.commandType;


        this.attributes = options.attributes;//add by tom attributes from  input ,postion ,uv ,normal ,cm ....
        this.geometry = options.geometry;
        this.attributeLocations = options.attributeLocations;
        this.primitiveType = options.primitiveType;

        this.uniformMap = options.uniformMap;

        this.vertexShaderSource = options.vertexShaderSource;
        this.fragmentShaderSource = options.fragmentShaderSource;

        this.rawRenderState = options.rawRenderState;
        this.framebuffer = options.framebuffer;

        this.outputTexture = options.outputTexture;

        this.autoClear = Cesium.defaultValue(options.autoClear, false);
        this.preExecute = options.preExecute;

        this.enable = true;
        this.iTime = 0.0
        this.timestamp = new Date().getTime();

        this.commandToExecute = undefined;//创建的command
        this.clearCommand = undefined;

        this.DS_textures = {};//纹理集合
        this.DS = {};//数据集合存放地
        this.pass = false;
        if (!Cesium.defined(options.pass)) {
            this.pass = options.pass;
        }
        ///////////////////////////////////////////////////////////////////
        // about init

        /**
         * 0=不需要
         * 1=未初始化
         * 2=初始化中
         * 3=完成初始化
         */
        this.FBO_Status = 0;
        if (typeof options.framebuffer != "undefined" && options.framebuffer === true) {
            // this.framebuffer = {};
            this.FBO_Status = 1;
        }

        /** 预加载 */
        this.preInit = undefined || options.preInit;


        /** 
         * 0=不需要 initial
         * 1=需要，未进行
         * 2=进行中 
         * 3=finish
         */
        this.initStatue = 0;


        if (this.preInit != undefined || this.FBO_Status == 1) {
            this.initStatue = 1;
        }

        // end about init
        /////////////////////////////////////////////
        if (this.autoClear) {
            this.clearCommand = new Cesium.ClearCommand({
                color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
                depth: 1.0,
                framebuffer: this.framebuffer,
                pass: Cesium.Pass.OPAQUE
            });
        }
    }
    async init(context) {
        this.initStatue = 2;//doing flag
        if (this.FBO_Status == 1) {
            this.onReSzie();
            this.FBO_Status = 2;    //fbo doing flag
            this.framebuffer = await Util.createFramebufferDefault(context);
            this.framebuffer1 = Util.createFramebufferDefault(context);
            this.FBO_Status = 3;
        }
        if (this.preInit)
            await this.preInit(this);

        this.initStatue = 3;
    }
    getFBO() {
        if (this.framebuffer)
            return this.framebuffer.getColorTexture(0);

    }

    async reInitFBO(context) {
        // console.log("reinit", context.drawingBufferWidth);
        this.initStatue = 2
        this.FBO_Status = 2;    //fbo doing flag
        await this.framebuffer1.destroy();
        this.framebuffer1 = await Util.createFramebufferDefault(context);
        let temp = this.framebuffer;
        this.framebuffer = this.framebuffer1;
        this.framebuffer1 = temp;
        this.commandToExecute = undefined;
        this.FBO_Status = 3;
        this.initStatue = 3;
        // console.log("reinit", context.drawingBufferWidth);
    }
    onReSzie() {
        let scope = this;
        window.addEventListener("resize", async function (event) {
            // console.log("on size start", scope.frameState.context.drawingBufferWidth);
            await scope.reInitFBO(scope.frameState.context);
            // console.log("on size end", scope.frameState.context.drawingBufferWidth);
        });
    }


    createCommand(context) {
        switch (this.commandType) {
            case 'Draw': {
                // change  by tom


                // var vertexArray = Cesium.VertexArray.fromGeometry({
                //     context: context,
                //     geometry: this.geometry,
                //     attributeLocations: this.attributeLocations,
                //     bufferUsage: Cesium.BufferUsage.STATIC_DRAW,
                // });


                let a_att = [];//GL a attribute [esium.Buffer.createVertexBuffer(),esium.Buffer.createVertexBuffer()]
                let attributeLocations = {};//index of name of attributes

                for (let i in this.attributes) {
                    let perOne = this.attributes[i];
                    let newOne = JSON.parse(JSON.stringify(perOne));
                    newOne.vertexBuffer = Cesium.Buffer.createVertexBuffer({
                        usage: Cesium.BufferUsage.STATIC_DRAW,
                        typedArray: new Float32Array(perOne.vertexBuffer),
                        context: context,
                    });
                    attributeLocations[i] = newOne.index;
                    a_att.push(newOne);
                }

                const vertexArray = new Cesium.VertexArray({
                    context: context,
                    attributes: a_att
                });

                this.attributeLocations = attributeLocations;
                //end change


                var shaderProgram = Cesium.ShaderProgram.fromCache({
                    context: context,
                    attributeLocations: this.attributeLocations,
                    vertexShaderSource: this.vertexShaderSource,
                    fragmentShaderSource: this.fragmentShaderSource,
                    // vertexShaderSource: new Cesium.ShaderSource({
                    //     defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    //     sources: this.vertexShaderSource,
                    // }),
                    // fragmentShaderSource: new Cesium.ShaderSource({
                    //     defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    //     sources: this.fragmentShaderSource,
                    // })
                });
                this.uniformMap['iTime'] = () => {
                    // this.iTime += 0.0051; return this.iTime
                    let iTime = (new Date().getTime() - this.timestamp) / 1000.0;
                    console.log(iTime);
                    return iTime;

                };
                if (this.uniformMap !== undefined) {


                    // if (this.uniformMap.textures !== undefined) {
                    //     for (let i in this.uniformMap.textures) {
                    //         this.uniformMap[i] = () => { return this.DS_textures[this.uniformMap.textures[i]] };
                    //     }
                    // }
                }
                else {

                }

                if (this.input.textures !== undefined) {
                    for (let i in this.input.textures) {
                        this.uniformMap[i] = () => { return this.DS_textures[this.input.textures[i]] };
                    }
                }
                var renderState = Cesium.RenderState.fromCache(this.rawRenderState);
                return new Cesium.DrawCommand({
                    owner: this,
                    vertexArray: vertexArray,
                    primitiveType: this.primitiveType,
                    uniformMap: this.uniformMap,
                    modelMatrix: this.modelMatrix,
                    shaderProgram: shaderProgram,
                    framebuffer: this.framebuffer,
                    renderState: renderState,
                    pass: this.pass || Cesium.Pass.OPAQUE,

                });
            }
            case 'Compute': {
                return new Cesium.ComputeCommand({
                    owner: this,
                    fragmentShaderSource: this.fragmentShaderSource,
                    uniformMap: this.uniformMap,
                    outputTexture: this.outputTexture,
                    persists: true
                });
            }
        }
    }

    setGeometry(context, geometry) {
        this.geometry = geometry;
        var vertexArray = Cesium.VertexArray.fromGeometry({
            context: context,
            geometry: this.geometry,
            attributeLocations: this.attributeLocations,
            bufferUsage: Cesium.BufferUsage.STATIC_DRAW,
        });
        this.commandToExecute.vertexArray = vertexArray;
    }


    update(frameState) {
        this.frameState = frameState;
        if (!this.getShow()) {
            return;
        }
        if (this.getReNew()) {
            this.commandToExecute = null;
        }
        if (this.getReady()) {
            if (this.initStatue == 3 || this.initStatue == 0) {
                if (!Cesium.defined(this.commandToExecute)) {
                    this.commandToExecute = this.createCommand(frameState.context);
                }

                if (Cesium.defined(this.preExecute)) {
                    this.preExecute(this);
                }

                if (Cesium.defined(this.clearCommand)) {
                    frameState.commandList.push(this.clearCommand);
                }
                frameState.commandList.push(this.commandToExecute);
            }
            else {
                if (this.initStatue == 1) {
                    this.initStatue = 2;
                    this.init(frameState.context);
                }
                // frameState.commandList.push([]);
            }
        }
    }

    isDestroyed() {
        if (typeof this.flageDestroy != "undefined" && this.flageDestroy === true) return true;
        else return false;
    }

    destroy() {
        if (Cesium.defined(this.commandToExecute)) {
            this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy();
        }
        this.flageDestroy = true;
        return Cesium.destroyObject(this);
    }
    setEnable(enable = true) {
        this.enable = enable;
    }
    getShow() {
        return this.enable;
    }
    show(enable = true) {
        this.enable = enable;
    }
    getReNew() {
        if (typeof this.reNew == "undefined" || this.reNew == undefined) {

            return false;
        }
        else {
            return this.input.reNew(this);
        }
    }
    getReady() {
        if (typeof this.ready == "undefined" || this.ready == undefined || this.ready == 0) {
            return true;
        }
        else {
            return this.input.ready(this);
        }
    }
    getStatus() {
        return {
            show: this.getShow(),
            initStatue: this.initStatue,
            ready: this.getReady(),
        }
    }
}
