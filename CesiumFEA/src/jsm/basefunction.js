import *  as Cesium from "cesium"
///////////////////////////////////////////////////
// cesium ext.


/**
 * 创建纹理
 * @param {*} context 
 * @param  Image: new (width?: number | undefined, height?: number | undefined) => HTMLImageElement img new Image()
 * @returns 
 */
export function createTextures(context, img) {

    // let image = new Image()
    // image.src = img
    // image.onload = () => {
    return  new Cesium.Texture({
        context: context,
        source: img
    });
    // }
    // if (scope.channel !== false)
    //     return new Cesium.Texture({
    //         context: frameState.context,
    //         source: scope.channel.getDataUrl()
    //     })
};

/**
 * 创建渲染通道
 * @param {*} frameState 
 * @param  any\[] modelMatrix 
 * @param {*} attributes 
 * @param {*} uniform 
 * @param \{vertexShader: string, fragmentShader: sting } material 
 * @param {*} type 
 * @param  any\[] Channal 
 * @param  \any | undefined  fbo 
 * @returns Cesium.DrawCommand
 */
export function createCommandOfChannel(frameState, modelMatrix, attributes, uniform, material, type = Cesium.PrimitiveType.TRIANGLES, Channal = [], fbo = undefined) {
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
};
/**
 * 计算shader
 * @param {*} uniform : {}  ,uniform 参数
 * @param {*} fs :fs的字符串
 * @param {*} outputTexture :通过this.createTexture 创建的纹理
 * @returns 
 */
export function createCommandOfCompute(uniform, fs, outputTexture) {
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
};


/**
 * 创建FBO从texture，深度缓冲是单独创建的（待查）
 * @param {*} context 
 * @param {*} Color  已有的纹理
 * @returns 
 */
export function createFramebufferFromTexture(context, Color) {
    let texture = createRenderingTextures(context);
    return new Cesium.Framebuffer({
        context: context,
        colorTextures: [Color],
        depthTexture: texture.Depth

    });
};

/**
 * 创建FBO，空的FBO
 * @param {*} context 
 * @returns 
 */
export function createFramebuffer(context) {
    let texture = this.createRenderingTextures(context);
    return new Cesium.Framebuffer({
        context: context,
        colorTextures: [texture.Color],
        depthTexture: texture.Depth
    });
};

/**
 * 创建VAO
 * @param {*} context 
 * @param number[] typedArray 
 * @returns 
 */
export function createVAO(context, typedArray) {
    return Cesium.Buffer.createVertexBuffer({
        usage: Cesium.BufferUsage.STATIC_DRAW,
        typedArray: new Float32Array(typedArray),
        context: context,
    });
};

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
 * @param Uint8Array typedArray : 例子 const particleState = new Uint8Array(particleRes * particleRes * 4);//1024*4,RGBA
 * 
 * 
 * @returns Cesium.Texture
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
};

/**
 * 创建渲染纹理2个color 和 depth，为创建FBO使用
 * @param {*} context 
 * @returns {Color: {},Depth: {},}
 */
export function createRenderingTextures(context) {
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
};

// /**
//  * 简单的全屏attribute
//  * @returns {position:{},uv:{}}
//  */
// export function getFullscreenQuad() {
//     var fullscreenQuad = new Cesium.Geometry({
//         attributes: new Cesium.GeometryAttributes({
//             position: new Cesium.GeometryAttribute({
//                 componentDatatype: Cesium.ComponentDatatype.FLOAT,
//                 componentsPerAttribute: 3,
//                 //  v3----v2
//                 //  |     |
//                 //  |     |
//                 //  v0----v1
//                 values: new Float32Array([
//                     -1, -1, 0, // v0
//                     1, -1, 0, // v1
//                     1, 1, 0, // v2
//                     -1, 1, 0, // v3
//                 ])
//             }),
//             uv: new Cesium.GeometryAttribute({
//                 componentDatatype: Cesium.ComponentDatatype.FLOAT,
//                 componentsPerAttribute: 2,
//                 values: new Float32Array([
//                     0, 0,
//                     1, 0,
//                     1, 1,
//                     0, 1,
//                 ])
//             })
//         }),
//         indices: new Uint32Array([3, 2, 0, 0, 2, 1])
//     });
//     return fullscreenQuad;
// }
