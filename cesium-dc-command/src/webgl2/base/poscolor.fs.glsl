in vec3 fspos;
void main() {

    out_FragColor = vec4(normalize(fspos), 1);
}
