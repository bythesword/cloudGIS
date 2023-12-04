//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CustomCommand

/**
 * CustomPrimitive 的 option 类型 的attributes 类型 attribute 类型定义
 * 
 * 例子：
 *         "position": {
 * 
            index: 0,

            componentsPerAttribute: 3,

            vertexBuffer: [

                -100, -100, 0, // 1

                100, -100, 0, // 2

                100, 100, 0, // 4

                -100, -100, 0, // 1

                100, 100, 0,//4

                -100, 100, 0, //3 

            ],//normal array

            componentDatatype: Cesium.ComponentDatatype.FLOAT
            
        }
 */
export declare type CCoptionsAttributePerOne = {
    /** 从0开始 */
    index: number,
    /** 数据有几位组成一个点的数据，比如，1，2(uv)，3（xyz)等 */
    componentsPerAttribute: number,
    /** attribute的数组 */
    vertexBuffer: number[],
    /**数据类型，比如 Cesium.ComponentDatatype.FLOAT */
    componentDatatype: any
}

/**
 * CustomPrimitive 的 option 类型 的attributes 的类型定义
 */
export declare type CCoptionsAttributes = {
    /**
     * 索引签名，只能是字符串，名称建议采用 gl的attribute的规范
     */
    [n in string]: CCoptionsAttributePerOne
}


export declare type Status = {
    show: boolean,
    initStatus: number,
    ready: number,
}

/**
 * CustomPrimitive 的 option 类型
 */
export declare type CCoptions = {
    /**
     * 类的名称，debug区别那个类用，无特殊用途
     */
    name?:string
    /**画或计算 */
    commandType: "Draw" | "Compute"

    /** modelMatrix */
    modelMatrix?: any
    attributes: any // 对象{} ，add by tom attributes from  input ,postion ,uv ,normal ,cm ....
    /**作废 */
    geometry?: any
    /**作废 */
    attributeLocations?: CCoptionsAttributes[]
    /**
     * 必须
     * Cesium.PrimitiveType.TRIANGLES | Cesium.PrimitiveType.LINES | Cesium.PrimitiveType.POINTS
     */
    primitiveType: any

    /**webGL 的uniform */
    uniformMap?: any

    /** VS */
    vertexShaderSource?: string

    /**FS */
    fragmentShaderSource: string

    /**
     * Draw 模式必须
     * Util.createRawRenderState({
                    // undefined value means let Cesium deal with it
                    viewport: undefined,
                    depthTest: {
                        enabled: true
                    },
                    depthMask: true
                }


       Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: true,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true
                }                

       Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false
                    },
                    depthMask: true,
                    blending: {
                        enabled: true
                    }
                }       
     */
    rawRenderState?: any


    /**
     * FBO ,是否输出到FBO，自动创建FBO（大小等屏幕）
     * 
     * boolean
     * 
     * 默认为 false
     */
    framebuffer?: boolean

    /**
     * 计算必须：
     * Util.createTexture()
     */
    outputTexture?: any

    /***  是否自动清屏，默认false*/
    autoClear?: boolean

    /**
     * update之前执行的内容
     *  function () {
                    // swap framebuffers before binding
                    var temp;
                    temp = that.framebuffers.currentTrails;
                    that.framebuffers.currentTrails = that.framebuffers.nextTrails;
                    that.framebuffers.nextTrails = temp;

                    // keep the framebuffers up to date
                    that.primitives.trails.commandToExecute.framebuffer = that.framebuffers.nextTrails;
                    that.primitives.trails.clearCommand.framebuffer = that.framebuffers.nextTrails;
                }
     */
    preExecute?: any,

    /**
     * 是否进行update的command输出，
     * 使用匿名函数，返回本shader需要的前置shader的 initStatue
     * 例子：
     *   ready: () => {
     *      return oneCommand1.initStatue;
     *   },
     */
    ready?: any,

    /**
     *  在update 之前的初始化工作，在update执行时执行，做准备工作
     * 
     * 
     * 例子：
     * 
     * 
     *   preInit: (scope) => {
            //grayNoise64x64.png

            console.log("pre init")
            //pebbles.png


            }
     */
    preInit?: any,

}

export declare class CustomPrimitive {
    /**unifomr 的 iTime  */
    iTime: number

    /** shader 使用的纹理集合 */
    DS_textures: any

    /** data source 集合，预留备用，可以存放数据 */
    DS: any

    /**是否显示
     * 默认：true
     */
    enable: boolean


    /**cesium frameState */
    frameState: any


    /**
     * 
     * @param any options 
     */
    constructor(options: CCoptions)

    /**
     * 更新方法，自动执行
     * viewer.scene.primitives.add(xxx);
     * @param frameState 
     */
    update(frameState: any): any
    /**
     * 
     * 是否执行shader状态
     * @param enable 
     */
    show(): boolean

    /**
     * 返回shader状态
     */
    getStatus(): Status

