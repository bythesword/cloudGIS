import{Texture,PrimitiveType,Buffer,BufferUsage,VertexArray,ShaderProgram,RenderState,DepthFunction,Pass,DrawCommand,ComputeCommand,ShaderSource,Framebuffer,defined,PixelFormat,PixelDatatype,ComponentDatatype,Sampler,TextureMinificationFilter,TextureMagnificationFilter,TextureWrap}from"cesium";class CCMBase{constructor(e,t,a=!1){for(var i in this.timer={timer:!1,timerIndex:0,currentLevel:0,play:{circle:0,interval:.5,circleCounts:0}},this.setting={z:{dem:!0,zbed_up:!0,base_z:0,base_z_enable:!0,RateZbed:1,RateDEM:1},wind:{fadeOpacity:.996,speedFactor:.25,dropRate:.003,dropRateBump:.01,defaultRampColors:{0:"#3288bd",.1:"#66c2a5",.2:"#abdda4",.3:"#e6f598",.4:"#fee08b",.5:"#fdae61",.6:"#f46d43",1:"#d53e4f"},counts:4096,pointSize:1,UV_and_or:!0},cmType:"cm",cmTarget:"zbed",visible:!0},a)if("object"==typeof a[i]&&void 0!==this.setting[i])for(var r in a[i])this.setting[i][r]=a[i][r];else this.setting[i]=a[i];this.initFinish=!1,this.iTime=0,this.timestamp=(new Date).getTime(),this.CMs=[],this.frameState,this.listCommands=[],this.updateOfListCommands=!0,this.oneJSON={},this.resizeFlag=!1,this.visible=!0,this._modelMatrix=[],this.DS=[],this.oneJSON=t,this._modelMatrix=e,this.onReSzie(),this.initFinish=this.init()}init(){return!0}onReSzie(){}resize(){}updateCM(e){}play(e=.5,i){if(this.stop(),0==e?e=this.getPlayIntervalTime():this.setPlayIntervalTime(e),this.timer.play.circleCounts=0,!1===this.timer.timer){let t=this,a=[];for(var r in this.oneJSON.data)a.push(r);t.timer.timerIndex=this.getCurrentLevelByIndex(),this.timer.timer=setInterval(function(){if(t.updateCM(t.timer.timerIndex),"function"==typeof i&&i(t.getCurrentLevelByIndex(),t),t.timer.timerIndex>=a.length-1){t.timer.timerIndex=0;var e=t.getPlayCircle();if(0!==e&&e==t.timer.play.circleCounts)return t.stop(),void(t.timer.play.circleCounts=0);t.timer.play.circleCounts++}else t.timer.timerIndex++;t.setCurrentLevelByIndex(t.timer.timerIndex)},1e3*e)}}stop(){clearInterval(this.timer.timer),this.timer.timer=!1}getCurrentLevelByIndex(){return this.timer.currentLevel}setCurrentLevelByIndex(e=0){this.timer.currentLevel=e,this.updateCM(e)}setCMType(e="cm",t="zbed"){this.setting.cmType=e,this.setting.cm=t,this.setUpdateOfListCommands(!0)}getCMType(){return{cmType:this.setting.cmType,cm:this.setting.cm}}setPlayCircle(e=0){this.timer.play.circle=e}getPlayCircle(){return this.timer.play.circle}setPlayIntervalTime(e=.5){this.timer.play.interval=e}getPlayIntervalTime(){return this.timer.play.interval}updateSource(e){this.visible=!1,this.init(e),this.setUpdateOfListCommands(!0)}getWorldBoxObject(){return this.CMs}getCommands(e,t){if(!0===this.updateOfListCommands){this.listCommands=[];for(var a of this.getWorldBoxObject()){a=this.getTFL(e,a,t);0<a.length&&this.listCommands.push(a)}0<this.listCommands.length&&(this.updateOfListCommands=!1)}return this.listCommands}getTFL(e,t,a){t.position,t.uv,t.data[t.cmIndex[0]][t.cmIndex[1]],t.indices;return[]}update(e){if(void 0===this.frameState&&(this.frameState=e),this.visible&&this.initFinish)for(var t of this.getCommands(e,this._modelMatrix))for(var a of t)e.commandList.push(a)}getFullscreenAtt(){return{position:[-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],uv:[0,0,1,0,1,1,0,1,1,1,0,1]}}createTextures(e){let t=this;!1!==this.channel&&(this.image=new Image,this.image.src="/public/leaves.jpg",this.image.onload=()=>{t.texture=new Texture({context:e,source:t.image})})}createCommandOfChannel(a,i,r,o,n,_=PrimitiveType.TRIANGLES,t=[],l=void 0,u=!1){var v=o;if("object"==typeof t)for(let e=0;e<t.length;e++)"object"==typeof t[e]&&(v["u_channel"+e]=()=>t[e].getColorTexture(0));if("object"!=typeof r)return console.warn("attributes 需要2个属性"),!1;{var c,s=[],m={};for(c in r){var d=r[c],f=JSON.parse(JSON.stringify(d));f.vertexBuffer=Buffer.createVertexBuffer({usage:BufferUsage.STATIC_DRAW,typedArray:new Float32Array(d.vertexBuffer),context:a.context}),m[c]=f.index,s.push(f)}o=new VertexArray({context:a.context,attributes:s}),n=ShaderProgram.fromCache({context:a.context,vertexShaderSource:n.vertexShader,fragmentShaderSource:n.fragmentShader,attributeLocations:m});let e={},t=(e=new RenderState("undefined"==l?{depthTest:{enabled:!1}}:{cull:{enabled:!1},depthTest:{enabled:!1,func:DepthFunction.LESS}}),Pass.OPAQUE);return t=!0===u?Pass.TRANSLUCENT:Pass.OPAQUE,new DrawCommand({modelMatrix:i,vertexArray:o,shaderProgram:n,uniformMap:v,renderState:e,framebuffer:l,pass:t,primitiveType:_})}}createCommandOfCompute(e,t,a){return new ComputeCommand({owner:this,fragmentShaderSource:new ShaderSource({sources:[t]}),uniformMap:e,outputTexture:a,persists:!0})}createFramebufferFromTexture(e,t){var a=this.createRenderingTextures(e);return new Framebuffer({context:e,colorTextures:[t],depthTexture:a.Depth})}createFramebuffer(e){var t=this.createRenderingTextures(e);return new Framebuffer({context:e,colorTextures:[t.Color],depthTexture:t.Depth})}createVAO(e,t){return Buffer.createVertexBuffer({usage:BufferUsage.STATIC_DRAW,typedArray:new Float32Array(t),context:e})}createTexture(e,t){var a;return defined(t)&&((a={}).arrayBufferView=t,e.source=a),new Texture(e)}createRenderingTextures(e){var t={context:e,width:e.drawingBufferWidth,height:e.drawingBufferHeight,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE},e={context:e,width:e.drawingBufferWidth,height:e.drawingBufferHeight,pixelFormat:PixelFormat.DEPTH_COMPONENT,pixelDatatype:PixelDatatype.UNSIGNED_INT};return{Color:this.createTexture(t),Depth:this.createTexture(e)}}}let drawVert=`precision mediump float;

attribute float a_index;
// uniform sampler2D u_particles;//js 每次更新
uniform sampler2D u_channel0;//js 每次更新
uniform float u_particles_res;//32 ,if counts =1024
uniform float u_w;
uniform float u_h;
uniform float u_pointSize;

varying vec2 v_particle_pos;
varying vec2 ccc;
varying float iii;

void main() {
    vec4 color = texture2D(u_channel0, vec2((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w,     1.0 - floor(a_index / u_particles_res) / u_h));
    v_particle_pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a);
    iii = a_index;
    ccc = color.ba;
    gl_PointSize = u_pointSize;
    gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 2.0 * v_particle_pos.y - 1.0, 0, 1);
}
`,drawFrag=`precision mediump float;

uniform sampler2D u_wind;
// uniform vec2 u_wind_min;
// uniform vec2 u_wind_max;
uniform float u_wind_Umin;
uniform float u_wind_Vmin;
uniform float u_wind_Umax;
uniform float u_wind_Vmax;
uniform sampler2D u_color_ramp;

varying vec2 v_particle_pos;
varying vec2 ccc;
varying float iii;

void main() {
    vec2 u_wind_min = vec2(u_wind_Umin, u_wind_Vmin);
    vec2 u_wind_max = vec2(u_wind_Umax, u_wind_Vmax);
    vec2 puv = texture2D(u_wind, vec2(v_particle_pos.x, v_particle_pos.y)).gb;
    vec2 velocity = mix(u_wind_min, u_wind_max, puv);
    float speed_t = length(velocity) / length(u_wind_max);
    if(puv.x == 0.0 && puv.y == 0.0) {
        discard;
    }
    vec2 ramp_pos = vec2(fract(16.0 * speed_t), floor(16.0 * speed_t) / 16.0);
    gl_FragColor = texture2D(u_color_ramp, 1.0 - ramp_pos);
}`,quadVert=`precision mediump float;
attribute vec2 position;
varying vec2 v_tex_pos;
void main() {
    v_tex_pos = position;
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);
}`,opFrag=`precision mediump float;
uniform sampler2D u_channel0;
uniform float u_opacity;
varying vec2 v_tex_pos;
uniform sampler2D u_wind;
void main() {
    vec4 color = texture2D(u_channel0, v_tex_pos);

    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}`,NupdateFrag=`precision highp float;

// uniform sampler2D u_particles;
uniform sampler2D u_channel0;

uniform sampler2D u_wind;
// uniform vec2 u_wind_res;            //png width and height 
// uniform vec2 u_wind_min;
// uniform vec2 u_wind_max;
uniform float u_wind_Umin;
uniform float u_wind_Vmin;
uniform float u_wind_Umax;
uniform float u_wind_Vmax;
uniform float u_imgW;
uniform float u_imgH;

uniform float u_rand_seed;          //js math.random ,随机种子
uniform float u_speed_factor;       //0.25  速度
uniform float u_drop_rate;          //0.00   粒子移动到随机位置的频率
uniform float u_drop_rate_bump;     //0.01  相对于单个粒子速度的下降率增加

uniform float u_particles_res;//32 ,if counts =1024
uniform float u_w;
uniform float u_h;
varying float v_WHT;

// varying vec2 v_tex_pos;
varying vec2 v_textureCoordinates;

// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
//风速查找；使用基于4个相邻像素的手动双线性滤波实现平滑插值

vec2 lookup_wind(const vec2 uv) {
    // return texture2D(u_wind, uv).gb; // lower-res hardware filtering

    // vec2 u_wind_res = vec2(u_w, u_h);
    vec2 u_wind_res = vec2(u_imgW, u_imgH);
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(vec2(uv.x, uv.y) * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = texture2D(u_wind, vc).gb;
    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).gb;
    vec2 bl = texture2D(u_wind, vc + vec2(0, -px.y)).gb;
    vec2 br = texture2D(u_wind, vc + vec2(px.x, -px.y)).gb;
    // vec2 tl = getUV(vc);
    // vec2 tr = getUV(vc + vec2(px.x, 0));
    // vec2 bl = getUV(vc + vec2(0, px.y));
    // vec2 br = getUV(vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

//只与UV对应的像素内的值相关（位置），与UV无关
//通过数量可以减少计算，只是n*n个像素的区域
void main() {
    // //channel0=PST1
    // // gl_FragColor = texture2D(u_channel0, v_tex_pos);
    // vec4 color = texture2D(u_channel0, v_tex_pos);  
    // //RGBA是两个粒子纹理0和1的值，init是是random（），从0--256
    // vec2 pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a); // decode particle position from pixel RGBA
    // if(color.a >= 0.98)
    //     gl_FragColor = vec4(1.0, 1., 1., 1.);
    // else
    //     gl_FragColor = vec4(0.0, 1., 0., 1.);
    // return;
    vec2 u_wind_min = vec2(u_wind_Umin, u_wind_Vmin);
    vec2 u_wind_max = vec2(u_wind_Umax, u_wind_Vmax);
    vec2 v_tex_pos=v_textureCoordinates;
    float x = v_tex_pos.x * u_w;
    float y = (1.0-v_tex_pos.y) * u_h;//PST的UV
    //下面的if判断，影响整体，数据会逐步坏掉，最终，0，.0，0.，0.,在左上有一个点，size=1，基本看不到，扩到size到100以上可以看到1/4
    if(x <= u_particles_res && y <= u_particles_res) {
        vec2 uv = vec2(x / u_particles_res, y / u_particles_res);
    //上一次的位置，0.0-->1.0
    //32*32  //viewport 32*32
    //u_particles =32*32,如果粒子数量=1024
        // vec4 color = texture2D(u_particles, v_tex_pos);  
        //channel0=PST1
        vec4 color = texture2D(u_channel0, v_tex_pos);  
    //RGBA是两个粒子纹理0和1的值，init是是random（），从0--256
        vec2 pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a); // decode particle position from pixel RGBA

    // //四个点的双线性插值，再次线性插值的UV值
        // vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
        vec2 velocity = mix(vec2(-21.32, -21.57), vec2(26.8, 21.42), lookup_wind(pos));

    // //这是下一步的速度
        float speed_t = length(velocity) / length(u_wind_max);

    // // take EPSG:4236 distortion into account for calculating where the particle moved
    // //球形失真的补偿
        float distortion = cos(radians(pos.y * 180.0 - 90.0));
        distortion = 1.0;
    // //计算位移偏移量
        vec2 offset = vec2(velocity.x / distortion, velocity.y) * 0.0001 * u_speed_factor;

    // // update particle position, wrapping around the date line
    // //新位置，取小数部分，防止越界，越界即等于新位置
        pos = fract(1.0 + pos + offset);

    // // a random seed to use for the particle drop
        vec2 seed = (pos + v_tex_pos) * u_rand_seed;//随机种子

    // // drop rate is a chance a particle will restart at random position, to avoid degeneration
        float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
        float drop = step(1.0 - drop_rate, rand(seed));//0 or 1

    // //新随机位置
        vec2 random_pos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    // //跟进drop（0or1），生命周期随机，新位置或旧位置
      pos = mix(pos, random_pos, drop);

    // encode the new particle position back into RGBA
        gl_FragColor = vec4(fract(pos * 255.0), floor(pos * 255.0) / 255.0);
        //gl_FragColor = vec4(.0, 1.0, 0., 1.);
    } else {
        gl_FragColor = vec4(.0, 1.0, 0., 1.);
        // discard;
        // if(u_wind_max.x ==26.8)
        //      gl_FragColor = vec4(1.0, 0., 0., 1.);
        // if(u_wind_Umin == -21.32)
        //     gl_FragColor = vec4(1.0, 1., 0., 1.);
        // if(u_wind_Vmax == 21.42)
        //     gl_FragColor = vec4(1.0, .5, 0.5, 1.);
        // if(u_wind_Vmin == -21.57)
        //     gl_FragColor = vec4(1.0, .5, 0., 1.);
    }

}
`,cpFS=`uniform sampler2D u_channel0;
uniform sampler2D u_wind;
varying vec2 v_tex_pos;
uniform bool u_toscreen;
void main() {
    vec4 color = texture2D(u_channel0, v_tex_pos);
    gl_FragColor = color;
}`,cpTextureFS=` 
uniform sampler2D u_channel0;
varying vec2 v_textureCoordinates;
void main() {
    gl_FragColor = texture2D(u_channel0, v_textureCoordinates);   
}`,uvsVS=`attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;
void main() {
    // v_uv = a_uv;
    float cols = u_DS_XY.x;
    float rows = u_DS_XY.y;
    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;

    if(a_tp == 0.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);

    } else if(a_tp == 2.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);
    } else if(a_tp == 5.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    v_uv = vec2((col + 0.0) / cols, (row + 0.0) / rows);
    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
        v_dem = 0.0;
    }
    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
     vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a)), 1.0);
      gl_Position = czm_projection * czm_view * czm_model * position;
}`,uvsFS=`uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform bvec3 u_filterGlobalMM;
uniform bool u_UV_and;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform sampler2D u_channel0;

varying vec2 v_cm_UV00;

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;
    float v;

    bool flag_U = false;
    bool flag_V = false;

    float cmU1 = v_cm_U[0];
    float cmU2 = v_cm_U[1];
    float cmU3 = v_cm_U[2];

    if(u_filter.y == true) {
        if(u_filterKind.y == 1) {
            float cmPU1 = mix(u_U_mm.x, u_U_mm.y, cmU1);
            float cmPU2 = mix(u_U_mm.x, u_U_mm.y, cmU2);
            float cmPU3 = mix(u_U_mm.x, u_U_mm.y, cmU3);
            v = w1 * cmPU1 + w2 * cmPU2 + w3 * cmPU3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_U = true;
            }
        } else if(u_filterKind.y == 2) {
            v = w1 * cmU1 + w2 * cmU2 + w3 * cmU3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_U = true;
            }
        }
    }

    float cmV1 = v_cm_V[0];
    float cmV2 = v_cm_V[1];
    float cmV3 = v_cm_V[2];
    if(u_filter.z == true) {
        if(u_filterKind.z == 1) {
            float cmPV1 = mix(u_U_mm.x, u_U_mm.y, cmV1);
            float cmPV2 = mix(u_U_mm.x, u_U_mm.y, cmV2);
            float cmPV3 = mix(u_U_mm.x, u_U_mm.y, cmV3);
            v = w1 * cmPV1 + w2 * cmPV2 + w3 * cmPV3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_V = true;
            }
        } else if(u_filterKind.z == 2) {
            v = w1 * cmV1 + w2 * cmV2 + w3 * cmV3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_V = true;
            }
        }
    }
    if(u_UV_and) {
        if(flag_U && flag_V) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    } else {
        if(flag_U || flag_V) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    }

    vec4 color = texture2D(u_channel0, v_uv);
    if(color == vec4(0))
    discard;
    gl_FragColor = color;
    // gl_FragColor=vec4(1,0,0,1);
}

// uniform sampler2D u_channel0;
// varying vec2 v_uv;
// varying float v_dem;
// varying vec2 v_cm_UV00;
// void main() {
//     if(v_dem == 0.0)
//         discard;
//     if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
//         discard;
//     vec4 color = texture2D(u_channel0, v_uv);
//     gl_FragColor = color;
//     // gl_FragColor=vec4(1,0,0,1);
// }
`,cmFS=`uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform bvec3 u_filterGlobalMM;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;
void main() {
    if(v_dem == 0.0)
        discard;
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    v = w1 * cm1 + w2 * cm2 + w3 * cm3;

    float dv = 1.0 / float(n);
    float nv = float(v / dv);
    float vv = float(nv) * dv;   
                    // if( flag_break ==true ){ discard;}
    if(flag_break == false) {
        if(vv <= 0.08333333333333333) {
            gl_FragColor = vec4(0.0, 0, 1.0, 1.0);
        } else if(vv > 0.08333333333333333 && vv <= 0.16666666666666666) {
            gl_FragColor = vec4(0.0, 0.3607843137254902, 1.0, 1.0);
        } else if(vv > 0.16666666666666666 && vv <= 0.250) {
            gl_FragColor = vec4(0.0, 0.7254901960784313, 1.0, 1.0);
        } else if(vv > 0.250 && vv <= 0.3333333333333333) {
            gl_FragColor = vec4(0.0, 1., 0.9058823529411765, 1.0);
        } else if(vv > 0.3333333333333333 && vv <= 0.41666666666666663) {
            gl_FragColor = vec4(0.0, 1., 0.5450980392156862, 1.0);
        } else if(vv > 0.41666666666666663 && vv <= 0.49999999999999994) {
            gl_FragColor = vec4(0.0, 1., 0.1803921568627451, 1.0);
        } else if(vv > 0.49999999999999994 && vv <= 0.5833333333333333) {
            gl_FragColor = vec4(0.1803921568627451, 1., 0., 1.0);
        } else if(vv > 0.5833333333333333 && vv <= 0.6666666666666666) {
            gl_FragColor = vec4(0.5450980392156862, 1., 0., 1.0);
        } else if(vv > 0.6666666666666666 && vv <= 0.75) {
            gl_FragColor = vec4(0.9058823529411765, 1., 0., 1.0);
        } else if(vv > 0.75 && vv <= 0.8333333333333334) {
            gl_FragColor = vec4(1., .7254901960784313, 0., 1.0);
        } else if(vv > 0.8333333333333334 && vv <= 0.9166666666666667) {
            gl_FragColor = vec4(1., .3607843137254902, 0., 1.0);
        } else {
            gl_FragColor = vec4(1., .0, 0., 1.0);
        }
    }
    vec4 finalColor = vec4(0);

}`,cmVS=`attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;

void main() {
    // v_uv = a_uv;

    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;

    if(a_tp == 0.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);

    } else if(a_tp == 2.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);
    } else if(a_tp == 5.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
        v_dem = 0.0;
    }

    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z=0.;
    if(u_dem_enable == true)
    z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, z, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);

}
`,cmAFS=`#define GRID_SCALE 1.
#define CELL_SCALE 11.0
#define VECTOR_SCALE 1.15
#define pi 3.14159
#define bgColor 0.6

// uniform sampler2D u_DS;
// uniform vec2 u_DS_XY;
// uniform float u_DS_CellSize;
// uniform bool u_dem_enable;
// uniform float u_dem_base;
// uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
// uniform vec2 u_dem_mm;
// uniform vec2 u_zbed_mm;

// uniform bool u_UVs;
// uniform ivec3 u_filterKind;
// uniform bvec3 u_filter;
// uniform vec2 u_filterValue_zebd;
// uniform vec2 u_filterValue_U;
// uniform vec2 u_filterValue_V;

varying vec2 v_uv;
// varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;

float sinh(float x) {
    return (exp(x) - exp(-x)) / 2.;
}
float cosh(float x) {
    return (exp(x) + exp(-x)) / 2.;
}
float tanh(float x) {
    return sinh(x) / cosh(x);
}
float thc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}
float sdEquilateralTriangle(in vec2 p, vec2 v) {
    float r = 1.;
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if(p.x + k * p.y > 0.0)
        p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sign(p.y);
}

float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.)) + min(max(d.x, d.y), 0.0);
}
// direction and normal for x and y (-1 to 1)
// exp:xy1,xy2,xy3
vec2 xy1 = vec2(1.0, 1.0);
vec2 xy2 = vec2(0.1, .5);
vec2 xy3 = vec2(-0.2, -0.2);
vec2 xy4 = vec2(1, -1.);

float arrow(vec2 uv, vec2 v) {
    float h = 0.3 + 0.4 * thc(4., 2.);
    float d1 = sdEquilateralTriangle(uv - vec2(0., 0.5 - h), v);
    float s1 = step(d1, -0.5 + 0.1 * length(v));//箭头大小

    float d2 = sdBox(uv - vec2(0., -h * .163), vec2(0.05 + 0.05 * length(v), 0.2 + 0.2 * length(v)));
    float s2 = step(d2, 0.);

    //return s2;
    return max(s1, s2);
}

//p=uv,v=向量
float sdVectorArrow(in vec2 p, in vec2 v) {

    float m = length(v);//向量长度，length(1,1)=1.4142...
    vec2 n = v / m;// n=(0.7017,0.7071)
    p = vec2(dot(p, n.yx * vec2(1.0, -1.0)), dot(p, n));//方向判断(逆时针90度)，n控制长度(归一化，统一，变小)
    return arrow(p, v);//shape 
}

vec3 CMC(vec2 uv, vec3 CM) {
    float step = 12.0;
    float perStep = step / 4.0;
    float stair = 0.25;
   /* 
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;
    */
    vec3 cmColor;

    // int i = 0;
    int j = int(perStep);

    float vv = CM[0];

    if(vv <= 0.25 && vv >= 0.0) {
        for(int i = 0; i < 3; i++) {
            if(vv >= float(i) * stair / perStep && vv <= (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(0.0, float(i) / perStep, 1.0);
                break;
            }
        }
    } else if(vv > 0.25 && vv <= 0.5) {
        for(int i = 0; i < 3; i++) {
            if(vv > 0.25 + float(i) * stair / perStep && vv <= 0.25 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(0.0, 1.0, 1.0 - float(i + 1) / perStep);
                break;
            }
        }
    } else if(vv > 0.5 && vv <= 0.75) {
        for(int i = 0; i < 3; i++) {
            if(vv > 0.5 + float(i) * stair / perStep && vv <= 0.5 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(float(i + 1) / perStep, 1.0, 0.0);
                break;
            }
        }
    } else if(vv > 0.75 && vv <= 1.0) {
        for(int i = 0; i < 3; i++) {
            if(vv >= 0.75 + float(i) * stair / perStep && vv <= 0.75 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(1.0, 1. - float(i + 1) / perStep, 0.0);
                break;
            }
        }
    } else {
        cmColor = vec3(1.0, .0, .0);
    }

    return cmColor;
}

void main() {
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
    vec2 uv000 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);
    // vec3 CM = sqrt(exp2(v_cm_U) + exp2(v_cm_V));
    // vec3 CM = vec3(sqrt(exp2(v_cm_U.x) + exp2(v_cm_V.x)), sqrt(exp2(v_cm_U.y) + exp2(v_cm_V.y)), sqrt(exp2(v_cm_U.z) + exp2(v_cm_V.z)));
    vec3 CM = vec3(sqrt(v_cm_U.x * v_cm_U.x + v_cm_V.x * v_cm_V.x), sqrt(v_cm_U.y * v_cm_U.y + v_cm_V.y * v_cm_V.y), sqrt(v_cm_U.z * v_cm_U.z + v_cm_V.z * v_cm_V.z));

    // vec3 CM = vec3(1.0, 1.0, 0.0);
    vec2 uv1 = (v_uv * 4. - (1.95) * 1.0) / 1.0;

    // float vector1 = sdVectorArrow(uv1, xy1);
    float vector1 = sdVectorArrow(uv1, uv000 / 1.5);

    vec3 mixcolor = vec3(bgColor);

    mixcolor = mix(mixcolor, CMC(vec2(.0, .0), CM), vector1);

    if(mixcolor.r == 0.0 && mixcolor.g == 0.0 && mixcolor.b == 0.0) {
        gl_FragColor = vec4(mixcolor, 0.0);
    } else {
        gl_FragColor = vec4(mixcolor, 1.0);
    }
    if(gl_FragColor.r == bgColor && gl_FragColor.g == bgColor && gl_FragColor.b == bgColor) {
        gl_FragColor.a = bgColor;
    }
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

}`,cmAVS=`attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying float v_U;
varying float v_V;
varying vec2 v_cm_UV00;

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;
void main() {
    // v_uv = a_uv;

    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    v_U = 1.0;
    v_V = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;

    if(a_tp == 0.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);

    } else if(a_tp == 2.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1, 1);
    } else if(a_tp == 5.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(0, 1);
    }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
        v_dem = 0.0;
    }
     
    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
     vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a)), 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);

}
`,cmW1=`uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;
uniform float iTime;  

#define PI 3.14159265358979

int windows = 0;
vec2 m = vec2(-0.7, .8);

float hash(in vec2 p) {
    return fract(sin(p.x * 15.32 + p.y * 5.78) * 43758.236237153);
}

vec2 hash2(vec2 p) {
    return vec2(hash(p * .754), hash(1.5743 * p.yx + 4.5891)) - .5;
}

vec2 hash2b(vec2 p) {
    vec2 q = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(q) * 43758.5453) - .5;
}

mat2 m2 = mat2(.8, .6, -.6, .8);

// Gabor/Voronoi mix 3x3 kernel (some artifacts for v=1.)
float gavoronoi3(in vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float f = 2. * PI;//frequency
    float v = .8;//cell variability <1.
    float dv = .4;//direction variability <1.
    vec2 dir = m;//vec2(.7,.7);
    float va = 0.0;
    float wt = 0.0;
    for(int i = -1; i <= 1; i++) for(int j = -1; j <= 1; j++) {
            vec2 o = vec2(i, j) - .5;
            vec2 h = hash2(ip - o);
            vec2 pp = fp + o - h;
            float d = dot(pp, pp);
            float w = exp(-d * 4.);
            wt += w;
            h = dv * h + dir;//h=normalize(h+dir);
            va += cos(dot(pp, h) * f / v) * w;
        }
    return va / wt;
}

// Gabor/Voronoi mix 4x4 kernel (clean but slower)
float gavoronoi4(in vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    vec2 dir = m;// vec2(.9,.7);
    float f = 2. * PI;//frequency
    float v = 1.;//cell variability <1.
    float dv = .7;//direction variability <1.
    float va = 0.0;
    float wt = 0.0;
    for(int i = -2; i <= 1; i++) for(int j = -2; j <= 1; j++) {
            vec2 o = vec2(i, j);
            vec2 h = hash2(ip - o);
            vec2 pp = fp + o - v * h;
            float d = dot(pp, pp);
            float w = exp(-d * 2.);
            wt += w;
            h = dv * h + dir;//h=normalize(h+dir);
            va += cos(dot(pp, h) * f) * w;
        }
    return va / wt;
}

// Gabor/Voronoi mix 5x5 kernel (even slower but suitable for large wavelets)
float gavoronoi5(in vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float f = 2. * PI;//frequency
    float v = .8;//cell variability <1.
    float dv = .8;//direction variability <1.
    vec2 dir = m;//vec2(.7,.7);
    float va = 0.0;
    float wt = 0.0;
    for(int i = -2; i <= 2; i++) for(int j = -2; j <= 2; j++) {
            vec2 o = vec2(i, j) - .5;
            vec2 h = hash2(ip - o);
            vec2 pp = fp + o - h;
            float d = dot(pp, pp);
            float w = exp(-d * 1.);
            wt += w;
            h = dv * h + dir;//h=normalize(h+dir);
            va += cos(dot(pp, h) * f / v) * w;
        }
    return va / wt;
}

//concentric waves variant
float gavoronoi3b(in vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float f = 5. * PI;
    ;//frequency
    float v = 1.;//cell variability <1.
    float va = 0.0;
    float wt = 0.0;
    for(int i = -1; i <= 1; i++) for(int j = -1; j <= 1; j++) {
            vec2 o = vec2(i, j) - .5;
            vec2 pp = fp + o - v * hash2(ip - o);
            float d = dot(pp, pp);
            float w = exp(-d * 4.);
            wt += w;
            va += cos(sqrt(d) * f) * w;
        }
    return va / wt;
}

float noise(vec2 p) {
    return gavoronoi4(p);
}

float fbmabs(vec2 p) {

    float f = 1.;

    float r = 0.0;
    for(int i = 0; i < 6; i++) {
        r += abs(noise(p * f)) / f;
        f *= 2.2;
        p += vec2(-.01, .07) * r + .2 * m * iTime / (.1 - f);
    }
    return r;
}

float fbm(vec2 p) {

    float f = 1.;

    float r = 0.0;
    for(int i = 0; i < 8; i++) {
        r += noise(p * f) / f;
        f *= 2.;
        p += vec2(.01, -.05) * r + .2 * m * iTime / (.1 - f);
    }
    return r;
}

float map(vec2 p) {

    if(windows == 0)
        return noise(p * 10.);
    if(windows == 1)
        return 2. * abs(noise(p * 10.));
    if(windows == 2)
        return fbm(p) + 1.;
    return 1. - fbmabs(p);
}

vec3 nor(in vec2 p) {
    const vec2 e = vec2(0.002, 0.0);
    return -normalize(vec3(map(p + e.xy) - map(p - e.xy), map(p + e.yx) - map(p - e.yx), .15));
}

void main() {
       
    
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
	// vec2 p = 2.*fragCoord.xy /iResolution.xy-1.;
    vec2 p = 2. * v_uv - 1.;

    if(p.y > 0.) {
        if(p.x > 0.)
            windows = 1;
        else
            windows = 0;
    } else {
        if(p.x > 0.)
            windows = 3;
        else
            windows = 2;
    }
    //comment the following line to see windows
    windows = 3;

    p += .2 * m * iTime;
    vec3 light = normalize(vec3(3., 2., -1.));
    float r;
    r = max(dot(nor(p), light), 0.25);
    float k = map(p) * .8 + .15;
    // gl_FragColor = clamp(vec4(r, r, r, 1.0),0.,1.);
    gl_FragColor = clamp(vec4(r * k * k, r * k, r * sqrt(k), 1.0), 0., 1.);
 
}
`,cmW2=`varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;
uniform float iTime;  


vec4 mod289(vec4 x) {
    return x - floor(x / 289.0) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289((x * 34.0 + 1.0) * x);
}

vec4 snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

    // First corner
    vec3 i = floor(v + dot(v, vec3(C.y)));
    vec3 x0 = v - i + dot(i, vec3(C.x));

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.x;
    vec3 x2 = x0 - i2 + C.y;
    vec3 x3 = x0 - 0.5;

    // Permutations
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    vec4 j = p - 49.0 * floor(p / 49.0);  // mod(p,7*7)

    vec4 x_ = floor(j / 7.0);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
    vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Compute noise and gradient at P
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    vec4 m2 = m * m;
    vec4 m3 = m2 * m;
    vec4 m4 = m2 * m2;
    vec3 grad = -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0 +
        -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1 +
        -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2 +
        -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;
    vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
    return 42.0 * vec4(grad, dot(m4, px));
}


float water_caustics(vec3 pos) {
    vec4 n = snoise(pos);

    pos -= 0.07 * n.xyz;
    pos *= 1.62;
    n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);
    return n.w;
}

void main() {
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;

    
    vec2 iResolution = vec2(1);
    // vec2 p = (-iResolution.xy + 2.0 * fragCoord) / iResolution.y;
    vec2 uv = v_uv * 72.0;
    //  uv = fragCoord.xy/iResolution.xy*12.;
    //uv *= vec2(1, iResolution.y / iResolution.x);

    float w = mix(water_caustics(vec3(uv, iTime * 0.75)), water_caustics(vec3(uv, iTime * 0.75) + 1.), 0.5);

    // noise [-1..+1] -> color
    float intensity = exp(w * 3. - 0.5);
    /*vec3 col = vec3(0.65, 0.72, 0.8);
    vec3 col = vec3(0.85, 0.9, 1.0);*/
    gl_FragColor = vec4(mix(vec3(0.65, 0.74, 0.85), vec3(0.86, 0.94, 1.0), intensity), 0.59);
        //  gl_FragColor =vec4(1,0,0,0.31);
        //  return ;
}
`,cmW3=`varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;
uniform float iTime;  
/// uncoment for height quality
//#define HQ

/// epsilon
#define E 0.001

/// rotate point p around OX
vec3 rotRX(vec3 p, float l) {
    float sl = sin(l), cl = cos(l);
    return vec3(p.x, cl * p.y - sl * p.z, sl * p.y + cl * p.z);
}

/// height map
float mapH(vec2 p) {
    float r = 0.0;

    float h = 0.5;
    float ph = 0.5;
    bool am0 = true;

#ifdef HQ
    for(int a = 0; a < 9; a++)
#else
        for(int a = 0; a < 7; a++)
#endif
        {
            vec2 p2 = p;
            if(!am0) {
                p2.x = p.y;
                p2.y = p.x;
            }
            p2 *= ph;

		/// wave argument
            float v = p2.x;
            v = p2.y + sin(p2.x) + iTime;

		/// wave 0.0 to 1.0
            v = sin(v) * (0.75 - 0.25 * sin(2.0 * v));
            v = 0.5 * v - 0.5;
            v = v * v;

		/// add to final
            r += h * v;

		/// change scalars
            h *= 0.44;
            ph *= 2.0;

		/// a%2
            am0 = !am0;
        }

	/// return final value
    return r;
}

/// position of the sun (witch look like a moon, fine with me)
const vec3 sunPos = vec3(5, 40, 50);

/// sky color basing on direction ray
vec3 getSkyColor(vec3 dir) {
    return mix(vec3(0.01, 0.01, 0.13), vec3(0.5, 0.5, 0.5), clamp(2.0 * dir.z, 0.0, 1.0));
}

/// render by throwing ray from sp point in dir direction
vec3 render(vec3 sp, vec3 dir) {

	/// search hit point p2
	/// v2 = distance from camera
	/// h2 = height of water in hit point
    float v1, v2, v3;
    v1 = 0.0;
    v3 = 100.0;
    v2 = (v1 + v2) / 2.0;
    float h1, h2, h3;
    vec3 p1, p2, p3;
    h1 = mapH((p1 = sp + v1 * dir).xy);
    if(!(h1 <= p1.z)) {
        return vec3(1, 0, 0);
    }
    h3 = mapH((p3 = sp + v3 * dir).xy);
    if(!(p3.z <= h3)) {
        return getSkyColor(dir);
    }
    for(int a = 0; a < 0x200; a++) {
        v2 = 0.05 * v1 + 0.95 * v3;
        p2 = sp + v2 * dir;
        h2 = mapH(p2.xy);
        if(h2 < p2.z) {
            v1 = v2;
        } else {
            v3 = v2;
        }
    }

	/// normal
    vec3 nor = normalize(vec3((h2 - mapH(p2.xy + vec2(E, 0))), (h2 - mapH(p2.xy + vec2(0, E))), E));

	/// sun reflect
    vec3 sunDir = normalize(sunPos - p2);
    float sunRef = clamp(dot(nor, reflect(sunDir, -dir)), 0.0, 1.0);
    sunRef = 1.0 + 2.0 * pow(sunRef, 1024.0);

	/// final color
    return mix(
			/// see color
    vec3(.1, clamp(0.25 + 0.5 * h2, 0.0, 1.0), 0.99) * (0.5 + 0.5 * dot(-dir, nor)) * (0.5 + 0.5 * dot(vec3(0, 0, 1), nor)) * sunRef,
			/// sky color
    getSkyColor(dir),
			/// fog
    0.0 + clamp((v2 - 20.0) / 80.0, 0.0, 1.0));
}

void main() {
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
	//vec2 uv = fragCoord.xy / iResolution.x; //Uncomment for square image

    vec2 uv = 2.0 * v_uv - vec2(1.0, 1.0);

    vec3 sp = vec3(0.0, 0.0, 2.0);
    vec3 dir = normalize(vec3(uv.x, 4.0, uv.y));
    dir = rotRX(dir, -0.085 * 3.1415);//old -0.05

    gl_FragColor = vec4(render(sp, dir), 0.70);
}
`,cmWS1=`uniform sampler2D u_channel0;
uniform float iTime;
uniform vec2 u_U_mm;
uniform vec2 u_V_mm;


varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;

//作废，不使用
float get_x(vec2 dir, float y, float b) {
    float x;
    float fa = dir.x / dir.y;
    y = fa * x + b;
    return x;
}
float get_y(vec2 dir, float x, float b) {
    float y;
    float fa = dir.y / dir.x;
    y = fa * x + b;
    return y;
}

//b在0-2之间，在屏幕范围内，公式对应于笛卡尔坐标（UV也是笛卡尔）
vec3 line(vec2 a_uv, float thickness, float b, vec2 uv) {
    if(b > 2.0) {
           // b-=4.25;//y=f*x+b,忘记了为什么是-4.25了,反正就是平面空间
    }
    vec2 dir = normalize(vec2(-a_uv.y, a_uv.x));

    float y1;
    float x1 = 1.0;
    vec2 v0 = vec2(0.0, 0.0); //线上的某个点(x=1,y=fa*x+b)
    if(dir.x == 0.0) {
        y1 = get_x(dir, x1, b);
        v0 = vec2(y1, x1);
    } else {
        y1 = get_y(dir, x1, b);
        v0 = vec2(x1, y1);
    }

    //当前求的线的向量
    //直线的单位长度法线，垂直的a_uv的线
    vec2 nor_a_uv = normalize(a_uv);

    // signed distance from p to the line
    //p到直线的有符号距离
    float dist = dot(uv - v0, nor_a_uv);//每个uv点到line的距离，核心

    float sphereMask = dist;
    //float hardness = 0.21;
    //float sphereMask = 1.0 - (distance(uv, a_uv1*-20.) / (1.0 - hardness));    
    float wavesSpeed = 4.0;
    float wavesFrequency = 6.0;

    float sine = sin(iTime * wavesSpeed + sphereMask * wavesFrequency);

    vec3 col = vec3(abs(sine) < thickness);//无过度
    //vec3 col = vec3(abs(dist)<thickness);//无过度
    //vec3 col = vec3(1.0-smoothstep(abs(dist),0.0, thickness));

    return col;

}
mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}
vec2 a_uv1 = vec2(-.5, -0.5);
float step = 0.5;

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
    float thickness = 0.3;
    vec2 a_uv1 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);
    vec2 uv = v_uv;


    vec3 col1 = line(vec2(-a_uv1.x,-a_uv1.y), thickness, 0., uv);
    gl_FragColor = vec4(col1, 1.0);

    // gl_FragColor=vec4(1,0,0,1);
}
`,cmWS2=`uniform sampler2D u_channel0;
uniform sampler2D u_noise64x64;
uniform float iTime;
uniform vec2 u_U_mm;
uniform vec2 u_V_mm;

varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;

#define NB 60      // number or gabor blobs
#define SIZE .22   // size of gabor blobs
                    // freq tuned by mouse.x

#define M_PI 3.14159265358979
float gauss(float x) {
    return exp(-(x * x) / (SIZE * SIZE));
}

float rndi(int i, int j) {
    vec2 uv = vec2(.5 + float(i), .5 + float(j)) / 64.;
    return texture2D(u_noise64x64, uv).r;
}

float gabor(vec2 pos, vec2 dir) {
    float g = gauss(pos.x) * gauss(pos.y);
    float s = .5 * sin(dot(pos, dir) * 2. * M_PI - 10. * iTime);
    return g * s;
}

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;

    vec2 uv = v_uv;
    float freq = mix(1.9, uv.x / 1., 0. / uv.x);

    vec3 col = vec3(0.);
    vec2 a_uv1 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);

    for(int i = 0; i < NB; i++) {
        vec2 pos = vec2(1.5 * rndi(i, 0), rndi(i, 1));
		//vec2 dir = (1.+d)*vec2(rndi(i,2),rndi(i,3))-d;
        vec2 dir = vec2(a_uv1.x, a_uv1.y);
        col += gabor(uv - pos, freq * dir) * vec3(1);//texture(iChannel0,pos).rgb;
    }
    gl_FragColor = vec4(col, 1.0);

}
`,cmBlue6=`uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform bvec3 u_filterGlobalMM;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;
void main() {
    if(v_dem == 0.0) {
        // discard;
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    }
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    v = w1 * cm1 + w2 * cm2 + w3 * cm3;

    float dv = 1.0 / float(n);
    float nv = float(v / dv);
    float vv = float(nv) * dv;   
                    // if( flag_break ==true ){ discard;}
    vec4 fragColor = vec4(1);
    if(flag_break == false) {
        if(vv <= 1.0 / 6.0 && vv >= 0.) {
            fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
        } else if(vv > 1.0 / 6.0 && vv <= 2.0 / 6.0) {
            fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
        } else if(vv > 2.0 / 6.0 && vv <= 0.5) {
            fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
        } else if(vv > 0.5 && vv <= 4.0 / 6.0) {
            fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
        } else if(vv > 4.0 / 6.0 && vv <= 5.0 / 6.0) {
            fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
        } else if(vv > 5.0 / 6.0 && vv <= 1.0) {
            fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
        } else {
            fragColor = vec4(.0, 0, 1., 1.0);
        }
    }
    gl_FragColor = fragColor;
    vec4 finalColor = vec4(0);

}`,cmBlue=`uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform bvec3 u_filterGlobalMM;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;
void main() {
    if(v_dem == 0.0)
        discard;
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    v = w1 * cm1 + w2 * cm2 + w3 * cm3;

    float dv = 1.0 / float(n);
    float nv = float(v / dv);
    float vv = float(nv) * dv;   
                    // if( flag_break ==true ){ discard;}
    vec4 fragColor = vec4(1);
    if(flag_break == false) {

        if(vv <= 0.08333333333333333) {
            fragColor = vec4(0.0, 0, 1.0, 1.0);
        } else if(vv > 0.08333333333333333 && vv <= 0.16666666666666666) {
            fragColor = vec4(0.0, 0.3607843137254902, 1.0, 1.0);
        } else if(vv > 0.16666666666666666 && vv <= 0.250) {
            fragColor = vec4(0.0, 0.7254901960784313, 1.0, 1.0);
        } else if(vv > 0.250 && vv <= 0.3333333333333333) {
            fragColor = vec4(0.0, 1., 0.9058823529411765, 1.0);
        } else if(vv > 0.3333333333333333 && vv <= 0.41666666666666663) {
            fragColor = vec4(0.0, 1., 0.5450980392156862, 1.0);
        } else if(vv > 0.41666666666666663 && vv <= 0.49999999999999994) {
            fragColor = vec4(0.0, 1., 0.1803921568627451, 1.0);
        } else if(vv > 0.49999999999999994 && vv <= 0.5833333333333333) {
            fragColor = vec4(0.1803921568627451, 1., 0., 1.0);
        } else if(vv > 0.5833333333333333 && vv <= 0.6666666666666666) {
            fragColor = vec4(0.5450980392156862, 1., 0., 1.0);
        } else if(vv > 0.6666666666666666 && vv <= 0.75) {
            fragColor = vec4(0.9058823529411765, 1., 0., 1.0);
        } else if(vv > 0.75 && vv <= 0.8333333333333334) {
            fragColor = vec4(1., .7254901960784313, 0., 1.0);
        } else if(vv > 0.8333333333333334 && vv <= 0.9166666666666667) {
            fragColor = vec4(1., .3607843137254902, 0., 1.0);
        } else {
            fragColor = vec4(1., .0, 0., 1.0);
        }
    }
    gl_FragColor = fragColor;
    vec4 finalColor = vec4(0);

}`,cmWaterC12FS=`
// uniform sampler2D u_DS;
// uniform vec2 u_DS_XY;
// uniform float u_DS_CellSize;
// uniform bool u_dem_enable;
// uniform float u_dem_base;
// uniform float u_CMType;

// uniform vec2 u_U_mm;
// uniform vec2 u_V_mm;
// uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

// uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
// uniform vec2 u_filterValue_U;
// uniform vec2 u_filterValue_V;

// uniform bvec3 u_filterGlobalMM;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
// varying vec3 v_cm_U;
// varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;

uniform float u_water_wave_speed; 
 
uniform float u_water_wave_scale; 

 
uniform float u_water_wave_opacity;

vec4 texture(sampler2D s, vec2 c) {
    return texture2D(s, c);
}
vec4 texture(sampler2D s, vec2 c, float b) {
    return texture2D(s, c, b);
}
vec4 texture(samplerCube s, vec3 c) {
    return textureCube(s, c);
}
vec4 texture(samplerCube s, vec3 c, float b) {
    return textureCube(s, c, b);
}

float avg(vec4 color) {
    return (color.r + color.g + color.b) / 3.0;
}
vec4 CMC(vec2 uv, vec3 CM) {
    if(uv.x < .0)
        uv.x = .0;
    if(uv.y < .0)
        uv.y = .0;
    if(uv.x > 1.0)
        uv.x = 1.0;
    if(uv.y > 1.0)
        uv.y = 1.0;
    float step = 12.0;
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];
    float dv = 1.0 / step;
    float vv = v;
    vec4 fragColor = vec4(1);

    if(vv <= 0.08333333333333333) {
        fragColor = vec4(0.0, 0, 1.0, 1.0);
    } else if(vv > 0.08333333333333333 && vv <= 0.16666666666666666) {
        fragColor = vec4(0.0, 0.3607843137254902, 1.0, 1.0);
    } else if(vv > 0.16666666666666666 && vv <= 0.250) {
        fragColor = vec4(0.0, 0.7254901960784313, 1.0, 1.0);
    } else if(vv > 0.250 && vv <= 0.3333333333333333) {
        fragColor = vec4(0.0, 1., 0.9058823529411765, 1.0);
    } else if(vv > 0.3333333333333333 && vv <= 0.41666666666666663) {
        fragColor = vec4(0.0, 1., 0.5450980392156862, 1.0);
    } else if(vv > 0.41666666666666663 && vv <= 0.49999999999999994) {
        fragColor = vec4(0.0, 1., 0.1803921568627451, 1.0);
    } else if(vv > 0.49999999999999994 && vv <= 0.5833333333333333) {
        fragColor = vec4(0.1803921568627451, 1., 0., 1.0);
    } else if(vv > 0.5833333333333333 && vv <= 0.6666666666666666) {
        fragColor = vec4(0.5450980392156862, 1., 0., 1.0);
    } else if(vv > 0.6666666666666666 && vv <= 0.75) {
        fragColor = vec4(0.9058823529411765, 1., 0., 1.0);
    } else if(vv > 0.75 && vv <= 0.8333333333333334) {
        fragColor = vec4(1., .7254901960784313, 0., 1.0);
    } else if(vv > 0.8333333333333334 && vv <= 0.9166666666666667) {
        fragColor = vec4(1., .3607843137254902, 0., 1.0);
    } else {
        fragColor = vec4(1., .0, 0., 1.0);
    }
    return fragColor;
}

void main() {
    if(v_dem == 0.0)
        discard; 

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    float speed = u_water_wave_speed;//.80;
 
    float scale = u_water_wave_scale;//0.5;

 
    float opacity = u_water_wave_opacity; 
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;
 
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));
    vec4 background = CMC(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 
    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);
    float alpha = opacity;
    if(avg(water1 + water2) > 0.83) {
        alpha = 0.0;
    }
    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {
        alpha = 5.0 * opacity;
    }

    gl_FragColor = (water1 + water2) * alpha + background;
}
`,cmWaterBlue6ColorFS=`
// uniform sampler2D u_DS;
// uniform vec2 u_DS_XY;
// uniform float u_DS_CellSize;
// uniform bool u_dem_enable;
// uniform float u_dem_base;
// uniform float u_CMType;

// uniform vec2 u_U_mm;
// uniform vec2 u_V_mm;
// uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

// uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
// uniform vec2 u_filterValue_U;
// uniform vec2 u_filterValue_V;

// uniform bvec3 u_filterGlobalMM;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
// varying vec3 v_cm_U;
// varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;

uniform float u_water_wave_speed; 
uniform float u_water_wave_scale; 
uniform float u_water_wave_opacity; 

vec4 texture(sampler2D s, vec2 c) {
    return texture2D(s, c);
}
vec4 texture(sampler2D s, vec2 c, float b) {
    return texture2D(s, c, b);
}
vec4 texture(samplerCube s, vec3 c) {
    return textureCube(s, c);
}
vec4 texture(samplerCube s, vec3 c, float b) {
    return textureCube(s, c, b);
}

float avg(vec4 color) {
    return (color.r + color.g + color.b) / 3.0;
}
vec4 CMC(vec2 uv, vec3 CM) {
    if(uv.x < .0)
        uv.x = .0;
    if(uv.y < .0)
        uv.y = .0;
    if(uv.x > 1.0)
        uv.x = 1.0;
    if(uv.y > 1.0)
        uv.y = 1.0;
    float step = 12.0;
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];
    float dv = 1.0 / step;
    float vv = v;
    vec4 fragColor = vec4(1);

    if(vv <= 1.0 / 6.0 && vv >= 0.) {
        fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
    } else if(vv > 1.0 / 6.0 && vv <= 2.0 / 6.0) {
        fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
    } else if(vv > 2.0 / 6.0 && vv <= 0.5) {
        fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
    } else if(vv > 0.5 && vv <= 4.0 / 6.0) {
        fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
    } else if(vv > 4.0 / 6.0 && vv <= 5.0 / 6.0) {
        fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
    } else if(vv > 5.0 / 6.0 && vv <= 1.0) {
        fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
    } else {
        fragColor = vec4(.0, 0, 1., 1.0);
    }
    return fragColor;
}

void main() {
    if(v_dem == 0.0)
        discard;
 

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    float speed = u_water_wave_speed; 
 
    float scale = u_water_wave_scale; 

 
    float opacity = u_water_wave_opacity; 
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));
 
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) { 
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) { 
        alpha = 5.0 * opacity;
    }
 
    gl_FragColor = (water1 + water2) * alpha + background;
}
`;class CCMSNW extends CCMBase{init(){this.GTS={},void 0!==window.GTS?this.GTS=window.GTS:window.GTS=this.GTS,this.CMs=[{index:[],tp:[],uv:[]}];var a=this.oneJSON.dem.cols,e=this.oneJSON.dem.rows;this.imageW=a,this.imageH=e,this.textures={};for(let t=0;t<e-1;t++)for(let e=0;e<a-1;e++)this.CMs[0].index.push(e+0+(t+0)*a),this.CMs[0].index.push(e+1+(t+0)*a),this.CMs[0].index.push(e+1+(t+1)*a),this.CMs[0].tp.push(0,1,2),this.CMs[0].index.push(e+0+(t+0)*a),this.CMs[0].index.push(e+0+(t+1)*a),this.CMs[0].index.push(e+1+(t+1)*a),this.CMs[0].tp.push(3,4,5);return this.DS=[],this.loadDS=!1,this.loadDSing=!1,this.visible=!0}onReSzie(){let t=this;window.addEventListener("resize",function(e){t.resize(e,t)})}getTFL(e,t,a){var i,r,o=[];return!1===this.loadDS||!0===this.updateOfListCommands?(!1===this.loadDSing&&this.initData(e.context),"wind"==this.setting.cmType&&(void 0===this.FBO1?(this.setColorRamp(e.context,this.setting.wind.defaultRampColors),this.set_numParticles(e.context,this.setting.wind.counts)):(this.FBO1.destroy(),this.FBO2.destroy()),this.FBO1=this.createFramebuffer(e.context),this.FBO2=this.createFramebuffer(e.context))):"wind"!=this.setting.cmType||1!=this.resizeFlag&&1!=this.renewFlag||(this.FBO1.destroy(),this.FBO2.destroy(),this.FBO1=this.createFramebuffer(e.context),this.FBO2=this.createFramebuffer(e.context)),this.loadDS&&"wind"==this.setting.cmType?(r={position:{index:0,componentsPerAttribute:2,vertexBuffer:[0,0,1,0,0,1,0,1,1,0,1,1],componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,r,{iTime:()=>{return this.iTime+=.0051,((new Date).getTime()-this.timestamp)/1e3},u_opacity:()=>this.setting.wind.fadeOpacity},{vertexShader:quadVert,fragmentShader:opFrag},PrimitiveType.TRIANGLES,[this.FBO2],this.FBO1)),i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:this.particleIndices,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_particles_res:()=>this.particleStateResolution,u_w:()=>this.particleStateResolution,u_h:()=>this.particleStateResolution,u_wind_Umin:()=>this.oneJSON.dataContent.U.min,u_wind_Vmin:()=>this.oneJSON.dataContent.V.min,u_wind_Umax:()=>this.oneJSON.dataContent.U.max,u_wind_Vmax:()=>this.oneJSON.dataContent.V.max,u_color_ramp:()=>this.colorRampTexture,u_wind:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.particleStateTexture0,u_pointSize:()=>this.getWMPointSize()},{vertexShader:drawVert,fragmentShader:drawFrag},PrimitiveType.POINTS,[],this.FBO1)),o.push(this.createCommandOfCompute({iTime:()=>(this.iTime+=.0051,this.iTime),u_speed_factor:()=>this.setting.wind.speedFactor,u_drop_rate:()=>this.setting.wind.dropRate,u_drop_rate_bump:()=>this.setting.wind.dropRateBump,u_rand_seed:()=>Math.random(),u_particles_res:()=>this.particleStateResolution,u_w:()=>this.particleStateResolution,u_h:()=>this.particleStateResolution,u_imgW:()=>this.imageW,u_imgH:()=>this.imageH,u_wind_Umin:()=>this.oneJSON.dataContent.U.min,u_wind_Vmin:()=>this.oneJSON.dataContent.V.min,u_wind_Umax:()=>this.oneJSON.dataContent.U.max,u_wind_Vmax:()=>this.oneJSON.dataContent.V.max,u_color_ramp:()=>this.colorRampTexture,u_wind:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.particleStateTexture0},NupdateFrag,this.particleStateTexture1)),o.push(this.createCommandOfCompute({u_channel0:()=>this.particleStateTexture1},cpTextureFS,this.particleStateTexture0)),i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[1]}),u_color_ramp:()=>this.colorRampTexture,u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.FBO1.getColorTexture(0),u_UVs:()=>!1,u_CMType:()=>1,u_UV_and:()=>this.getWMUV_and_or()},{vertexShader:uvsVS,fragmentShader:uvsFS},PrimitiveType.TRIANGLES,[this.FBO1],void 0,!0)),o.push(this.createCommandOfChannel(e,a,r,{},{vertexShader:quadVert,fragmentShader:cpFS},PrimitiveType.TRIANGLES,[this.FBO1],this.FBO2))):!this.loadDS||"cm"!=this.setting.cmType&&"cmBlue"!=this.setting.cmType&&"cmBlue6"!=this.setting.cmType?!this.loadDS||"cmWater"!=this.setting.cmType&&"cmWaterBlue12"!=this.setting.cmType&&"cmWaterBlue6"!=this.setting.cmType?this.loadDS&&"arrow"==this.setting.cmType?(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[1]}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:cmAVS,fragmentShader:cmAFS},PrimitiveType.TRIANGLES))):this.loadDS&&"w1"==this.setting.cmType?(r={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,r,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:uvsVS,fragmentShader:cmW1},PrimitiveType.TRIANGLES))):this.loadDS&&"w2"==this.setting.cmType?(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:uvsVS,fragmentShader:cmW2},PrimitiveType.TRIANGLES))):this.loadDS&&"w3"==this.setting.cmType?(r={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,r,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:uvsVS,fragmentShader:cmW3},PrimitiveType.TRIANGLES))):this.loadDS&&"ws1"==this.setting.cmType?(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:cmAVS,fragmentShader:cmWS1},PrimitiveType.TRIANGLES))):this.loadDS&&"ws2"==this.setting.cmType?(r={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,r,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},{vertexShader:cmAVS,fragmentShader:cmWS2},PrimitiveType.TRIANGLES))):this.updateOfListCommands=!0:(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},r={iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[1]}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1,iChannel0:()=>{if(void 0!==this.textures.grayNoise64x64)return this.textures.grayNoise64x64},iChannel1:()=>{if(void 0!==this.textures.pebbles)return this.textures.pebbles},u_water_wave_speed:()=>this.getCMWaterWaveSpeed(),u_water_wave_scale:()=>this.getCMWaterWaveScale(),u_water_wave_opacity:()=>this.getCMWaterWaveOpacity()},"cmWaterBlue6"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmWaterBlue6ColorFS},PrimitiveType.TRIANGLES)):"cmWaterBlue12"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmWaterBlue12ColorFS},PrimitiveType.TRIANGLES)):o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmWaterC12FS},PrimitiveType.TRIANGLES))):(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},r={iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex]).V.filterValue[1]}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1},"cmBLue"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmBlue},PrimitiveType.TRIANGLES)):"cmBLue6"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmBlue6},PrimitiveType.TRIANGLES)):o.push(this.createCommandOfChannel(e,a,i,r,{vertexShader:cmVS,fragmentShader:cmFS},PrimitiveType.TRIANGLES))),o}setUpdateOfListCommands(e=!0){this.updateOfListCommands=e}loadDataSource(e,t,a,i=!1){let r=this,o=new Image,n=(o.src=t,parseInt(a));o.onload=function(){r.DS[n]=new Texture({context:e,width:r.getCols(),height:r.getRows(),pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:o,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})}),!0===i&&(r.loadDS=!0)}}async createTextureFromUrl(t,e,a=0,i=!0){let r=new Image;r.src=e;const o=i?TextureWrap.REPEAT:TextureWrap.CLAMP_TO_EDGE;return await new Promise(e=>{r.onload=function(){e(new Texture({context:t,width:r.width,height:r.height,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:r,sampler:new Sampler({wrapS:o,wrapT:o})}))}})}async createTextureNearestFromUrl(t,e){let a=new Image;return a.src=e,await new Promise(e=>{a.onload=function(){e(new Texture({context:t,width:a.width,height:a.height,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:a,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})}))}})}async initData(e){this.loadDSing=!0;var t=this.oneJSON.data;if(this.textures.grayNoise64x64=await this.createTextureFromUrl(e,"/noise/grayNoise64x64.png"),this.textures.pebbles=await this.createTextureFromUrl(e,"/noise/pebbles.png"),2==Object.keys(this.GTS).length)this.DS=this.GTS.textureArray;else{for(var a in t)this.DS[parseInt(a)]=await this.createTextureNearestFromUrl(e,t[a].png);this.loadDS=!0,this.GTS.textureArray=this.DS,this.GTS.dataArray=t}}getCols(){return this.oneJSON.dem.cols}getRows(){return this.oneJSON.dem.rows}set_numParticles(e,t){if(!this.particleStateTexture0){var a=this.particleStateResolution=Math.ceil(Math.sqrt(t)),i=(this._numParticles=a*a,new Uint8Array(a*a*4));for(let e=0;e<a*a*4;e++)i[e]=Math.floor(256*Math.random());var t={context:e,width:a,height:a,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})},r=(this.particleStateTexture0=this.createTexture(t,i),this.particleStateTexture1=this.createTexture(t,i),new Float32Array(this._numParticles));for(let e=0;e<this._numParticles;e++)r[e]=e;this.particleIndices=r,this.particleIndexBuffer=this.createVAO(e,r)}}get_numParticles(){return this._numParticles}setColorRamp(e,t){this.colorRampTexture||(PixelFormat.RGBA,PixelDatatype.UNSIGNED_BYTE,t=this.getColorRamp(t),this.colorRampTexture=new Texture({context:e,width:16,height:16,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:{arrayBufferView:t}}))}getColorRamp(e){var t=document.createElement("canvas"),a=t.getContext("2d"),i=(t.width=256,t.height=1,a.createLinearGradient(0,0,256,0));for(const r in e)i.addColorStop(+r,e[r]);return a.fillStyle=i,a.fillRect(0,0,256,1),new Uint8Array(a.getImageData(0,0,256,1).data)}getIndexListOfCM(){return[this.getCurrentLevelByIndex(),this.oneJSON.data.length]}updateSource(e){this.visible=!1;for(var t of this.DS)t.destroy();this.init(e),this.setUpdateOfListCommands(!0)}setEnableDEM(e=!0){this.setting.z.dem=e}setEnableZbed(e=!0){this.setting.z.zbed_up=e}setEnableBaseZ(e=!0){this.setting.z.base_z_enable=e}setBaseZ(e=0){this.setting.z.base_z=e}setRateZbed(e=1){this.setting.z.RateZbed=e}setRateDEM(e=1){this.setting.z.RateDEM=e}getBaseZ(){return!0===this.setting.z.base_z_enable?this.setting.z.base_z:0}getRateZbed(){return!0===this.setting.z.zbed_up?this.setting.z.RateZbed:1}getEnableDEM(){return!0===this.setting.z.dem}getRateDEM(){return!0===this.getEnableDEM()?this.setting.z.RateDEM:1}setWMCounts(e=4096){this.setting.wind.counts=e}setWMFadeOpacity(e=.996){this.setting.wind.fadeOpacity=e}setWMSpeedFactor(e=.25){this.setting.wind.fadeOpacity=e}setWMDropRate(e=.003){this.setting.wind.dropRate=e}setWMDropRateBump(e=.01){this.setting.wind.dropRateBump=e}setWMDefaultRampColors(e){this.setting.wind.defaultRampColors=e}setFilterZbedGlobal(e=!0){this.oneJSON.dataContent.zbed.global_MM=e}setFilterUVGlobal(e=!0){this.oneJSON.dataContent.U.global_MM=e,this.oneJSON.dataContent.V.global_MM=e}setFilterZbedfilterKind(e=1){this.oneJSON.dataContent.zbed.filterKind=e}setFilterUVfilterKind(e=1){this.oneJSON.dataContent.U.filterKind=e,this.oneJSON.dataContent.V.filterKind=e}setEnableFilterZbed(e=!0){this.oneJSON.dataContent.zbed.filter=e}setEnableFilterUV(e=!0){this.oneJSON.dataContent.U.filter=e,this.oneJSON.dataContent.V.filter=e}setFilterZbedfilterValue(e=[]){this.oneJSON.dataContent.zbed.filterValue=e}setFilterUVfilterValue(e=[]){this.oneJSON.dataContent.U.filterValue=e,this.oneJSON.dataContent.V.filterValue=e}resize(e,t){"wind"==this.setting.cmType&&(t.updateOfListCommands=!0,t.resizeFlag=!0)}setWMPointSize(e=1){e=parseInt(e),this.setting.wind.pointSize=e}getWMPointSize(){return this.setting.wind.pointSize}setWMUV_and_or(e=!0){this.setting.wind.UV_and_or=e}getWMUV_and_or(){return this.setting.wind.UV_and_or}updateCM(e){}getCMWaterWaveSpeed(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.speed?this.setting.cmWater.speed:1}getCMWaterWaveScale(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.scale?this.setting.cmWater.scale:1}getCMWaterWaveOpacity(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.opacity?this.setting.cmWater.opacity:.105}}export{CCMBase,CCMSNW};
