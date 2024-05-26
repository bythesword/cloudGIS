in vec3 position;
void main() {
    gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}
