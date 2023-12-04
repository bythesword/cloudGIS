uniform sampler2D fbodefault;
 
varying vec2 v_uv;

uniform bool u_toscreen;
void main() {
    vec4 color = texture2D(fbodefault, v_uv);
    gl_FragColor = color;
    // gl_FragColor =vec4(1,0,0,1);
}