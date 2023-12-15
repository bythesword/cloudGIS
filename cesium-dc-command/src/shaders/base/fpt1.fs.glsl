uniform sampler2D u_channel0;
varying vec2 v_uv;
varying float test1;
void main() {
    vec4 rgba = texture2D(u_channel0, v_uv);
    // if(rgba.r == -1000.0)
    if(test1 == -1000.0)
        gl_FragColor = vec4(1, 0, 0, 1);
    else
        gl_FragColor = vec4(0, 1, 0, 1);
    //   gl_FragColor = vec4(test1);
}
