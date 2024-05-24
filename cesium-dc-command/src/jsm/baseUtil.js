
/**
 * 异步加载文件
 * @param {string} filePath 
 * @returns 
 */
export function loadText(filePath) {
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
export function getFullscreenQuad() {
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
export function createTexture(options, typedArray) {
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
 * @param {*} samplerFlag     ：暂缺
 * @param {*} repeat ：是否repeat
 */
export async function createTextureFromUrl(context, url, samplerFlag = false, repeat = true) {

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
			)
		}
	})
	console.log("createTextureFromUrl")
	return texture;
}
/**
 * 加载纹理 NEAREST
 * @param {*} context :any,cesium 上下文
 * @param {*} url   ：image
 */
export async function createTextureNearestFromUrl(context, url) {

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
	console.log("createTextureFromUrl")
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
export function createFramebuffer(context, colorTexture, depthTexture) {
	var framebuffer = new Cesium.Framebuffer({
		context: context,
		colorTextures: [colorTexture],
		depthTexture: depthTexture
	});
	return framebuffer;
}

/**
 * 创建默认的FBO
 * @param {*} context cesium 的gl内容对象
 * @param {*} w width
 * @param {*} h height
 * @returns 
 */
export function createFramebufferDefault(context, w = false, h = false) {
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
export function createRenderingTextures(context, w = false, h = false) {
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
};
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
export function createRawRenderState(options) {
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
export function viewRectangleToLonLatRange(viewRectangle) {
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
	}

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
	}

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
