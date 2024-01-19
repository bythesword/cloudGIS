/** CM的类型 
 * 这个比较多，
 * 目前只采用:
 *  "wind":实现风场图，
 *  "cmWaterBlue6ABS1FS":云图与水波混合
 * 其他后期再具体写功能
*/
export enum CMType { "cm", "cmBlue", "wind", "arrow", "water1", "water2", "water3", "cmWaterBlue12", "cmWaterBlue6", "cmWater" ,"cmWaterBlue6ABS1FS"}
/**
 * 初始化输入的参数 CMSetting
 */
export declare type CMSetting = {
   /**关于Z的设置 */
   z: {
      /** 是否使用 dem，默认：false*/
      dem: boolean,

      /** 是否使用zbed 填平zbed面 ,默认：false*/
      zbed_up: boolean,//old is zbed_up

      /** 基础高度，默认：0 */
      base_z: number,

      /**是否使用基础高度,默认：false */
      base_z_enable: boolean,

      /** zbed 放大倍率，default：1  */
      RateZbed: number,

      /** dem放大倍率，default：1 */
      RateDEM: number,
   },
   /**非必须，风场使用 */
   wind?: {
      /**  how fast the particle trails fade on each frame */
      fadeOpacity: number //0.996,

      /** how fast the particles move */
      speedFactor: number //0.25,

      /**  how often the particles move to a random place */
      dropRate: number //0.003,

      /** drop rate increase relative to individual particle spe */
      dropRateBump: number // 0.01,

      /** 速度色表 */
      defaultRampColors: {
         0.0: string// '#3288bd',
         0.1: string//'#66c2a5',
         0.2: string//'#abdda4',
         0.3: string//'#e6f598',
         0.4: string//'#fee08b',
         0.5: string//'#fdae61',
         0.6: string// '#f46d43',
         1.0: string// '#d53e4f'
      },

      /** 点数量 */
      counts: number //4096,// 4096,

      /** 点的尺寸，WEBGL中的尺寸 */
      pointSize: number // 1,

      /** uv max and min scale,默认：1 */
      scaleOfUV: 1,
      /** filter uv =0,作废 */
      filterUVofZeroOfGB: false,

      /**
       * cesium 的viewer
       */
      viewer: any,
      /**
       * UV的 过滤条件，
       * ture ：是否同时过滤UV=0，即 U和V都为0，是过滤
       * false，只有UV一个为0，即过滤掉
       *  */
      UV_and_or: boolean,//true,//and ==  true ,or =false

      /**
       * 动态网格的超出屏幕的网格梳理，默认：10，
       * 建议采用默认值
       * 预计后期会作废，将采用更高效的动态裁剪
       */
      dynWindMapMM: {
         range: 10
      },

   },
   /**
    * cm water 参数
    */
   cmWater?: {
      speed: number,
      scale: number,
      opacity: number,
   },

   /** 
    * CM类型 
    * 参考 CMType
    */
   cmType: string// "cm",//"w2",//cm,cmBLue,wind

   /**
    * 作废20240111
    * 当cmType=cm|cmBlue时，target的对象，目前来看有zbed，u，v，uvM
    * u，v，uvM 这三个在GPU中，需要有时间实现，目前未实现
    */
   cmTarget: string//"zbed",//"zbed",
   visible: boolean// true,
}
/**
 * 播放相关参数
 */
export declare type CMTimer = {
   /**定时器 */
   timer: any | boolean// false,
   /** 播放了的整个循环测试*/
   timerIndex: number //0,//for timer ++
   currentLevel: number //0,
   play: {
      /** 循环次数，0=一直循环 */
      circle: number //0,
      /** 间隔秒数，建议：0.5 */
      interval: number //0.5,
      /** 已经循环的次数， */
      circleCounts: number //0,
   }
};
/**
 * 基础类 CCM
 * 实现了单个类的cesium的primitive的实现，其中包括全部流场update，texture等
 */
export declare class CCMBase {

   /**
    * 传入的setting和this.setting 的初始化定义
    */
   setting: CMSetting
   /**
    * 播放定时器相关设置
    */
   timer: CMTimer
   /**
    * 是否完成init的标志位
    */
   initFinish: boolean

   /** shader使用的iTime */
   iTime: number
   /**
   * 构造函数
   * @param modelMatrix 坐标矩阵
   * @param oneJSON 传入的初始化参数
   * @param setting 传入的设置
   */
   constructor(modelMatrix: any, oneJSON: {}, setting: {})

   /**
    * play
    * @param s 秒数
    * @param fn callback function
    */
   play(s: number, fn: any): void
   /** 停止播放 */
   stop(): void
   /** 获取当前的层级（index，从0开始），时间帧 */
   getCurrentLevelByIndex(): number
   /** 设置时间帧 */
   setCurrentLevelByIndex(l: number): void
   /**
    * 设置云图
    * @param {*} cm  类型
    * @param {*} cm2  目标
    */
   setCMType(cm: string, cm2: string): void
   /**
   * 返回当前云图的设置
   * @returns {cmType:string,cm:string}
   */
   getCMType(): { cm: string, cmType: string }
   /**
   *  设置play的循环测试 
   * @param {*} circle ,默认=0，无限循环
   */
   setPlayCircle(circle: number): void

