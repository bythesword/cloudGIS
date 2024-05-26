
in vec3 position;

out vec3 fsposition;
void main() {

    // gl_Position = vec4(position, 1.0);
    fsposition = position;
    gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
}
