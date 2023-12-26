precision highp float;

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
