varying vec2 v_uv;
varying vec3 fsposition;
uniform vec4 u_plane;
void main() {
    float distanceToPlane = dot(fsposition, u_plane.xyz) - u_plane.w;
    if(distanceToPlane < 0.0) {
        discard;
    } else {
        gl_FragColor = vec4(fsposition, 1);
    }

    // gl_FragColor = vec4(fsposition, 1);
}
