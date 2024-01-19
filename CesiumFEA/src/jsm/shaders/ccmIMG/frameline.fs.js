let framelineFS = `// varying vec4 rgba;
// varying vec2 v_uv;
varying float v_dem;
void main() {
    if(v_dem == 0.0)
        discard;
    gl_FragColor = vec4(1, 0, 0, 1);

}`
export { framelineFS }