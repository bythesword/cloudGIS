let opFrag = `precision mediump float;

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
`

export { opFrag }