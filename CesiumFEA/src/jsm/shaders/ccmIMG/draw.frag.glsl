precision mediump float;

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
    // 水平速度为红色，垂直速度为绿色。
    vec2 puv = texture2D(u_wind, vec2(v_particle_pos.x, v_particle_pos.y)).gb;
    vec2 velocity = mix(u_wind_min, u_wind_max, puv);//速度，在max，min，在png的颜色值中
    float speed_t = length(velocity) / length(u_wind_max);

    if(puv.x == 0.0 && puv.y == 0.0) {
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
