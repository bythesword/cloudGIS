import * as Util from "./baseUtil"

// import {
//     createTextures, createCommandOfChannel, createCommandOfCompute, createFramebufferFromTexture,
//     createFramebuffer, createVAO, createTexture, createRenderingTextures, getFullscreenQuad
// } from "./basefunction"

export class CustomCommand {
    constructor() {
        this.iTime = 0.0;
        this.DrawInput =
        {
            type: "",//draw,compute
            primitiveType: Cesium.PrimitiveType.TRIANGLES,//tri,line,point
            rawRenderState: {},
            attribute: {},
            uniformMap: {
                iTime: () => { this.iTime += 0.0051; return this.iTime },
            },
            VS: "",
            FS: "",
            modelMatrix: [] | undefined,
            framebuffer: undefined,
            autoClear: true,
            preExecute: () => { },
            geometry: Util.getFullscreenQuad(),

        }
        this.ComputeInput = {
            commandType: 'Compute',
            uniformMap: {},
            fragmentShaderSource: {},
            outputTexture: {},
            preExecute: () => { }
        }

    }

    update(frameState) {
        if (!this.show) {
            return;
        }

        if (!Cesium.defined(this.commandToExecute)) {
            this.commandToExecute = this.createCommand(frameState.context);
        }

        if (Cesium.defined(this.preExecute)) {
            this.preExecute();
        }

        if (Cesium.defined(this.clearCommand)) {
            frameState.commandList.push(this.clearCommand);
        }
        frameState.commandList.push(this.commandToExecute);
    }

    createCommand(context) {
        switch (this.commandType) {
            case 'Draw': {
                var vertexArray = Cesium.VertexArray.fromGeometry({
                    context: context,
                    geometry: this.geometry,
                    attributeLocations: this.attributeLocations,
                    bufferUsage: Cesium.BufferUsage.STATIC_DRAW,
                });

                var shaderProgram = Cesium.ShaderProgram.fromCache({
                    context: context,
                    attributeLocations: this.attributeLocations,
                    vertexShaderSource: this.vertexShaderSource,
                    fragmentShaderSource: this.fragmentShaderSource
                });

                var renderState = Cesium.RenderState.fromCache(this.rawRenderState);
                return new Cesium.DrawCommand({
                    owner: this,
                    vertexArray: vertexArray,
                    primitiveType: this.primitiveType,
                    uniformMap: this.uniformMap,
                    modelMatrix: Cesium.Matrix4.IDENTITY,
                    shaderProgram: shaderProgram,
                    framebuffer: this.framebuffer,
                    renderState: renderState,
                    pass: Cesium.Pass.OPAQUE
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

}

// class CustomDrawCommand extends CustomCommand {

// }


// class CustomComputeCommand extends CustomCommand{

// }

