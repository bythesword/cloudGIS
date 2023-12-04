uniform sampler2D u_channel0;

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
}