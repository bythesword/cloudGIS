uniform sampler2D u_channel0;
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
}