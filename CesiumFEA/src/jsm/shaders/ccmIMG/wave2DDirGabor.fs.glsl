uniform sampler2D u_channel0;
uniform sampler2D u_noise64x64;
uniform float iTime;
uniform vec2 u_U_mm;
uniform vec2 u_V_mm;

varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;

#define NB 60      // number or gabor blobs
#define SIZE .22   // size of gabor blobs
                    // freq tuned by mouse.x

#define M_PI 3.14159265358979
float gauss(float x) {
    return exp(-(x * x) / (SIZE * SIZE));
}

float rndi(int i, int j) {
    vec2 uv = vec2(.5 + float(i), .5 + float(j)) / 64.;
    return texture2D(u_noise64x64, uv).r;
}

float gabor(vec2 pos, vec2 dir) {
    float g = gauss(pos.x) * gauss(pos.y);
    float s = .5 * sin(dot(pos, dir) * 2. * M_PI - 10. * iTime);
    return g * s;
}

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;

    vec2 uv = v_uv;
    float freq = mix(1.9, uv.x / 1., 0. / uv.x);

    vec3 col = vec3(0.);
    vec2 a_uv1 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);

    for(int i = 0; i < NB; i++) {
        vec2 pos = vec2(1.5 * rndi(i, 0), rndi(i, 1));
		//vec2 dir = (1.+d)*vec2(rndi(i,2),rndi(i,3))-d;
        vec2 dir = vec2(a_uv1.x, a_uv1.y);
        col += gabor(uv - pos, freq * dir) * vec3(1);//texture(iChannel0,pos).rgb;
    }
    gl_FragColor = vec4(col, 1.0);

}
