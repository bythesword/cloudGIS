in vec3 position;
out vec3 fspos;
void main() {
    fspos = position;
    gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}
