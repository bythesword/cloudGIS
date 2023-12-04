uniform sampler2D u_channel0;

uniform sampler2D u_wind;
varying vec2 v_tex_pos;

void main() {
    vec4 color = texture2D(u_wind, vec2(v_tex_pos.x, v_tex_pos.y));
    gl_FragColor = color;
   // gl_FragColor.a=0.51;
}