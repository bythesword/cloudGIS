import{Matrix4,Texture,PrimitiveType,Buffer,BufferUsage,VertexArray,ShaderProgram,RenderState,DepthFunction,Pass,Cartesian3,DrawCommand,ComputeCommand,ShaderSource,Framebuffer,defined,PixelFormat,PixelDatatype,ComponentDatatype,Sampler,TextureMinificationFilter,TextureMagnificationFilter,TextureWrap,Cartesian2,Math as Math$1}from"cesium";class CCMBase{constructor(e,t,a=!1){for(var r in this.inputSetting=a,this.timer={timer:!1,timerIndex:0,currentLevel:0,play:{circle:0,interval:.5,circleCounts:0}},this.RofBoundingSphere=.1,void 0!==a.RofBoundingSphere&&(this.RofBoundingSphere=a.RofBoundingSphere),this.setting={z:{dem:!1,zbed_up:!1,base_z:0,base_z_enable:!1,RateZbed:1,RateDEM:1},wind:{fadeOpacity:.996,speedFactor:.25,dropRate:.003,dropRateBump:.01,defaultRampColors:{0:"#3288bd",.1:"#66c2a5",.2:"#abdda4",.3:"#e6f598",.4:"#fee08b",.5:"#fdae61",.6:"#f46d43",1:"#d53e4f"},counts:4096,pointSize:1,scaleOfUV:1,filterUVofZeroOfGB:!1,UV_and_or:!0},cmType:"cm",cmTarget:"zbed",visible:!0,framlines:!1},a)if("object"==typeof a[r]&&void 0!==this.setting[r])for(var i in a[r])this.setting[r][i]=a[r][i];else this.setting[r]=a[r];this.initFinish=!1,this.iTime=0,this.timestamp=(new Date).getTime(),this.CMs=[],this.frameState,this.listCommands=[],this.updateOfListCommands=!0,this.oneJSON={},this.resizeFlag=!1,this.visible=!0,this._modelMatrix=[],this.DS=[],this.oneJSON=t,this._modelMatrix=e,this._modelMatrix_inverse=Matrix4.inverse(this._modelMatrix,new Matrix4),this.onReSzie(),this.initFinish=this.init()}init(){return!0}onReSzie(){}resize(){}updateCM(e){}play(e=.5,r){if(this.stop(),0==e?e=this.getPlayIntervalTime():this.setPlayIntervalTime(e),this.timer.play.circleCounts=0,!1===this.timer.timer){let t=this,a=[];for(var i in this.oneJSON.data)a.push(i);t.timer.timerIndex=this.getCurrentLevelByIndex(),this.timer.timer=setInterval(function(){if(t.updateCM(t.timer.timerIndex),"function"==typeof r&&r(t.getCurrentLevelByIndex(),t),t.timer.timerIndex>=a.length-1){t.timer.timerIndex=0;var e=t.getPlayCircle();if(0!==e&&e==t.timer.play.circleCounts)return t.stop(),void(t.timer.play.circleCounts=0);t.timer.play.circleCounts++}else t.timer.timerIndex++;t.setCurrentLevelByIndex(t.timer.timerIndex)},1e3*e)}}stop(){clearInterval(this.timer.timer),this.timer.timer=!1}getCurrentLevelByIndex(){return this.timer.currentLevel}setCurrentLevelByIndex(e=0){this.timer.currentLevel=e,this.updateCM(e)}setCMType(e="cm",t="zbed"){this.setting.cmType=e,this.setting.cm=t,this.setUpdateOfListCommands(!0)}getCMType(){return{cmType:this.setting.cmType,cm:this.setting.cm}}setPlayCircle(e=0){this.timer.play.circle=e}getPlayCircle(){return this.timer.play.circle}setPlayIntervalTime(e=.5){this.timer.play.interval=e}getPlayIntervalTime(){return this.timer.play.interval}updateSource(e){this.visible=!1,this.init(e),this.setUpdateOfListCommands(!0)}getWorldBoxObject(){return this.CMs}getCommands(e,t){if(!0===this.updateOfListCommands){this.listCommands=[];for(var a of this.getWorldBoxObject()){a=this.getTFL(e,a,t);0<a.length&&this.listCommands.push(a)}0<this.listCommands.length&&(this.updateOfListCommands=!1)}return this.listCommands}getTFL(e,t,a){t.position,t.uv,t.data[t.cmIndex[0]][t.cmIndex[1]],t.indices;return[]}update(e){if(void 0===this._pickId&&(this._pickId=e.context.createPickId({primitive:this,id:"ccm_"+new Date})),void 0===this.frameState&&(this.frameState=e),this.visible&&this.initFinish)for(var t of this.getCommands(e,this._modelMatrix))for(var a of t)e.commandList.push(a)}getFullscreenAtt(){return{position:[-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],uv:[0,0,1,0,1,1,0,1,1,1,0,1]}}createTextures(e){let t=this;!1!==this.channel&&(this.image=new Image,this.image.src="/public/leaves.jpg",this.image.onload=()=>{t.texture=new Texture({context:e,source:t.image})})}createCommandOfChannel(a,r,i,o,_,n=PrimitiveType.TRIANGLES,t=[],u=void 0,l=!1){var v=o;if("object"==typeof t)for(let e=0;e<t.length;e++)"object"==typeof t[e]&&(v["u_channel"+e]=()=>t[e].getColorTexture(0));if("object"!=typeof i)return console.warn("attributes 需要2个属性"),!1;{var c,s=[],m={};for(c in i){var f=i[c],d=JSON.parse(JSON.stringify(f));d.vertexBuffer=Buffer.createVertexBuffer({usage:BufferUsage.STATIC_DRAW,typedArray:new Float32Array(f.vertexBuffer),context:a.context}),m[c]=d.index,s.push(d)}o=new VertexArray({context:a.context,attributes:s}),_=ShaderProgram.fromCache({context:a.context,vertexShaderSource:_.vertexShader,fragmentShaderSource:_.fragmentShader,attributeLocations:m});let e={},t=(e=new RenderState("undefined"==u?{depthTest:{enabled:!1}}:{cull:{enabled:!1},depthTest:{enabled:!1,func:DepthFunction.LESS}}),Pass.OPAQUE);t=!0===l?Pass.TRANSLUCENT:Pass.OPAQUE;new Cartesian3;return void 0!==this.setting.coordinate&&Cartesian3.fromDegrees(this.setting.coordinate[0],this.setting.coordinate[1],this.setting.coordinate[2]),new DrawCommand({modelMatrix:r,vertexArray:o,shaderProgram:_,uniformMap:v,renderState:e,framebuffer:u,pass:t,primitiveType:n})}}createCommandOfCompute(e,t,a){return new ComputeCommand({owner:this,fragmentShaderSource:new ShaderSource({sources:[t]}),uniformMap:e,outputTexture:a,persists:!0})}createFramebufferFromTexture(e,t){var a=this.createRenderingTextures(e);return new Framebuffer({context:e,colorTextures:[t],depthTexture:a.Depth})}createFramebuffer(e){var t=this.createRenderingTextures(e);return new Framebuffer({context:e,colorTextures:[t.Color],depthTexture:t.Depth})}createVAO(e,t){return Buffer.createVertexBuffer({usage:BufferUsage.STATIC_DRAW,typedArray:new Float32Array(t),context:e})}createTexture(e,t){var a;return defined(t)&&((a={}).arrayBufferView=t,e.source=a),new Texture(e)}createRenderingTextures(e){var t={context:e,width:e.drawingBufferWidth,height:e.drawingBufferHeight,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE},e={context:e,width:e.drawingBufferWidth,height:e.drawingBufferHeight,pixelFormat:PixelFormat.DEPTH_COMPONENT,pixelDatatype:PixelDatatype.UNSIGNED_INT};return{Color:this.createTexture(t),Depth:this.createTexture(e)}}}let drawVert=` precision mediump float;

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
    // vec4 color = texture2D(u_channel0, vec2(fract((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w),//0.0-1.0之间即可，可以再乘除其他系数
    // floor(a_index / u_particles_res  ) / u_h));//同上 9.0 等，随意

    //0.0-1.0之间即可，可以再乘除其他系数
    //channel0=PST1
vec4 color = texture2D(u_channel0, vec2((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w, 1.0 - floor(a_index / u_particles_res) / u_h));//同上 9.0 等，随意
    // vec4 color = texture2D(u_channel0, vec2((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w, floor(a_index / u_particles_res) / u_h));//同上 9.0 等，随意
    // decode current particle position from the pixel's RGBA value
    //位置，index，update.GLSL
    //是png中的位置，vec2 0.0-1.0之间的
    v_particle_pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a);

    iii = a_index;
    ccc = color.ba;

    gl_PointSize = u_pointSize;//1.0;//

    //从公式看，x0.0-1.0,y=-1.0-0.0
    //是点的输出位置
    //无系数，是右上的1/4，upside down 
    //end,左右扩张，上下对调+扩张
    // gl_Position = vec4(2.0 * v_particle_pos.x - 1.0,  1.0-2.0 * v_particle_pos.y, 0, 1);//输出到纹理的问题？

    //目前
    gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 2.0 * v_particle_pos.y - 1.0, 0, 1);//输出到纹理的问题？
    // gl_Position = vec4(v_particle_pos.x, v_particle_pos.y, 0, 1);//输出到纹理的问题？
    // gl_Position = vec4(v_particle_pos, 0, 1);//输出到纹理的问题？

}`,drawFrag=`precision mediump float;

uniform sampler2D u_wind;
uniform vec2 u_DS_XY;
// uniform vec2 u_wind_min;
// uniform vec2 u_wind_max;
uniform float u_wind_Umin;
uniform float u_wind_Vmin;
uniform float u_wind_Umax;
uniform float u_wind_Vmax;
uniform sampler2D u_color_ramp;

//20231221
uniform vec4 u_xy_mm;//wind map fix ,other shader in js don't 

varying vec2 v_particle_pos;
varying vec2 ccc;
varying float iii;

void main() {
    //20231226 start
    vec2 mmx = vec2(u_xy_mm.x, u_xy_mm.z);
    vec2 mmy = vec2(u_xy_mm.y, u_xy_mm.w);
    // float u = (mix(mmx.x, mmx.y, v_particle_pos.x) - mmx.x) / (mmx.y - mmx.x);
    // float v = (mix(mmy.x, mmy.y, v_particle_pos.y) - mmy.x) / (mmy.y - mmy.x);
    float u = ((mmx.y - mmx.x) * v_particle_pos.x + mmx.x) / u_DS_XY.x;
    float v = ((mmy.y - mmy.x) * v_particle_pos.y + mmy.x) / u_DS_XY.y;
    //20231226 end

    vec2 u_wind_min = vec2(u_wind_Umin, u_wind_Vmin);
    vec2 u_wind_max = vec2(u_wind_Umax, u_wind_Vmax);

    // 水平速度为红色，垂直速度为绿色。
    // vec2 puv = texture2D(u_wind, vec2(v_particle_pos.x, v_particle_pos.y)).gb;

    //20231221 change ,fix range of MM
    vec2 puv = texture2D(u_wind, vec2(u, v)).gb;
    //20231212 end
    vec2 velocity;
    // if(puv.x == 0.0 && puv.y == 0.0)
    //     velocity = vec2(0);
    // else
        velocity = mix(u_wind_min, u_wind_max, puv);//速度，在max，min，在png的颜色值中
    float speed_t = length(velocity) / length(u_wind_max);

////uv 的0.0 为真实0值时的设置，由于
    // if(puv.x == 0.0 && puv.y == 0.0) {
    //     discard;
    // }

    float zeroU = (mix(u_wind_Umin, u_wind_Umax, 0.0) -u_wind_Umin) / (u_wind_Umax - u_wind_Umin);
    float zeroV = (mix(u_wind_Vmin, u_wind_Vmax, 0.0) - u_wind_Vmin) / (u_wind_Vmax - u_wind_Vmin);
    if(abs(puv.x - zeroU) < 0.0001 && abs(puv.y - zeroV) < 0.0001) {
        discard;
    }
    // color ramp is encoded in a 16x16 texture
    //速度值的颜色
    vec2 ramp_pos = vec2(fract(16.0 * speed_t), floor(16.0 * speed_t) / 16.0);

    gl_FragColor = texture2D(u_color_ramp, 1.0 - ramp_pos);

    // if(v_particle_pos.x>0.5)
    //     gl_FragColor = vec4(1.0,.0,.0,1.);
    // else 
    //     gl_FragColor = vec4(0.0,1.0,.0,1.);
}
`,quadVert=`precision mediump float;

// 2 3
// 0 1
// 0.0，0.0 -->1.0，1.0
attribute vec2 position;//两个三角形，六个点，六次执行

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = position;
    //与screen同步修改
    // gl_Position = vec4( position , 0, 1);//-1.0，1.0,
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);//-1.0，1.0,
    // gl_Position = vec4(1.0 - 2.0 * position, 0, 1);//从0.0，1.0，变换到1.0，-1.0，对调,
}
`,opFrag=`precision mediump float;

// uniform sampler2D u_screen;
uniform sampler2D u_channel0;
uniform float u_opacity;

varying vec2 v_tex_pos;

uniform sampler2D u_wind;

void main() {
    //原始的，UV对调
    //vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);//纹理与GLSL做，1.0-xy，一一对应的
    //修改后的，减去了UV对调，同步需要修改，vs，改成-1.0->1.0
    vec4 color = texture2D(u_channel0, v_tex_pos);//纹理与GLSL做，1.0-xy，一一对应的

    // // a hack to guarantee opacity fade out even with a value close to 1.0
    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);//是否衰减，以及衰减多少
    // gl_FragColor.a = 0.6;
    // gl_FragColor=vec4(1);
    // vec4 wind = texture2D(u_wind, vec2(v_tex_pos.x,  v_tex_pos.y));//纹理与GLSL做，1.0-xy，一一对应的

    // if(gl_FragColor.a == 0.0 && u_opacity == 1.)
    //     gl_FragColor = wind;
}
`,NupdateFrag=`precision highp float;

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

uniform float U_scaleOfUV;
uniform bool u_filterUVofZeroOfGB;

varying float v_WHT;

// varying vec2 v_tex_pos;
varying vec2 v_textureCoordinates;

//20231226
uniform vec2 u_DS_XY;
uniform vec4 u_xy_mm;//wind map fix ,other shader in js don't 

// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

// wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
//风速查找；使用基于4个相邻像素的手动双线性滤波实现平滑插值

vec2 lookup_wind(vec2 uv) {
    // return texture2D(u_wind, uv).gb; // lower-res hardware filtering

    //20231221 start
    vec2 mmx = vec2(u_xy_mm.x, u_xy_mm.z);
    vec2 mmy = vec2(u_xy_mm.y, u_xy_mm.w);
    // float u = (mix(mmx.x, mmx.y, v_particle_pos.x) - mmx.x) / (mmx.y - mmx.x);
    // float v = (mix(mmy.x, mmy.y, v_particle_pos.y) - mmy.x) / (mmy.y - mmy.x);
    float u = ((mmx.y - mmx.x) * uv.x + mmx.x) / u_DS_XY.x;
    float v = ((mmy.y - mmy.x) * uv.y + mmy.x) / u_DS_XY.y;
    //20231221 end
    uv.x = u;
    uv.y = v;

    // vec2 u_wind_res = vec2(u_w, u_h);
    vec2 u_wind_res = vec2(u_imgW, u_imgH);
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(vec2(uv.x, uv.y) * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = texture2D(u_wind, vc).gb;
    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).gb;
    vec2 bl = texture2D(u_wind, vc + vec2(0, -px.y)).gb;
    vec2 br = texture2D(u_wind, vc + vec2(px.x, -px.y)).gb;
    if(u_filterUVofZeroOfGB == true) {
        if(tl.x == 0.0) {
            tl.x = (mix(u_wind_Umin, u_wind_Umax, 0.0) - u_wind_Umin) / (u_wind_Umax - u_wind_Umin);
            // tl.x= (tl.x*255.0-1.0)
        }
        if(tl.y == 0.0) {
            tl.y = (mix(u_wind_Vmin, u_wind_Vmax, 0.0) - u_wind_Vmin) / (u_wind_Vmax - u_wind_Vmin);
        }
        if(tr.x == 0.0) {
            tr.x = (mix(u_wind_Umin, u_wind_Umax, 0.0) - u_wind_Umin) / (u_wind_Umax - u_wind_Umin);
        }
        if(tr.y == 0.0) {
            tr.y = (mix(u_wind_Vmin, u_wind_Vmax, 0.0) - u_wind_Vmin) / (u_wind_Vmax - u_wind_Vmin);
        }
        if(br.x == 0.0) {
            br.x = (mix(u_wind_Umin, u_wind_Umax, 0.0) - u_wind_Umin) / (u_wind_Umax - u_wind_Umin);
        }
        if(br.y == 0.0) {
            br.y = (mix(u_wind_Vmin, u_wind_Vmax, 0.0) - u_wind_Vmin) / (u_wind_Vmax - u_wind_Vmin);
        }
        if(bl.x == 0.0) {
            bl.x = (mix(u_wind_Umin, u_wind_Umax, 0.0) - u_wind_Umin) / (u_wind_Umax - u_wind_Umin);
        }
        if(bl.y == 0.0) {
            bl.y = (mix(u_wind_Vmin, u_wind_Vmax, 0.0) - u_wind_Vmin) / (u_wind_Vmax - u_wind_Vmin);
        }
        tl = (tl * 255.0 - 1.0) / 254.0;
        tr = (tr * 255.0 - 1.0) / 254.0;
        bl = (bl * 255.0 - 1.0) / 254.0;
        br = (br * 255.0 - 1.0) / 254.0;
    }
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
    vec2 u_wind_min = vec2(u_wind_Umin, u_wind_Vmin) * U_scaleOfUV;
    vec2 u_wind_max = vec2(u_wind_Umax, u_wind_Vmax) * U_scaleOfUV;
    vec2 v_tex_pos = v_textureCoordinates;
    float x = v_tex_pos.x * u_w;
    float y = (1.0 - v_tex_pos.y) * u_h;//PST的UV
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
        vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
        // vec2 velocity = mix(vec2(-21.32, -21.57), vec2(26.8, 21.42), lookup_wind(pos));

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
   // gl_FragColor.a=0.51
    // vec4 wind = texture2D(u_wind, vec2(v_tex_pos.x,  v_tex_pos.y));//纹理与GLSL做，1.0-xy，一一对应的

    // if(gl_FragColor.a == 0.0 && u_toscreen == true)
    //     gl_FragColor = wind;
}`,cpTextureFS=`uniform sampler2D u_channel0;

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

//20231221
uniform vec4 u_xy_mm;//wind map fix ,other shader in js don't 

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
    // if(a_tp == 0.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(0);
    // } else if(a_tp == 1.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(1, 0);

    // } else if(a_tp == 2.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(1);
    // } else if(a_tp == 3.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(0);
    // } else if(a_tp == 4.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(1, 1);
    // } else if(a_tp == 5.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(0, 1);
    // }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    // v_uv = vec2((col + 0.0) / cols, (row + 0.0) / rows);
    v_uv = vec2((col - u_xy_mm.x) / (u_xy_mm.z - u_xy_mm.x), (row - u_xy_mm.y) / (u_xy_mm.w - u_xy_mm.y));

    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
        v_dem = 0.0;
    }

    // v_uv = vec2(col / u_DS_XY.x, row / u_DS_XY.y);//IMG 使用
    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a)), 1.0);

    // vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r) + rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a) * 3., 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);

}
`,uvsFS=`uniform vec2 u_U_mm;
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
    // if(color == vec4(0))
    //     discard;
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
    if(v_dem == 0.0) {
        discard;
        gl_FragColor = vec4(0, 0, 0, 0);
        return ;
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
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
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

}`,cmBlue6=`uniform sampler2D u_DS;
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
        discard;
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

}`,cmVS=`precision mediump float;
attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

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
varying float test1;
varying vec2 v_cm_UV00;

uniform sampler2D u_DS;
uniform sampler2D u_DS_new;

varying vec3 v_cm_r_CMAA;
varying vec3 v_cm_g_CMAA;
varying vec3 v_cm_b_CMAA;
varying vec3 v_cm_a_CMAA;
void main() {
    // v_uv = a_uv;

    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;
    vec4 rgba4;
//34
//12
//124 one
//143 two
    vec2 a = vec2(0);
    vec2 b = vec2(0);
    vec2 c = vec2(0);
    vec2 d = vec2(0);
    if(a_tp == 0.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col - 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(1, 0);
    } else if(a_tp == 2.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(1, 0);
    } else if(a_tp == 5.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(1);
    }
    // float zbed_down=-.60;
    // if(rgba1.a == 0.0 ) {
    //     rgba1.r=zbed_down;
    // }
    // if(rgba2.a == 0.0 ) {
    //     rgba2.r=zbed_down;
    // }
    // if(rgba3.a == 0.0 ) {
    //     rgba3.r=zbed_down;
    // }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_r_CMAA = vec3(texture2D(u_DS_new, a).r, texture2D(u_DS_new, b).r, texture2D(u_DS_new, c).r);
    v_cm_g_CMAA = vec3(texture2D(u_DS_new, a).g, texture2D(u_DS_new, b).g, texture2D(u_DS_new, c).g);
    v_cm_b_CMAA = vec3(texture2D(u_DS_new, a).b, texture2D(u_DS_new, b).b, texture2D(u_DS_new, c).b);
    v_cm_a_CMAA = vec3(texture2D(u_DS_new, a).a, texture2D(u_DS_new, b).a, texture2D(u_DS_new, c).a);

    // v_dem_CMAA = texture2D(u_DS_new, vec2(col/ u_DS_XY.x, row / u_DS_XY.y)).r;
    test1 = 1.0;

    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0 || rgba4.a == 0.0) {
        v_dem = 0.0;
    }

    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z = 0.;
    // if(u_dem_enable == true)
    //     // z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
    //     z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? 0.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));

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

uniform bool u_filterUVofZeroOfGB;
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
    float s1 = step(d1, -0.35 + 0.1 * length(v));//箭头大小

    float d2 = sdBox(uv - vec2(0., -h * .1), vec2(0.05 + 0.05 * length(v), 0.2 + 0.2 * length(v)));
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
    float a_sub_a=0.0001;
    if(v_dem == 0.0)
        discard;
    float zeroU = (mix(u_U_mm.x, u_U_mm.y, 0.0) - u_U_mm.x) / (u_U_mm.y - u_U_mm.x);
    float zeroV = (mix(u_V_mm.x, u_V_mm.y, 0.0) - u_V_mm.x) / (u_V_mm.y - u_V_mm.x);
    //0为zero时，而非插值结果时，与数据格式相关
    if(u_filterUVofZeroOfGB == true) {
        if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
            discard;
    } else {

        if(abs(v_cm_UV00.x - zeroU) < a_sub_a && abs(v_cm_UV00.y - zeroV) < a_sub_a) {
            discard;
        }
    }

    vec2 uv000 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);

    //0为zero时，而非插值结果时，与数据格式相关
    if(u_filterUVofZeroOfGB == true) {
        if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0) {
            uv000 = vec2(0);
        }
    } else {
        if(abs(v_cm_UV00.x - zeroU) < a_sub_a && abs(v_cm_UV00.y - zeroV) < a_sub_a) {
            uv000 = vec2(0);
        }
    }
    // vec3 CM = sqrt(exp2(v_cm_U) + exp2(v_cm_V));
    // vec3 CM = vec3(sqrt(exp2(v_cm_U.x) + exp2(v_cm_V.x)), sqrt(exp2(v_cm_U.y) + exp2(v_cm_V.y)), sqrt(exp2(v_cm_U.z) + exp2(v_cm_V.z)));
    vec3 CM = vec3(sqrt(v_cm_U.x * v_cm_U.x + v_cm_V.x * v_cm_V.x), sqrt(v_cm_U.y * v_cm_U.y + v_cm_V.y * v_cm_V.y), sqrt(v_cm_U.z * v_cm_U.z + v_cm_V.z * v_cm_V.z));

    // vec3 CM = vec3(1.0, 1.0, 0.0);
    vec2 uv1 = (v_uv * 4. - (1.95) * 1.0) / 1.0;

    // float vector1 = sdVectorArrow(uv1, xy1);
    float vector1 = sdVectorArrow(uv1, uv000 / 0.5);

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
`,cmflVS=`precision mediump float;
attribute float a_index;
attribute float a_tp;

uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;

varying vec4 rgba;
varying vec2 v_uv;
varying float v_dem;
void main() {
    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;
    vec4 rgba4;
    v_dem = 1.0;
//34
//12
//124 one
//143 two
    vec2 a = vec2(0);
    vec2 b = vec2(0);
    vec2 c = vec2(0);
    vec2 d = vec2(0);
    if(a_tp == 0.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
            v_dem = 0.0;
        }

    } else if(a_tp == 1.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col - 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba2.a == 0.0) {
            v_dem = 0.0;
        }

    } else if(a_tp == 2.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba3.a == 0.0) {
            v_dem = 0.0;
        }

    }

    if(rgba1.a == 0.0 && rgba2.a == 0.0 && rgba3.a == 0.0 && rgba4.a == 0.0) {
        v_dem = 0.0;
    }

    // rgba = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z = 0.;
    // if(u_dem_enable == true)
    //     // z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
    //     z = u_dem_base;

    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, z, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);
}
`,framelineFS=`// varying vec4 rgba;
// varying vec2 v_uv;
varying float v_dem;
void main() {
    if(v_dem == 0.0)
        discard;
    gl_FragColor = vec4(1, 0, 0, 1);

}`,cmWaterC12FS=`precision mediump float;
// uniform sampler2D u_DS_new;
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

varying vec3 v_cm_r_CMAA;
varying vec3 v_cm_g_CMAA;
varying vec3 v_cm_b_CMAA;
varying vec3 v_cm_a_CMAA;

varying float test1;

uniform bool u_toscreen;

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

uniform bool u_enable_CMAA;

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
    vec4 fragColor = vec4(0);
    if(vv < 0.0) {
        fragColor = vec4(0.3);
        discard;
    } else if(vv == 0.0) {
        if(u_enable_CMAA == true) {
            if(v_dem == 0.0) {
                discard;
                gl_FragColor = vec4(0);
            // return;
            }
        }
        fragColor = vec4(0.5);
        discard;
    } else if(vv <= 0.08333333333333333) {
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
        fragColor = vec4(1., 1.0, 1., 1.0);
    }

    return fragColor;
}
vec4 CMC6(vec2 uv, vec3 CM) {
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
    // vec4 fragColor = vec4(1, 0.6, 0, 1.0);
    vec4 fragColor = vec4(0);
    if(vv < 0.0) {
        fragColor = vec4(0.3);
        discard;
    } else if(vv == 0.0) {
        if(u_enable_CMAA == true) {
            if(v_dem == 0.0) {
                discard;
                gl_FragColor = vec4(0);
            // return;
            }
        }
        fragColor = vec4(0.5);
        discard;
    } else if(vv <= 0.1 && vv >= 0.) {
        // fragColor = vec4(float(20.0 / 255.0), float(20.0 / 255.0), float(246.0 / 255.0), 1.0);
        fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
    } else if(vv > 0.1 && vv <= 0.15) {
        fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
    } else if(vv > 0.15 / 6.0 && vv <= 0.27) {
        fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
    } else if(vv > 0.27 && vv <= 0.4) {
        fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
    } else if(vv > 0.4 && vv <= 0.6) {
        fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
    } else if(vv > 0.6) {
        fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
    } 
    // else if(vv > 0.6) {
    //     fragColor = vec4(0, 1, 0, 1.0);
    // }
    return fragColor;
}

void main() {
    // if( v_cm_zbed_CMAA[0] == 1.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    // }
    // return;

    if(u_enable_CMAA == true) {
        if(v_dem == 0.0) {
            // discard;
            gl_FragColor = vec4(0);
            // return;
        }
    } else if(v_dem == 0.0) {
        discard;
        // gl_FragColor = vec4(0);
        return;
    }
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

    // int n = 12;
    // float w1 = (1.0 - v_uv.x);
    // float w2 = (v_uv.x - v_uv.y);
    // float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    // float v;

//使用数值做CM
    cm1 = v_cm_r_CMAA[0];
    cm2 = v_cm_r_CMAA[1];
    cm3 = v_cm_r_CMAA[2];
//end

//使用未补偿的算法的插值回来的数值
    // float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
    // float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
    // float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);

    // cm1 = cmP1;
    // cm2 = cmP2;
    // cm3 = cmP3;
//end

    //test only //有波纹
    // gl_FragColor = CMC6(v_uv, vec3(cm1, cm2, cm3));                      
    //end 

//验证补偿数据使用    
    // float vm1 = v_cm_g_CMAA[0];
    // float vm2 = v_cm_g_CMAA[1];
    // float vm3 = v_cm_g_CMAA[2];
    // //1vs3
    // if(vm1 > 99.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    //     return;
    // }
    // //2vs2
    // if(vm1 > 89.0) {
    //     gl_FragColor = vec4(1, 0.5, 0, 1);
    //     return;
    // }
    // //1vs1
    // if(vm1 > 79.0) {
    //     gl_FragColor = vec4(1, 1, 0, 1);
    //     return;
    // }
    // //超次
    // if(vm1 > 69.0) {
    //     gl_FragColor = vec4(0, 0, 0, 1);
    //     return;
    // }

    // //超限
    // if(vm1 > 49.0) {
    //     gl_FragColor = vec4(0, 1, 0, 1);
    //     return;
    // }

    // return;

//end
    //以下为水效果代码
    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    //取CM色值
    vec4 background = CMC6(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}`,cmWaterBlue12ColorFS=`// uniform sampler2D u_DS;
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

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

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

    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}`,cmWaterBlue6ColorFS=`// uniform sampler2D u_DS;
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

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

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
    // if(u_filter.x == true) {
        // if(u_filterKind.x == 1) {
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
        // } else if(u_filterKind.x == 2) {
        //     v = w1 * cm1 + w2 * cm2 + w3 * cm3;
        //     if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
        //         gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        //         flag_break = true;
        //         discard;
        //         return;
        //     }
        // }
    // }
    cm1=cmP1;
    cm2=cmP2;
    cm3=cmP3;

    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = .0810;//* opacity;;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}`,cmWaterBlue6ABS1FS=`precision mediump float;
// uniform sampler2D u_DS_new;
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

varying vec3 v_cm_r_CMAA;
varying vec3 v_cm_g_CMAA;
varying vec3 v_cm_b_CMAA;
varying vec3 v_cm_a_CMAA;

varying float test1;

uniform bool u_toscreen;

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

uniform bool u_enable_CMAA;

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
    vec4 fragColor = vec4(0);

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
        fragColor = vec4(1., 1.0, 1., 1.0);
    }

    return fragColor;
}
vec4 CMC6(vec2 uv, vec3 CM) {
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
    // vec4 fragColor = vec4(1, 0.6, 0, 1.0);
    vec4 fragColor = vec4(0);
    if(vv < 0.0) {
        fragColor = vec4(0.3);
        discard;
    } else if(vv == 0.0) {
        if(u_enable_CMAA == true) {
            if(v_dem == 0.0) {
                discard;
                gl_FragColor = vec4(0);
            // return;
            }
        }
        fragColor = vec4(0.5);
        discard;
    } else if(vv <= 0.1 && vv >= 0.) {
        // fragColor = vec4(float(20.0 / 255.0), float(20.0 / 255.0), float(246.0 / 255.0), 1.0);
        fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
    } else if(vv > 0.1 && vv <= 0.15) {
        fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
    } else if(vv > 0.15 / 6.0 && vv <= 0.27) {
        fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
    } else if(vv > 0.27 && vv <= 0.4) {
        fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
    } else if(vv > 0.4 && vv <= 0.6) {
        fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
    } else if(vv > 0.6) {
        fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
    } 
    // else if(vv > 0.6) {
    //     fragColor = vec4(0, 1, 0, 1.0);
    // }
    return fragColor;
}

void main() {
    // if( v_cm_zbed_CMAA[0] == 1.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    // }
    // return;

    if(u_enable_CMAA == true) {
        if(v_dem == 0.0) {
            // discard;
            gl_FragColor = vec4(0);
            // return;
        }
    } else if(v_dem == 0.0) {
        discard;
        // gl_FragColor = vec4(0);
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

    cm1 = v_cm_r_CMAA[0];
    cm2 = v_cm_r_CMAA[1];
    cm3 = v_cm_r_CMAA[2];

    // float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
    // float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
    // float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);

    // cm1 = cmP1;
    // cm2 = cmP2;
    // cm3 = cmP3;

    // gl_FragColor = CMC6(v_uv, vec3(cm1, cm2, cm3));                      //有波纹 

    // float vm1 = v_cm_g_CMAA[0];
    // float vm2 = v_cm_g_CMAA[1];
    // float vm3 = v_cm_g_CMAA[2];
    // //1vs3
    // if(vm1 > 99.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    //     return;
    // }
    // //2vs2
    // if(vm1 > 89.0) {
    //     gl_FragColor = vec4(1, 0.5, 0, 1);
    //     return;
    // }
    // //1vs1
    // if(vm1 > 79.0) {
    //     gl_FragColor = vec4(1, 1, 0, 1);
    //     return;
    // }
    // //超次
    // if(vm1 > 69.0) {
    //     gl_FragColor = vec4(0, 0, 0, 1);
    //     return;
    // }

    // //超限
    // if(vm1 > 49.0) {
    //     gl_FragColor = vec4(0, 1, 0, 1);
    //     return;
    // }

    // return;

    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC6(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}`,cmWaterBlue6ABS1NofixFS=`uniform sampler2D u_DS_new;
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
varying vec3 v_cm_zbed_CMAA;
// varying vec3 v_cm_U;
// varying vec3 v_cm_V;
varying float v_dem;
varying float v_dem_CMAA;

uniform bool u_toscreen;

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

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
    vec4 fragColor = vec4(0);
    if(v < 0.0) {
        discard;
    }
    // if(vv == 0.) {
    //     fragColor = vec4(1, 1, 0, 1.0);
    // } else
     if(vv <= 0.1 && vv >= 0.) {
        fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
    } else if(vv > 0.1 && vv <= 0.15) {
        fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
    } else if(vv > 0.15 / 6.0 && vv <= 0.27) {
        fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
    } else if(vv > 0.27 && vv <= 0.4) {
        fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
    } else if(vv > 0.4 && vv <= 0.6) {
        fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
    } else if(vv > 0.6) {
        fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
    }
    return fragColor;
}

void main() {

     if(v_dem == 0.0) {
    // if(v_dem_CMAA == 0.0) {    
        discard;
        gl_FragColor = vec4(0, 0, 0, 1);
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

    float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
    float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
    float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);

    // float cmP1 = v_cm_zbed_CMAA[0];
    // float cmP2 = v_cm_zbed_CMAA[1];
    // float cmP3 = v_cm_zbed_CMAA[2];

    // v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
    // if(v <= -5.0) {
    //     discard;
    // }
    //过滤，作废
    // if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
    //     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    //     flag_break = true;
    //     discard;
    //     return;
    // }

    cm1 = cmP1;
    cm2 = cmP2;
    cm3 = cmP3;
    // gl_FragColor = CMC(v_uv, vec3(cmP1, cmP2, cmP3));                      //有波纹 
    // return;
    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = .0810;//* opacity;;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}`,CNAACPFS=`uniform sampler2D u_channel0;
uniform float u_Umin;
uniform float u_Vmin;
uniform float u_Umax;
uniform float u_Vmax;

uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

varying vec2 v_textureCoordinates;

void main() {
    vec2 v_tex_pos = v_textureCoordinates;
    vec4 color = texture2D(u_channel0, v_tex_pos);

    // vec2 min = vec2(u_Umin, u_Vmin);
    // vec2 max = vec2(u_Umax, u_Vmax);
    // vec2 uv_one = mix(min, max, (color.gb * 255.0 - 1.0) / 254.0);
    // if(color.g == 0.0)
    //     uv_one.x = 0.0;
    // if(color.b == 0.0)
    //     uv_one.y = 0.0;
    // float zbed = mix(u_zbed_mm.x, u_zbed_mm.y, color.r);
    // float dem = mix(u_dem_mm.x, u_dem_mm.y, (color.a * 255.0 - 1.0) / 254.0);

    // if(color.a == 0.0) {
    //     dem = 0.0;
    // } else {
    //     dem = 1.0;
    // }
    // gl_FragColor = vec4(zbed, uv_one.x, uv_one.y, dem);
    gl_FragColor = color;
}`,CMAA2=`precision highp float;

uniform sampler2D u_channel0;
uniform bool u_origin;

uniform float u_Umin;
uniform float u_Vmin;
uniform float u_Umax;
uniform float u_Vmax;

uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform float u_w;
uniform float u_h;

uniform float u_round;
uniform float u_limit;

// varying vec2 v_tex_pos;
varying vec2 v_textureCoordinates;

float value_limit = 0.1;

vec4 one_vs_three(vec4 a, vec4 b, vec4 c, vec4 d) {
     float rate=15.0;
    float fr, fg, fb, fa;
    float alpha = b.a;
    if(alpha < c.a) {
        alpha = c.a;
    }
    if(alpha < d.a) {
        alpha = d.a;
    }

    fr = (b.r + c.r + d.r) / rate - value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = (b.g + c.g + d.g) / rate;
    fb = (b.b + c.b + d.b) / rate;

    fa = alpha + 1.0;

    //    gl_FragColor.rgb = u_rate3 * gl_FragColor.rgb + u_limit;
    return vec4(fr, fg, fb, fa);
}

vec4 two_vs_two(vec4 a, vec4 B, vec4 C, vec4 D) {
    float rate=28.0;
    vec4 b, c, d;
    if(B.a == 0.0) {
        b = C;
        c = D;
    }
    if(C.a == 0.0) {
        b = B;
        c = D;
    }
    if(D.a == 0.0) {
        b = B;
        c = C;
    }

    float fr, fg, fb, fa;
    float alpha = b.a;
    if(alpha < c.a) {
        alpha = c.a;
    }

    fr = (b.r + c.r) / rate - value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = (b.g + c.g) / rate;
    fb = (b.b + c.b) / rate;
    fa = alpha + 1.0;

    return vec4(fr, fg, fb, fa);
}
vec4 one_vs_one(vec4 a, vec4 B, vec4 C, vec4 D) {
    float rate=50.0;
    vec4 one;
    if(B.a != 0.0) {
        one = B;
    }
    if(C.a != 0.0) {
        one = C;
    }
    if(D.a == 0.0) {
        one = D;
    }

    float fr, fg, fb, fa;
    float alpha = one.a;

    fr = (one.r) / rate- value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = one.g / rate;
    fb = one.b / rate;
    fa = alpha + 1.0;

    return vec4(fr, fg, fb, fa);
}

void main() {
    // gl_FragColor = vec4(1000.0);
    // return;
    /*
    7 8 9
    4 5 6
    1 2 3

    c d
    a b
    */
    vec4 rgba0 = vec4(0);
    vec4 rgba1 = vec4(0);
    vec4 rgba2 = vec4(0);
    vec4 rgba3 = vec4(0);
    vec4 rgba4 = vec4(0);
    vec4 rgba5 = vec4(0);
    vec4 rgba6 = vec4(0);
    vec4 rgba7 = vec4(0);
    vec4 rgba8 = vec4(0);
    vec4 rgba9 = vec4(0);
    rgba5 = texture2D(u_channel0, v_textureCoordinates);

    if(u_origin == true) {//first time
        if(rgba5.a != 0.0) {
            float r = 0.;
            float g = 0.;
            float b = 0.;
            float a = 0.;
            if(rgba5.r != 0.0)
                r = mix(u_zbed_mm.x, u_zbed_mm.y, rgba5.r);
            else {
                r = 0.0;
            }
            if(rgba5.g != 0.0) {
                g = mix(u_Umin, u_Umax, (rgba5.g * 255.0 - 1.0) / 254.0);
            }
            if(rgba5.b != 0.) {
                b = mix(u_Vmin, u_Vmax, (rgba5.b * 255. - 1.) / 254.0);
            }
            // if(rgba5.a != 0.0) {
            //     a = mix(u_zbed_mm.x, u_zbed_mm.y, (rgba5.a * 255.0 - 1.0) / 254.0);
            // }

            gl_FragColor = vec4(r, g, b, 1.1);
        } else {
            gl_FragColor = vec4(0, 0, 0, 0);
        }
        // gl_FragColor = vec4(1.0);
        return;
    } else {
        gl_FragColor = rgba5;
        //  return;
    }
    // if(rgba5.a >= 2.0) {// second ++
    //     gl_FragColor = vec4(50, 0, 0, 1);
    //     return;
    // } else if(rgba5.a >= 3.0) {//超限
    //     gl_FragColor = vec4(100, 0, 0, 1);
    //     return;
    // }

    //判断是否已经计算过或有原始值
    if(rgba5.a >= 1.0) {// second ++
        gl_FragColor = rgba5;
        return;
    } else if(rgba5.r <= u_limit) {//超限
        gl_FragColor = rgba5;
        gl_FragColor = vec4(50, 0, 0, 1);
        return;
    }
    // gl_FragColor = vec4(100, 0, 0, 1);
    // return;
    if(v_textureCoordinates.x == 0.0 && v_textureCoordinates.y == 0.0) {
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.x == 1.0 && v_textureCoordinates.y == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
    } else if(v_textureCoordinates.x == 0.0) {
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.x == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));

    } else if(v_textureCoordinates.y == 0.0) {
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.y == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
    } else {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    }

    int t_a = 0;// rgba1.a + rgba2.a + rgba4.a;
    int t_b = 0;// rgba2.a + rgba3.a + rgba6.a;
    int t_c = 0;// rgba4.a + rgba7.a + rgba8.a;
    int t_d = 0;// rgba6.a + rgba8.a + rgba9.a;

    //over limit round
    if(rgba1.a > u_round || rgba2.a > u_round || rgba4.a > u_round) {
        t_a = 0;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba1.a != 0.0) {
            t_a += 1;
        }
        if(rgba2.a != 0.0) {
            t_a += 1;
        }
        if(rgba4.a != 0.0) {
            t_a += 1;
        }

    }
    if(rgba2.a > u_round || rgba3.a > u_round || rgba6.a > u_round) {
        t_b = 0;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba2.a != 0.0) {
            t_b += 1;
        }
        if(rgba3.a != 0.0) {
            t_b += 1;
        }
        if(rgba6.a != 0.0) {
            t_b += 1;
        }
    }
    if(rgba4.a > u_round || rgba7.a > u_round || rgba8.a > u_round) {
        t_c = 0;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba4.a != 0.0) {
            t_c += 1;
        }
        if(rgba7.a != 0.0) {
            t_c += 1;
        }
        if(rgba8.a != 0.0) {
            t_c += 1;
        }
    }

    if(rgba6.a > u_round || rgba8.a > u_round || rgba9.a > u_round) {
        t_d = 0;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba6.a != 0.0) {
            t_d += 1;
        }
        if(rgba8.a != 0.0) {
            t_d += 1;
        }
        if(rgba9.a != 0.0) {
            t_d += 1;
        }
    }

    gl_FragColor = rgba5;// vec4(1);
    //1vs3
    if(t_d == 3 || t_c == 3 || t_b == 3 || t_a == 3) {

        return;
        vec4 a, b, c;
        if(t_a == 3) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 3) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 3) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 3) {
            a = rgba8;
            b = rgba9;
            c = rgba6;
        }
        gl_FragColor = one_vs_three(rgba5, a, b, c);
        // gl_FragColor = vec4(0, 100, 0, 1);
        gl_FragColor.g = 100.0;

    }

    //2vs2
    else if(t_d == 2 || t_c == 2 || t_b == 2 || t_a == 2) {
        gl_FragColor = rgba5;
        // gl_FragColor = vec4(0, 90, 0, 1);
        vec4 a, b, c;
        if(t_a == 2) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 2) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 2) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 2) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = two_vs_two(rgba5, a, b, c);
        gl_FragColor.g = 90.0;
    } 
    //1v1
    else if(t_d == 1 || t_c == 1 || t_b == 1 || t_a == 1) {
        gl_FragColor = rgba5;
        // gl_FragColor = vec4(0, 80, 0, 1);
        vec4 a, b, c;
        if(t_a == 1) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 1) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 1) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 1) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = one_vs_one(rgba5, a, b, c);
        gl_FragColor.g = 80.0;
    }
    if(gl_FragColor.r < u_limit) {
        gl_FragColor = vec4(0.0, 70.0, 0.0, u_round + 1.0);
    }

}
`;class CCMSNW extends CCMBase{init(){void 0!==this.setting.CMAA&&!1===this.setting.CMAA?this.setting.CMAA=!1:this.setting.CMAA=!0,this.setting.dynWindMapMM={start:{x:!1,y:!1},end:{x:!1,y:!1}},void 0===this.inputSetting.dynWindMapMM||void 0===this.inputSetting.dynWindMapMM.range?this.setting.dynWindMapMM.range=50:this.setting.dynWindMapMM.range=this.inputSetting.dynWindMapMM.range,this.viewer=!1,void 0!==this.setting.viewer&&!1!==this.setting.viewer&&(this.viewer=this.setting.viewer),this.CMAA=!1,this.CMAA1=!1,this.CMAA2=!1,this.CMAA3=!1,this.CMAA_compute_flag=!1,this.CMAA_compute_flag_first=!0,this.GTS={},void 0!==window.GTS?this.GTS=window.GTS:window.GTS=this.GTS,this.WMs=[{index:[],tp:[],uv:[]}],this.CMs=[{index:[],tp:[],uv:[]}];var a=this.oneJSON.dem.cols,e=this.oneJSON.dem.rows;this.imageW=a,this.imageH=e,this.textures={},this.framelines={index:[],tp:[]};for(let t=0;t<e-1;t++)for(let e=0;e<a-1;e++)this.framelines.index.push(e+0+(t+0)*a),this.framelines.index.push(e+1+(t+0)*a),this.framelines.tp.push(0,1),this.framelines.index.push(e+0+(t+0)*a),this.framelines.index.push(e+0+(t+1)*a),this.framelines.tp.push(0,2);for(let t=0;t<e-1;t++)for(let e=0;e<a-1;e++)this.CMs[0].index.push(e+0+(t+0)*a),this.CMs[0].index.push(e+1+(t+0)*a),this.CMs[0].index.push(e+1+(t+1)*a),this.CMs[0].tp.push(0,1,2),this.CMs[0].index.push(e+0+(t+0)*a),this.CMs[0].index.push(e+0+(t+1)*a),this.CMs[0].index.push(e+1+(t+1)*a),this.CMs[0].tp.push(3,4,5);return this.WMs=this.CMs[0],this.WMs_origin=this.CMs[0],this.DS=[],this.loadDS=!1,this.loadDSing=!1,this.visible=!0}onReSzie(){let t=this;window.addEventListener("resize",function(e){t.resize(e,t)})}getTFL(e,t,a){var r,i,o=[];return!1===this.loadDS&&!0===this.updateOfListCommands?(!1===this.loadDSing&&this.initData(e.context),"wind"==this.setting.cmType&&(void 0===this.FBO1?(this.setColorRamp(e.context,this.setting.wind.defaultRampColors),this.set_numParticles(e.context,this.setting.wind.counts)):(this.FBO1.destroy(),this.FBO2.destroy()),this.FBO1=this.createFramebuffer(e.context),this.FBO2=this.createFramebuffer(e.context))):"wind"!=this.setting.cmType||1!=this.resizeFlag&&1!=this.renewFlag||!0!==this.updateOfListCommands||(this.FBO1&&this.FBO1.destroy(),this.FBO2&&this.FBO2.destroy(),this.FBO1=this.createFramebuffer(e.context),this.FBO2=this.createFramebuffer(e.context),this.setColorRamp(e.context,this.setting.wind.defaultRampColors),this.set_numParticles(e.context,this.setting.wind.counts)),!0===this.setting.CMAA&&!1!==this.loadDS&&!0===this.CMAA_compute_flag&&(o.push(this.createCommandOfCompute({u_channel0:()=>!0===this.updateOfListCommands||!0===this.CMAA_compute_flag_first?(this.CMAA_compute_flag_first=!1,this.DS[this.getCurrentLevelByIndex()]):this.CMAA1,u_origin:()=>!0===this.updateOfListCommands||!0===this.CMAA_compute_flag_first,u_Umin:()=>this.oneJSON.dataContent.U.min,u_Vmin:()=>this.oneJSON.dataContent.V.min,u_Umax:()=>this.oneJSON.dataContent.U.max,u_Vmax:()=>this.oneJSON.dataContent.V.max,u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_w:()=>this.CMAA_w,u_h:()=>this.CMAA_h,u_round:()=>5,u_limit:()=>-1},CMAA2,this.CMAA2)),o.push(this.createCommandOfCompute(r={u_channel0:()=>this.CMAA2},CNAACPFS,this.CMAA)),o.push(this.createCommandOfCompute(r,CNAACPFS,this.CMAA1))),this.loadDS&&"wind"==this.setting.cmType?(r={position:{index:0,componentsPerAttribute:2,vertexBuffer:[0,0,1,0,0,1,0,1,1,0,1,1],componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,r,{iTime:()=>{return this.iTime+=.0051,((new Date).getTime()-this.timestamp)/1e3},u_opacity:()=>this.setting.wind.fadeOpacity},{vertexShader:quadVert,fragmentShader:opFrag},PrimitiveType.TRIANGLES,[this.FBO2],this.FBO1)),i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:this.particleIndices,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_particles_res:()=>this.particleStateResolution,u_w:()=>this.particleStateResolution,u_h:()=>this.particleStateResolution,u_wind_Umin:()=>this.oneJSON.dataContent.U.min,u_wind_Vmin:()=>this.oneJSON.dataContent.V.min,u_wind_Umax:()=>this.oneJSON.dataContent.U.max,u_wind_Vmax:()=>this.oneJSON.dataContent.V.max,u_color_ramp:()=>this.colorRampTexture,u_wind:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.particleStateTexture0,u_pointSize:()=>this.getWMPointSize(),u_xy_mm:()=>({x:this.setting.dynWindMapMM.start.x,y:this.setting.dynWindMapMM.start.y,z:this.setting.dynWindMapMM.end.x,w:this.setting.dynWindMapMM.end.y}),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows})},{vertexShader:drawVert,fragmentShader:drawFrag},PrimitiveType.POINTS,[],this.FBO1)),o.push(this.createCommandOfCompute({iTime:()=>(this.iTime+=.0051,this.iTime),u_speed_factor:()=>this.setting.wind.speedFactor,u_drop_rate:()=>this.setting.wind.dropRate,u_drop_rate_bump:()=>this.setting.wind.dropRateBump,u_rand_seed:()=>Math.random(),u_particles_res:()=>this.particleStateResolution,u_w:()=>this.particleStateResolution,u_h:()=>this.particleStateResolution,u_imgW:()=>this.imageW,u_imgH:()=>this.imageH,u_wind_Umin:()=>this.oneJSON.dataContent.U.min,u_wind_Vmin:()=>this.oneJSON.dataContent.V.min,u_wind_Umax:()=>this.oneJSON.dataContent.U.max,u_wind_Vmax:()=>this.oneJSON.dataContent.V.max,u_color_ramp:()=>this.colorRampTexture,u_wind:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.particleStateTexture0,U_scaleOfUV:()=>this.setting.wind.scaleOfUV,u_filterUVofZeroOfGB:()=>this.setting.wind.filterUVofZeroOfGB,u_xy_mm:()=>({x:this.setting.dynWindMapMM.start.x,y:this.setting.dynWindMapMM.start.y,z:this.setting.dynWindMapMM.end.x,w:this.setting.dynWindMapMM.end.y}),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows})},NupdateFrag,this.particleStateTexture1)),o.push(this.createCommandOfCompute({u_channel0:()=>this.particleStateTexture1},cpTextureFS,this.particleStateTexture0)),i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:this.WMs.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:this.WMs.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[1]}),u_color_ramp:()=>this.colorRampTexture,u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_channel0:()=>this.FBO1.getColorTexture(0),u_UVs:()=>!1,u_CMType:()=>1,u_UV_and:()=>this.getWMUV_and_or(),u_xy_mm:()=>({x:this.setting.dynWindMapMM.start.x,y:this.setting.dynWindMapMM.start.y,z:this.setting.dynWindMapMM.end.x,w:this.setting.dynWindMapMM.end.y})},{vertexShader:uvsVS,fragmentShader:uvsFS},PrimitiveType.TRIANGLES,[this.FBO1],void 0,!0)),o.push(this.createCommandOfChannel(e,a,r,{},{vertexShader:quadVert,fragmentShader:cpFS},PrimitiveType.TRIANGLES,[this.FBO1],this.FBO2))):!this.loadDS||"cm"!=this.setting.cmType&&"cmBlue"!=this.setting.cmType&&"cmBlue6"!=this.setting.cmType?!this.loadDS||"cmWater"!=this.setting.cmType&&"cmWaterBlue12"!=this.setting.cmType&&"cmWaterBlue6"!=this.setting.cmType&&"cmWaterBlue6ABS1"!=this.setting.cmType&&"cmWaterBlue6ABS1Nofix"!=this.setting.cmType&&"cmWaterC12"!=this.setting.cmType?this.loadDS&&"arrow"==this.setting.cmType?(i={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,i,{iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[1]}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1,u_filterUVofZeroOfGB:()=>this.setting.wind.filterUVofZeroOfGB},{vertexShader:cmAVS,fragmentShader:cmAFS},PrimitiveType.TRIANGLES))):this.updateOfListCommands=!0:(r={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},i={iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[1]}),u_UVs:()=>!1,u_CMType:()=>1,iChannel0:()=>{if(void 0!==this.textures.grayNoise64x64)return this.textures.grayNoise64x64},iChannel1:()=>{if(void 0!==this.textures.pebbles)return this.textures.pebbles},u_water_wave_speed:()=>this.getCMWaterWaveSpeed(),u_water_wave_scale:()=>this.getCMWaterWaveScale(),u_water_wave_opacity:()=>this.getCMWaterWaveOpacity(),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_DS_new:()=>this.CMAA,u_enable_CMAA:()=>this.setting.CMAA},"cmWaterBlue6ABS1"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmWaterBlue6ABS1FS},PrimitiveType.TRIANGLES)):"cmWaterBlue6ABS1Nofix"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmWaterBlue6ABS1NofixFS},PrimitiveType.TRIANGLES)):"cmWaterBlue6"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmWaterBlue6ColorFS},PrimitiveType.TRIANGLES)):"cmWaterBlue12"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmWaterBlue12ColorFS},PrimitiveType.TRIANGLES)):o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmWaterC12FS},PrimitiveType.TRIANGLES))):(r={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:t.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:t.tp,componentDatatype:ComponentDatatype.FLOAT}},i={iTime:()=>(this.iTime+=.0051,this.iTime),u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed(),u_U_mm:()=>({x:this.oneJSON.dataContent.U.min,y:this.oneJSON.dataContent.U.max}),u_V_mm:()=>({x:this.oneJSON.dataContent.V.min,y:this.oneJSON.dataContent.V.max}),u_dem_mm:()=>({x:this.oneJSON.dataContent.DEM.min,y:this.oneJSON.dataContent.DEM.max}),u_zbed_mm:()=>({x:this.oneJSON.dataContent.zbed.min,y:this.oneJSON.dataContent.zbed.max}),u_filterGlobalMM:()=>({x:this.oneJSON.dataContent.zbed.global_MM,y:this.oneJSON.dataContent.U.global_MM,z:this.oneJSON.dataContent.V.global_MM}),u_filterKind:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterKind,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterKind,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterKind}),u_filter:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filter,y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filter,z:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filter}),u_filterValue_zebd:()=>({x:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[0],y:(this.oneJSON.dataContent.zbed.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).zbed.filterValue[1]}),u_filterValue_U:()=>({x:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[0],y:(this.oneJSON.dataContent.U.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).U.filterValue[1]}),u_filterValue_V:()=>({x:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[0],y:(this.oneJSON.dataContent.V.global_MM?this.oneJSON.dataContent:this.oneJSON.data[this.getCurrentLevelByIndex()]).V.filterValue[1]}),u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_UVs:()=>!1,u_CMType:()=>1,u_DS_new:()=>this.CMAA,u_enable_CMAA:()=>this.setting.CMAA},"cmBLue"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmBlue},PrimitiveType.TRIANGLES)):"cmBLue6"==this.setting.cmType?o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmBlue6},PrimitiveType.TRIANGLES)):o.push(this.createCommandOfChannel(e,a,r,i,{vertexShader:cmVS,fragmentShader:cmFS},PrimitiveType.TRIANGLES))),this.loadDS&&!0===this.setting.framlines&&(t={a_index:{index:0,componentsPerAttribute:1,vertexBuffer:this.framelines.index,componentDatatype:ComponentDatatype.FLOAT},a_tp:{index:1,componentsPerAttribute:1,vertexBuffer:this.framelines.tp,componentDatatype:ComponentDatatype.FLOAT}},o.push(this.createCommandOfChannel(e,a,t,{u_DS:()=>this.DS[this.getCurrentLevelByIndex()],u_DS_XY:()=>({x:this.oneJSON.dem.cols,y:this.oneJSON.dem.rows}),u_DS_CellSize:()=>this.oneJSON.dem.cellsize,u_dem_enable:()=>this.getEnableDEM(),u_dem_base:()=>this.getBaseZ(),u_z_enable_dem_rate:()=>this.getRateDEM(),u_z_baseZ:()=>this.getBaseZ(),u_z_rateZbed:()=>this.getRateZbed()},{vertexShader:cmflVS,fragmentShader:framelineFS},PrimitiveType.LINES))),o}setUpdateOfListCommands(e=!0){this.updateOfListCommands=e}loadDataSource(e,t,a,r=!1){let i=this,o=new Image,_=(o.src=t,parseInt(a));o.onload=function(){i.DS[_]=new Texture({context:e,width:i.getCols(),height:i.getRows(),pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:o,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})}),!0===r&&(i.loadDS=!0)}}async createTextureFromUrl(t,e,a=0,r=!0){let i=new Image;i.src=e;const o=r?TextureWrap.REPEAT:TextureWrap.CLAMP_TO_EDGE;return await new Promise(e=>{i.onload=function(){e(new Texture({context:t,width:i.width,height:i.height,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:i,sampler:new Sampler({wrapS:o,wrapT:o})}))}})}async createTextureNearestFromUrl(t,e){let a=new Image;return a.src=e,await new Promise(e=>{a.onload=function(){e(new Texture({context:t,width:a.width,height:a.height,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:a,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})}))}})}async initData(e){console.log("浮点纹理",e.floatingPointTexture),this.loadDSing=!0;var t=this.oneJSON.data;if(this.textures.grayNoise64x64=await this.createTextureFromUrl(e,"/noise/grayNoise64x64.png"),this.textures.pebbles=await this.createTextureFromUrl(e,"/noise/pebbles.png"),2==Object.keys(this.GTS).length)this.DS=this.GTS.textureArray;else{for(var a in t)this.DS[parseInt(a)]=await this.createTextureNearestFromUrl(e,t[a].png),"0"===a&&this.set_CMAA(e,this.DS[parseInt(a)]._width,this.DS[parseInt(a)]._height);this.loadDS=!0,this.GTS.textureArray=this.DS,this.GTS.dataArray=t}}set_CMAA(e,t,a){var r=new Float32Array(t*a*4);for(let e=0;e<t*a*4;e++)r[e]=1e3;e={context:e,width:t,height:a,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.FLOAT,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})};this.CMAA1=this.createTexture(e,r),this.CMAA2=this.createTexture(e,r),this.CMAA=this.createTexture(e,r),this.CMAA_compute_flag=!0,this.CMAA_w=t,this.CMAA_h=a}getCols(){return this.oneJSON.dem.cols}getRows(){return this.oneJSON.dem.rows}set_numParticles(e,t){let a=!1;this.particleStateTexture0&&(this.particleStateTexture0.destroy(),this.particleStateTexture1.destroy(),a=this._numParticles);var r=this.particleStateResolution=Math.ceil(Math.sqrt(t)),i=(this._numParticles=r*r,new Uint8Array(r*r*4));for(let e=0;e<r*r*4;e++)i[e]=Math.floor(256*Math.random());t={context:e,width:r,height:r,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,sampler:new Sampler({minificationFilter:TextureMinificationFilter.NEAREST,magnificationFilter:TextureMagnificationFilter.NEAREST})};if(this.particleStateTexture0=this.createTexture(t,i),this.particleStateTexture1=this.createTexture(t,i),a!==this._numParticles||!this.particleIndexBuffer){var o=new Float32Array(this._numParticles);for(let e=0;e<this._numParticles;e++)o[e]=e;this.particleIndices=o,this.particleIndexBuffer=this.createVAO(e,o)}}get_numParticles(){return this._numParticles}setColorRamp(e,t){this.colorRampTexture||(PixelFormat.RGBA,PixelDatatype.UNSIGNED_BYTE,t=this.getColorRamp(t),this.colorRampTexture=new Texture({context:e,width:16,height:16,pixelFormat:PixelFormat.RGBA,pixelDatatype:PixelDatatype.UNSIGNED_BYTE,source:{arrayBufferView:t}}))}getColorRamp(e){var t=document.createElement("canvas"),a=t.getContext("2d"),r=(t.width=256,t.height=1,a.createLinearGradient(0,0,256,0));for(const i in e)r.addColorStop(+i,e[i]);return a.fillStyle=r,a.fillRect(0,0,256,1),new Uint8Array(a.getImageData(0,0,256,1).data)}getIndexListOfCM(){return[this.getCurrentLevelByIndex(),this.oneJSON.data.length]}updateSource(e){this.visible=!1;for(var t of this.DS)t.destroy();this.init(e),this.setUpdateOfListCommands(!0)}setEnableDEM(e=!0){this.setting.z.dem=e}setEnableZbed(e=!0){this.setting.z.zbed_up=e}setEnableBaseZ(e=!0){this.setting.z.base_z_enable=e}setBaseZ(e=0){this.setting.z.base_z=e}setRateZbed(e=1){this.setting.z.RateZbed=e}setRateDEM(e=1){this.setting.z.RateDEM=e}getBaseZ(){return!0===this.setting.z.base_z_enable?this.setting.z.base_z:0}getRateZbed(){return!0===this.setting.z.zbed_up?this.setting.z.RateZbed:1}getEnableDEM(){return!0===this.setting.z.dem}getRateDEM(){return!0===this.getEnableDEM()?this.setting.z.RateDEM:1}setWMCounts(e=4096){this.setting.wind.counts=e}setWMFadeOpacity(e=.996){this.setting.wind.fadeOpacity=e}setWMSpeedFactor(e=.25){this.setting.wind.fadeOpacity=e}setWMDropRate(e=.003){this.setting.wind.dropRate=e}setWMDropRateBump(e=.01){this.setting.wind.dropRateBump=e}setWMDefaultRampColors(e){this.setting.wind.defaultRampColors=e}setFilterZbedGlobal(e=!0){this.oneJSON.dataContent.zbed.global_MM=e}setFilterUVGlobal(e=!0){this.oneJSON.dataContent.U.global_MM=e,this.oneJSON.dataContent.V.global_MM=e}setFilterZbedfilterKind(e=1){this.oneJSON.dataContent.zbed.filterKind=e}setFilterUVfilterKind(e=1){this.oneJSON.dataContent.U.filterKind=e,this.oneJSON.dataContent.V.filterKind=e}setEnableFilterZbed(e=!0){this.oneJSON.dataContent.zbed.filter=e}setEnableFilterUV(e=!0){this.oneJSON.dataContent.U.filter=e,this.oneJSON.dataContent.V.filter=e}setFilterZbedfilterValue(e=[]){this.oneJSON.dataContent.zbed.filterValue=e}setFilterUVfilterValue(e=[]){this.oneJSON.dataContent.U.filterValue=e,this.oneJSON.dataContent.V.filterValue=e}resize(e,t){"wind"==this.setting.cmType&&(t.updateOfListCommands=!0,t.resizeFlag=!0)}setWMPointSize(e=1){e=parseInt(e),this.setting.wind.pointSize=e}getWMPointSize(){return this.setting.wind.pointSize}setWMUV_and_or(e=!0){this.setting.wind.UV_and_or=e}getWMUV_and_or(){return this.setting.wind.UV_and_or}updateCM(e){}getCMWaterWaveSpeed(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.speed?this.setting.cmWater.speed:1}getCMWaterWaveScale(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.scale?this.setting.cmWater.scale:1}getCMWaterWaveOpacity(){return null!=typeof this.setting.cmWater&&void 0!==this.setting.cmWater.opacity?this.setting.cmWater.opacity:.105}update(e){if("wind"==this.setting.cmType&&!1!==this.viewer)this.checkWindMapSize();else if("wind"==this.setting.cmType&&!1===this.viewer)throw new Error("风场模式,但input的JSON中没有viewer");if(void 0===this.frameState&&(this.frameState=e),this.visible&&this.initFinish)for(var t of this.getCommands(e,this._modelMatrix))for(var a of t)e.commandList.push(a)}checkWindMapSize(){var e,t=this.oneJSON.dem,a=this.setting.dynWindMapMM,r=this.getViewExtend(),i=Cartesian3.fromDegrees(r.minx,r.miny),r=Cartesian3.fromDegrees(r.maxx,r.maxy),i=Matrix4.multiplyByPoint(this._modelMatrix_inverse,i,new Cartesian3),r=Matrix4.multiplyByPoint(this._modelMatrix_inverse,r,new Cartesian3);let o=!1,_={x:parseInt(i.x/t.cellsize),y:parseInt(i.y/t.cellsize)},n={x:parseInt(r.x/t.cellsize),y:parseInt(r.y/t.cellsize)};(o=!1!==a.start.x&&(!(_.x<a.start.x&&0<a.start.x||_.y<a.start.y&&0<a.start.y||n.x>a.end.x&&a.end.x<t.cols||n.y>a.end.y&&a.end.y<t.rows||a.end.x-n.x>+a.range||a.end.y-n.y>+a.range||_.x-a.start.x>+a.range||_.y-a.start.y>+a.range)||_.x==parseInt(a.start.x+ +a.range)&&_.y==parseInt(a.start.x+ +a.range))?o:!0)&&(i.x<=0||(a.start.x=parseInt(i.x/t.cellsize),a.start.x-a.range<=0)?a.start.x=0:a.start.x-=a.range,i.y<=0||(a.start.y=parseInt(i.y/t.cellsize),a.start.y-a.range<=0)?a.start.y=0:a.start.y-=a.range,r.x>=t.cols*t.cellsize||(a.end.x=parseInt(r.x/t.cellsize),a.end.x+a.range>=t.cols*t.cellsize)?a.end.x=t.cols:a.end.x+=a.range,r.y>=t.rows*t.cellsize||(a.end.y=parseInt(r.y/t.cellsize),a.end.y+a.range>=t.rows*t.cellsize)?a.end.y=t.rows:a.end.y+=a.range,i=this.oneJSON.dem.cols,r=this.oneJSON.dem.rows,t=a.end.x-a.start.x,e=a.end.y-a.start.y,.5*i<t||.5*r<e?this.WMs_origin.index.length==this.WMs.index.length?this.updateOfListCommands=!1:(this.WMs=this.WMs_origin,this.updateOfListCommands=!0):(this.renewNetworkDS(a),this.renewFlag=!0,this.updateOfListCommands=!0))}renewNetworkDS(a){var r=this.oneJSON.dem.cols;this.oneJSON.dem.rows;this.WMs={index:[],tp:[],uv:[]};for(let t=a.start.y;t<a.end.y;t++)for(let e=a.start.x;e<a.end.x;e++)this.WMs.index.push(e+0+(t+0)*r),this.WMs.index.push(e+1+(t+0)*r),this.WMs.index.push(e+1+(t+1)*r),this.WMs.tp.push(0,1,2),this.WMs.index.push(e+0+(t+0)*r),this.WMs.index.push(e+0+(t+1)*r),this.WMs.index.push(e+1+(t+1)*r),this.WMs.tp.push(3,4,5)}getViewExtend(){var e,t,a,r,i={},o=this.viewer.camera.computeViewRectangle();return void 0===o?(e=this.viewer.scene.canvas,a=new Cartesian2(0,0),e=new Cartesian2(e.clientWidth,e.clientHeight),r=this.viewer.scene.globe.ellipsoid,a=this.viewer.camera.pickEllipsoid(a,r),e=this.viewer.camera.pickEllipsoid(e,r),r=this.viewer.scene.globe.ellipsoid.cartesianToCartographic(a),a=this.viewer.scene.globe.ellipsoid.cartesianToCartographic(e),e=Math$1.toDegrees(r.longitude),t=Math$1.toDegrees(a.longitude),a=Math$1.toDegrees(a.latitude),r=Math$1.toDegrees(r.latitude),console.log("经度："+e+"----"+t),console.log("纬度："+a+"----"+r),i.minx=e,i.maxx=t,i.miny=a,i.maxy=r):(i.maxx=Math$1.toDegrees(o.east),i.maxy=Math$1.toDegrees(o.north),i.minx=Math$1.toDegrees(o.west),i.miny=Math$1.toDegrees(o.south)),i}}export{CCMBase,CCMSNW};
