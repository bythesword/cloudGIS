//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CustomCommand


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
/**
 * 0=不需要
 * 1=未初始化
 * 2=初始化中
 * 3=完成初始化
 */
export enum initStatue {
    donotNeed = 0,
    noStrat = 1,
    doing = 2,
    finish = 3,

}

export declare type Status = {
    /**是否显示 */
    show: boolean,
    /** 初始化状态 */
    initStatus: number,
    /**前置准备工作是否完成 */
    ready: number,
}

/**
 * CustomPrimitive 的 option 类型
 */
export declare type CCoptions = {
    /**
     * 类的名称，debug区别那个类用，无特殊用途
     */
    name?: string
    /**画或计算 */
    commandType: "Draw" | "Compute"

    /** modelMatrix ,经纬度的转换矩阵（局部->全局）*/
    modelMatrix?: any
    /**
     * CustomPrimitive 的 option 类型 的attributes 类型 attribute 类型定义
     * 
     * 例子：
     *         "position": {
     * 
                index: 0,//必须
    
                componentsPerAttribute: 3,//每个点的数据位数
    
                vertexBuffer: [ //数组
    
                    -100, -100, 0, // 1
    
                    100, -100, 0, // 2
    
                    100, 100, 0, // 4
    
                    -100, -100, 0, // 1
    
                    100, 100, 0,//4
    
                    -100, 100, 0, //3 
    
                ],//normal array
    
                componentDatatype: Cesium.ComponentDatatype.FLOAT，//一般都是float
                
            }
     */
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

    /**webGL 的uniform 
     * 
     * exp：
     * 
     * uniformMap: {
        u_channel0: () => { return CMAA; },
    },
    */
    uniformMap?: any

    /** VS */
    vertexShaderSource?: string

    /**FS */
    fragmentShaderSource: string

    /**
     * Draw 模式的状态
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
     * 
     * true：自动建立FBO，并输出到FBO
     * 
     * 其他command 通过  oneCommand1.getFBO() 获得this command的FBO
     */
    framebuffer?: boolean

    /**
     * 计算Command必须有。
     * 通过Util.createTexture()创建
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
     * 判断前置的其他command是否已经执行完成；
     * 
     *  1、是否进行update的command输出，
     * 
     *  2、使用匿名函数，返回本shader需要的前置shader的 initStatue
     * 
     *  3、例子：
     * 
     *   ready: () => {
     *      return oneCommand1.initStatue;
     *   },
     */
    ready?: any,

    /**
     * 预初始化执行
     * 
     * 1、在update 之前的初始化工作，在update执行时执行，做准备工作
     * 
     * 2、如果是URL的image，需要await 。在本身类的执行是异步方式。
     * 
     * 例子：1
     * 
     * 
     *   preInit: (scope) => {
     * 
            //grayNoise64x64.png

            console.log("pre init")

            //pebbles.png

            }

     * 例子：2

        preInit: async (scope) => {

                //png

                scope.DS_textures[0]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/grayNoise64x64.png");
                
                scope.DS_textures[1]= await Util.createTextureFromUrl(scope.frameState.context,"/noise/pebbles.png");

            }
     */
    preInit?: any,
    /**
     * uniformMap的纹理对应名称，
     * 名称=GLSLuniform 中的名称
     * 对应的数字是preInit中的scope.DS_textures[0]数组中的下表
     * textures: {
        iChannel0: "0",
        iChannel1: "1",
    },
     */
    textures?: any,

    /**
     * 
     * pass ：渲染通道，Cesium 提供的常用渲染通道（封装在Cesium.Pass）有
                ENVIRONMENT：环境，如天空盒（星空背景）
                COMPUTE ：用于并行加速计算
                GLOBE ：地形瓦片等
                TERRAIN_CLASSIFICATION ：地形分类
                CESIUM_3D_TILE ：3D Tiles 瓦片
                CESIUM_3D_TILE_CLASSIFICATION ：3D Tiles 分类（单体化）
                OPAQUE ：不透明物体
                TRANSLUCENT ：半透明物体

        默认： Cesium.Pass.OPAQUE               
     */
    pass:any,

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

    /**Cesium 提供的常用渲染通道,默认： Cesium.Pass.OPAQUE  */
    pass:any

    /**cesium frameState */
    frameState: any

    /**
     * this.ready = options.ready || undefined;
     */
    ready: any
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
    getShow(): boolean
    /**
     * 
     * 设置执行shader状态
     * @param enable 
     */
    show(enable: boolean): void
    /**
     * 返回shader状态
     */
    getStatus(): Status

    /**
     * 类的前置工作是否已经完成
     * 
     * 1、无前置工作，返回true，可以工作
     * 
     * 2、执行option输入参数的ready,自行判断
     * 
     *  exp：
     * 
     *     ready: () => {
              return oneCommand1.initStatue == initFinished ? true : false;
            },
     */
    getReady(): boolean | any

    /**
     * 类的状态，返回一个Status
     *  
     */
    getStatus(): Status
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
export declare async function createTexture(options: any, typedArray: any): any

/**
 * 加载纹理 NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 */
export async function createTextureNearestFromUrl(context: any, url: string): any

/**
 * 加载纹理 非NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 * @param {*} samplerFlag     ：暂缺
 * @param {*} repeat ：是否repeat
 */
export async function createTextureFromUrl(context, url, samplerFlag = false, repeat = true): any

/**
 * 创建FBO，空的FBO。并自定义color和depth纹理并作为输入
 * @param {*} context 
 * @param {Util.createTexture()} colorTexture 
 * @param {Util.createTexture()} depthTexture 
 * @returns framebuffer
 */
export declare function createFramebuffer(context: any, colorTexture: any, depthTexture: any): any


/**
 * 创建默认的FBO
 * @param {*} context cesium 的gl内容对象
 * @param {*} w width
 * @param {*} h height
 * @returns 
 */
export function createFramebufferDefault(context: any, w = false, h = false): any

/**
 * 创建渲染纹理2个color 和 depth，为创建FBO使用
 * @param {*} context 
 * @returns {Color: {},Depth: {},}
 */
export function createRenderingTextures(context: any, w = false, h = false): any


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




