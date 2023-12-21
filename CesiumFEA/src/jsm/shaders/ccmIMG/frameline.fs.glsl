varying vec4 rgba;
void main() {
    if(rgba.a == 0.0)
        discard;
    gl_FragColor = vec4(1, 0, 0, 1);

}