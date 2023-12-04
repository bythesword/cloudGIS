import { Matrix4, defaultValue, ClearCommand, Color, Pass, ComputeCommand, Buffer, BufferUsage, VertexArray, ShaderProgram, RenderState, DrawCommand, defined, destroyObject } from 'cesium';

/**
 * 异步加载文件
 * @param {string} filePath 
 * @returns 
 */
function loadText(filePath) {
	var request = new XMLHttpRequest();
	request.open('GET', filePath, false);
	request.send();
	return request.responseText;
}

/**
 * 获取一个正方形gl属性
 * @returns {position:Cesium.GeometryAttribute,st:Cesium.GeometryAttribute}
 * 
 * 
 */
function getFullscreenQuad() {
	var fullscreenQuad = new Cesium.Geometry({
		attributes: new Cesium.GeometryAttributes({
			position: new Cesium.GeometryAttribute({
				componentDatatype: Cesium.ComponentDatatype.FLOAT,
				componentsPerAttribute: 3,
				//  v3----v2
				//  |     |
				//  |     |
				//  v0----v1
				values: new Float32Array([
					-1, -1, 0, // v0
					1, -1, 0, // v1
					1, 1, 0, // v2
					-1, 1, 0, // v3
				])
			}),
			st: new Cesium.GeometryAttribute({
				componentDatatype: Cesium.ComponentDatatype.FLOAT,
				componentsPerAttribute: 2,
				values: new Float32Array([
					0, 0,
					1, 0,
					1, 1,
					0, 1,
				])
			})
		}),
		indices: new Uint32Array([3, 2, 0, 0, 2, 1])
	});
	return fullscreenQuad;
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
function createTexture(options, typedArray) {
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
 * 加载纹理 非NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 * @param {*} index     ：number ,第几帧数据
 * @param {*} first ：是否为第一次加载，默认：false（不是）
 */
async function createTextureFromUrl(context, url, samplerFlag = false, repeat = true) {

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

				// textureWrap :Cesium.TextureWrap.REPEAT//bad
				sampler: new Cesium.Sampler({
					
					// minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
					// magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
					wrapS: wrap,
					wrapT: wrap,
				})
			})
			);
		};
	});
	console.log("createTextureFromUrl");
	return texture;
}
/**
 * 加载纹理 NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 * @param {*} index     ：number ,第几帧数据
 * @param {*} first ：是否为第一次加载，默认：false（不是）
 */
async function createTextureNearestFromUrl(context, url) {

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
			);
		};
	});
	console.log("createTextureFromUrl");
	return texture;
}

//这个的问题，是texture 不是指针，无法想C或GLSL的in一样
// export async function createTextureFromUrlIN(context, url,texture) {
// 	let img = new Image();
// 	img.src = url;
// 	await new Promise(resolve => {
// 		img.onload = function () {
// 			resolve(
// 				// console.log("createTextureFromUrlIN")
// 				texture = new Cesium.Texture({
// 				context: context,
// 				width: img.width,
// 				height: img.height,
// 				pixelFormat: Cesium.PixelFormat.RGBA,
// 				pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
// 				source: img,
// 				sampler: new Cesium.Sampler({
// 					minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
// 					magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST
// 				})
// 			})
// 			)
// 		}
// 	})
// }


/**
 * 创建FBO，空的FBO
 * @param {*} context 
 * @param {Util.createTexture()} colorTexture 
 * @param {Util.createTexture()} depthTexture 
 * @returns framebuffer
 */
function createFramebuffer(context, colorTexture, depthTexture) {
	var framebuffer = new Cesium.Framebuffer({
		context: context,
		colorTextures: [colorTexture],
		depthTexture: depthTexture
	});
	return framebuffer;
}

/**
 * 创建FBO，空的FBO
 * @param {*} context 
 * @returns 
 */
