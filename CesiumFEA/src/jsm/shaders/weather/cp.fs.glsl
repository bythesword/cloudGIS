uniform sampler2D u_channel0;
varying vec2 v_uv;

void main() {
    vec4 color = texture2D(u_channel0, v_uv);
    // gl_FragColor = vec4(floor(255.0 * color * 1.0) / 255.0);
    gl_FragColor = color;
    // gl_FragColor = vec4(1, 0, 0, 1);
}