    /**
     * 是否可以工作
     * 
     * 1、返回true，可以工作
     * 
     * 2、执行option输入参数的ready,自行判断
     * 
     *  exp：
     * 
     *     ready: () => {
              return oneCommand1.initStatue == initFinished ? true : false;
            },
     */
    getReady():boolean|any
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//util declare

/**
 * 异步加载文件
 * @param {string} filePath 
 * @returns 
 */
export declare function loadText(filePath: string): string

/**
 * 获取一个正方形gl属性
 * @returns {position:Cesium.GeometryAttribute,st:Cesium.GeometryAttribute}
 */
export declare function getFullscreenQuad(): any

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
export declare function createTexture(options: any, typedArray: any): any

/**
 * 加载纹理 NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 * @param {*} index     ：number ,第几帧数据
 * @param {*} first ：是否为第一次加载，默认：false（不是）
 */
export async function createTextureNearestFromUrl(context, url):any

/**
 * 加载纹理 非NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 * @param {*} index     ：number ,第几帧数据
 * @param {*} first ：是否为第一次加载，默认：false（不是）
 */
export async function createTextureFromUrl(context, url, samplerFlag = false, repeat = true) :any

/**
 * 创建FBO，空的FBO
 * @param {*} context 
 * @param {Util.createTexture()} colorTexture 
 * @param {Util.createTexture()} depthTexture 
 * @returns framebuffer
 */
export declare function createFramebuffer(context: any, colorTexture: any, depthTexture: any): any


/**
 * 创建FBO，空的FBO
 * @param {*} context 
 * @returns 
 */
export function createFramebufferDefault(context, w = false, h = false):any

/**
 * 创建渲染纹理2个color 和 depth，为创建FBO使用
 * @param {*} context 
 * @returns {Color: {},Depth: {},}
 */
export function createRenderingTextures(context, w = false, h = false):any


/**
 * 创建 Cesium.Appearance.getDefaultRenderState
 * @param {*} options 
 
 * 
  exp1:
  
  rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false
                    },
                    depthMask: true,
                    blending: {
                        enabled: true
                    }
                }),
 
	
    exp2:

    rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: true,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true
                }),


    exp3:
	
    rawRenderState: Util.createRawRenderState({
                    // undefined value means let Cesium deal with it
                    viewport: undefined,
                    depthTest: {
                        enabled: true
                    },
                    depthMask: true
                }),
* @returns Cesium.Appearance.getDefaultRenderState
	
 */
export declare function createRawRenderState(options: any): any

/**
 * viewRectangleToLonLatRange
 * @param {*} viewRectangle 
 * @returns 
 */
export declare function viewRectangleToLonLatRange(viewRectangle: any): any






// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // cesium ext from cesiumFEA

// /**
//  * 创建纹理 从图像
//  * @param {*} context
//  * @param  Image: new (width?: number | undefined, height?: number | undefined) => HTMLImageElement img new Image()
//  * @returns
//  */
// export declare function createTextureFromImage(context: any, img: any): any

// /**
//  * 创建渲染通道
//  * @param {*} frameState
//  * @param  any\[] modelMatrix
//  * @param {*} attributes
//  * @param {*} uniform
//  * @param \{vertexShader: string, fragmentShader: sting } material
//  * @param {*} type
//  * @param  any\[] Channal
//  * @param  \any | undefined  fbo
//  * @returns Cesium.DrawCommand
//  */

// export declare function createCommandOfChannel(
//     frameState: any,
//     modelMatrix: any[],
//     attributes: any,
//     uniform: any,
//     material: { vertexShader: string, fragmentShader: sting },
//     type: any,
//     Channal = any[],
//     fbo: any | undefined): any


// /**
//  * 计算shader
//  * @param any uniform : {}  ,uniform 参数
//  * @param string fs :fs的字符串
//  * @param any outputTexture :通过this.createTexture 创建的纹理
//  * @returns
//  */
// export declare function createCommandOfCompute(uniform: any, fs: string, outputTexture: any): any



// /**
//  * 创建FBO从texture，深度缓冲是单独创建的（待查）
//  * @param any context
//  * @param any  Color  已有的纹理
//  * @returns
//  */
// export declare function createFramebufferFromTexture(context: any, Color: any): any

// /**
//  * 创建FBO，空的FBO
//  * @param any context
//  * @returns any
//  */
// export declare function createFramebuffer(context: any): any


// /**
//  * 创建VAO
//  * @param any context
//  * @param \ number[] typedArray
//  * @returns
//  */
// export function createVAO(context: any, typedArray: number[]): any


// /**
//  * 创建cesium 纹理,从数据
//  *
//  *
//  * @param {*} options ：例子
//  *
//  * const colorTextureOptions = {
//  *       context: context,
//  *       width: particleRes,
//  *       height: particleRes,
//  *       pixelFormat: Cesium.PixelFormat.RGBA,
//  *       pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE            ,
//  *       sampler: new Cesium.Sampler({
//  *           // the values of texture will not be interpolated
//  *           minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
//  *           magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
//  *       })
//  *   };
//  *
//  *
//  * @param Uint8Array typedArray : 例子 const particleState = new Uint8Array(particleRes * particleRes * 4);//1024*4,RGBA
//  *
//  *
//  * @returns Cesium.Texture
//  */
// export function createTexture(options: any, typedArray: any): any



// /**
//  * 创建渲染纹理2个color 和 depth，为创建FBO使用
//  * @param {*} context
//  * @returns {Color: {},Depth: {},}
//  */
// export function createRenderingTextures(context: any): any