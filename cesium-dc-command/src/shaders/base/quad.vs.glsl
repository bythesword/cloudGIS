attribute vec2 uv;
attribute vec3 position;

varying vec2 v_uv;
varying float test1;
void main() {
    test1 = -1000.0;
    v_uv = uv;
    // gl_Position = vec4(position, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}
