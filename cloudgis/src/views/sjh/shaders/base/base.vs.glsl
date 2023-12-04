attribute vec2 uv;
attribute vec3 position;

varying vec2 v_uv;
void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
    // gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}