   /**
    * 返回play的循环次数
    * @returns :number
    */
   getPlayCircle(): number

   /**
    * 设置播放间隔
    * @param {*} s 秒数：默认0.5
    */
   setPlayIntervalTime(s: number): void

   /**
   * 返回播放间隔
   * @returns 秒数，间隔
   */
   getPlayIntervalTime(): number

   /**
 * 更新数据源
 * @param {*} oneJSON ：{}
 */
   updateSource(oneJSON: {}): void
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
   getFullscreenAtt(): any

}


/**
 * 从CCMBase扩展而来
 * CCMSNW针对有序网进行定制
 */
export declare class CCMSNW extends CCMBase {
   /**
* 设置更新command，数据变更
* @param {*} flag :boolean ,default=true
*/
   setUpdateOfListCommands(flag: boolean): void

   /**
* 加载数据源
* @param {*} context :any,cesium 上下文
* @param {*} url   ：image
* @param {*} index     ：number ,第几帧数据
* @param {*} first ：是否为第一次加载，默认：false（不是）
*/
   loadDataSource(context: any, url: string, index: number, first: boolean): void

   /**
* 初始化数据源
* @param {*} context cesium 上下文
*/
   initData(context: any): void

   /**
    * 二维网格的cols
    * @returns :number
    */
   getCols(): number
   /**
    * 二维网格的rows
    * @returns :number
    */
   getRows(): number
   /**
       * 返回帧数及当前帧的index
       * @returns [index,total]
       */
   getIndexListOfCM(): any[]

   /**
    * 设置是否使用DEM
    * @param {*} enable :boolen ,default=true
    */
   setEnableDEM(enable: boolean): void

   /**
   * 设置是否使用zbed
   * @param {*} enable :boolen ,default=true
   */
   setEnableZbed(enable): void
   /**
    * 设置是否使用基础高度
    * @param {*} enable :boolen ,default=true
    */
   setEnableBaseZ(enable: boolean): void
   /**
    * 设置是基础高度
    * @param {*} enable :number ,default=0
    */
   setBaseZ(z: number): void

   /**
    * 设置是zbed的倍率，
    * @param {*} enable :number ,default=1
    */
   setRateZbed(rate: number): void
   /**
    * 设置是dem的倍率
    * @param {*} enable :number ,default=1
    */
   setRateDEM(rate: number): void

   /**
* 获取当前设置的基础高度
* @returns 基础高度，默认为0
*/
   getBaseZ(): number
   /**
* 获取当前设置的zbed的倍率
* @returns 基础高度，默认为1
*/
   getRateZbed(): number

   /**
 * 获取当前设置的dem的倍率
 * @returns 基础高度，默认为1
 */
   getRateDEM(): number
   /**
* 风场粒子数量
* @param {*} value :number ,默认：4096 
*/
   setWMCounts(value: number): void
   /**
    * 设置粒子衰减率
    * @param {*} value :number ,default 0.996
    */
   setWMFadeOpacity(value: number): void

   /**
        * 设置速度因子
        * @param {*} value :number ,default 0.25
        */
   setWMSpeedFactor(value: number): void


   /**
    * 设置掉落倍率
    * @param {*} value :number ,default 0.003
    */
   setWMDropRate(value: number): void

   /**
    * 掉落随机率
    * @param {*} value :number ,default 0.01
    */
   setWMDropRateBump(value: number): void

   /**
    * 设置速度色表
    * @param {*} value :{}
    */
   setWMDefaultRampColors(value: {}): void

   /**
        * 设置zbed是否使用全局过滤
        * @param {*} g :boolean,default true
        */
   setFilterZbedGlobal(g: boolean): void

   /**
    * 设置VU是否使用全局过滤
    * @param {*} g :boolean,default true
    */
   setFilterUVGlobal(g: boolean): void

   /**
    * 设置zbed的过滤种类
    * 
    * @param {number } g ,default 1，
    * 
    * 1= 数值
    * 
    * 2=百分比
    */
   setFilterZbedfilterKind(g: number): void


   /**
* 设置zbed是否应用过滤
* @param {*} g :boolean ,default true
*/
   setEnableFilterZbed(g: boolean): void


   /**
* 设置UV是否使用过滤
* @param boolean g ,default true
*/
   setEnableFilterUV(g: boolean): void

   /**
    * 设置zbed的过滤范围，因种类不同而不同
    * @param number[] g 
    */
   setFilterZbedfilterValue(g: number[]): void
   /**
    * 设置风场粒子大小（像素）
    * @param number size ,default 1
    */
   setWMPointSize(size: number): void

   /**
* 获取风场粒子大小（尺寸）
* @returns number,粒子尺寸
*/
   getWMPointSize(): number

   /**
* 设置UV过滤的 逻辑：and /or
* @param boolean and 
* 
* default true (and) 
* 
* fale(or)
*/
   setWMUV_and_or(and): void


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
   getWMUV_and_or(): boolean



}


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
//    frameState: any,
//    modelMatrix: any[],
//    attributes: any,
//    uniform: any,
//    material: { vertexShader: string, fragmentShader: string },
//    type: any,
//    Channal: any[],
//    fbo: any | undefined): any


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