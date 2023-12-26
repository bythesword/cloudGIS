precision mediump float;

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