function createFramebufferDefault(context, w = false, h = false) {
	let texture = createRenderingTextures(context, w, h);
	return new Cesium.Framebuffer({
		context: context,
		colorTextures: [texture.Color],
		depthTexture: texture.Depth
	});
}
/**
 * 创建渲染纹理2个color 和 depth，为创建FBO使用
 * @param {*} context 
 * @returns {Color: {},Depth: {},}
 */
function createRenderingTextures(context, w = false, h = false) {
	const colorTextureOptions = {
		context: context,
		width: w ? w : context.drawingBufferWidth,
		height: h ? h : context.drawingBufferHeight,
		pixelFormat: Cesium.PixelFormat.RGBA,
		pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE
	};
	const depthTextureOptions = {
		context: context,
		width: w ? w : context.drawingBufferWidth,
		height: h ? h : context.drawingBufferHeight,
		pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
		pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT
	};
	// console.log(context.drawingBufferWidth, w, w ? w : context.drawingBufferHeight)
	return {
		Color: createTexture(colorTextureOptions),
		Depth: createTexture(depthTextureOptions),

	}
}/**
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
function createRawRenderState(options) {
	var translucent = true;
	var closed = false;
	var existing = {
		viewport: options.viewport,
		depthTest: options.depthTest,
		depthMask: options.depthMask,
		blending: options.blending
	};

	var rawRenderState = Cesium.Appearance.getDefaultRenderState(translucent, closed, existing);
	return rawRenderState;
}


/**
 * viewRectangleToLonLatRange
 * @param {*} viewRectangle 
 * @returns 
 */
function viewRectangleToLonLatRange(viewRectangle) {
	var range = {};

	var postiveWest = Cesium.Math.mod(viewRectangle.west, Cesium.Math.TWO_PI);
	var postiveEast = Cesium.Math.mod(viewRectangle.east, Cesium.Math.TWO_PI);
	var width = viewRectangle.width;

	var longitudeMin;
	var longitudeMax;
	if (width > Cesium.Math.THREE_PI_OVER_TWO) {
		longitudeMin = 0.0;
		longitudeMax = Cesium.Math.TWO_PI;
	} else {
		if (postiveEast - postiveWest < width) {
			longitudeMin = postiveWest;
			longitudeMax = postiveWest + width;
		} else {
			longitudeMin = postiveWest;
			longitudeMax = postiveEast;
		}
	}

	range.lon = {
		min: Cesium.Math.toDegrees(longitudeMin),
		max: Cesium.Math.toDegrees(longitudeMax)
	};

	var south = viewRectangle.south;
	var north = viewRectangle.north;
	var height = viewRectangle.height;

	var extendHeight = height > Cesium.Math.PI / 12 ? height / 2 : 0;
	var extendedSouth = Cesium.Math.clampToLatitudeRange(south - extendHeight);
	var extendedNorth = Cesium.Math.clampToLatitudeRange(north + extendHeight);

	// extend the bound in high latitude area to make sure it can cover all the visible area
	if (extendedSouth < -Cesium.Math.PI_OVER_THREE) {
		extendedSouth = -Cesium.Math.PI_OVER_TWO;
	}
	if (extendedNorth > Cesium.Math.PI_OVER_THREE) {
		extendedNorth = Cesium.Math.PI_OVER_TWO;
	}

	range.lat = {
		min: Cesium.Math.toDegrees(extendedSouth),
		max: Cesium.Math.toDegrees(extendedNorth)
	};

	return range;
}

// return {
// 	loadText: loadText,
// 	getFullscreenQuad: getFullscreenQuad,
// 	createTexture: createTexture,
// 	createFramebuffer: createFramebuffer,
// 	createRawRenderState: createRawRenderState,
// 	viewRectangleToLonLatRange: viewRectangleToLonLatRange
// };

