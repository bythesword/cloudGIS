
 
in vec3 fsposition;
uniform vec4 u_plane;
void main() {
    float distanceToPlane = dot(fsposition, u_plane.xyz) - u_plane.w;
    if(distanceToPlane < 0.0) {
        discard;
    } else {
       out_FragColor = vec4(1,0,0,1);
    }

    // gl_FragColor = vec4(normalize(fsposition), 1);
}