class CustomPrimitive {
    /**
     * 
     * @param any options 
     */
    constructor(options) {
        this.name = options.name;
        this.input = options;
        this.ready = options.ready || undefined;
        if (typeof options.modelMatrix !== "undefined")
            this.modelMatrix = options.modelMatrix;
        else
            this.modelMatrix = Matrix4.IDENTITY;
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

        this.autoClear = defaultValue(options.autoClear, false);
        this.preExecute = options.preExecute;

        this.enable = true;
        this.iTime = 0.0;
        this.timestamp = new Date().getTime();

        this.commandToExecute = undefined;//创建的command
        this.clearCommand = undefined;

        this.DS_textures = {};//纹理集合
        this.DS = {};//数据集合存放地
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
        this.preInit =  options.preInit;


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
            this.clearCommand = new ClearCommand({
                color: new Color(0.0, 0.0, 0.0, 0.0),
                depth: 1.0,
                framebuffer: this.framebuffer,
                pass: Pass.OPAQUE
            });
        }
    }
    async init(context) {
        this.initStatue = 2;//doing flag
        if (this.FBO_Status == 1) {
            this.onReSzie();
            this.FBO_Status = 2;    //fbo doing flag
            this.framebuffer = await createFramebufferDefault(context);
            this.framebuffer1 = createFramebufferDefault(context);
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
        this.initStatue = 2;
        this.FBO_Status = 2;    //fbo doing flag
        await this.framebuffer1.destroy();
        this.framebuffer1 = await createFramebufferDefault(context);
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
                    newOne.vertexBuffer = Buffer.createVertexBuffer({
                        usage: BufferUsage.STATIC_DRAW,
                        typedArray: new Float32Array(perOne.vertexBuffer),
                        context: context,
                    });
                    attributeLocations[i] = newOne.index;
                    a_att.push(newOne);
                }

                const vertexArray = new VertexArray({
                    context: context,
                    attributes: a_att
                });

                this.attributeLocations = attributeLocations;
                //end change


                var shaderProgram = ShaderProgram.fromCache({
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
                    // console.log(iTime);
                    return iTime;

                };
                if (this.uniformMap !== undefined) ;

                if (this.input.textures !== undefined) {
                    for (let i in this.input.textures) {
                        this.uniformMap[i] = () => { return this.DS_textures[this.input.textures[i]] };
                    }
                }
                var renderState = RenderState.fromCache(this.rawRenderState);
                return new DrawCommand({
                    owner: this,
                    vertexArray: vertexArray,
                    primitiveType: this.primitiveType,
                    uniformMap: this.uniformMap,
                    modelMatrix: this.modelMatrix,
                    shaderProgram: shaderProgram,
                    framebuffer: this.framebuffer,
                    renderState: renderState,
                    pass: Pass.OPAQUE
                });
            }
            case 'Compute': {
                return new ComputeCommand({
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
        var vertexArray = VertexArray.fromGeometry({
            context: context,
            geometry: this.geometry,
            attributeLocations: this.attributeLocations,
            bufferUsage: BufferUsage.STATIC_DRAW,
        });
        this.commandToExecute.vertexArray = vertexArray;
    }


    update(frameState) {
        this.frameState = frameState;
        if (!this.show()) {
            return;
        }

        if (this.getReady()) {
            if (this.initStatue == 3 || this.initStatue == 0) {
                if (!defined(this.commandToExecute)) {
                    this.commandToExecute = this.createCommand(frameState.context);
                }

                if (defined(this.preExecute)) {
                    this.preExecute();
                }

                if (defined(this.clearCommand)) {
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
        return false;
    }

    destroy() {
        if (defined(this.commandToExecute)) {
            this.commandToExecute.shaderProgram = this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy();
        }
        return destroyObject(this);
    }
    setEnable(enable = true) {
        this.enable = enable;
    }
    show() {
        return this.enable;
    }
    getReady() {
        if (typeof this.ready == "undefined" || this.ready == undefined || this.ready == 0) {
            return true;
        }
        else {
            return this.input.ready();
        }
    }
    getStatus() {
        return {
            show: this.show(),
            initStatue: this.initStatue,
            ready: this.getReady(),
        }
    }
}

export { CustomPrimitive, createFramebuffer, createFramebufferDefault, createRawRenderState, createRenderingTextures, createTexture, createTextureFromUrl, createTextureNearestFromUrl, getFullscreenQuad, loadText, viewRectangleToLonLatRange };
