//有texelFetch需要适配
//////////////////////////////////////////
//uniform by tom
varying vec2 v_uv;
uniform sampler2D iChannel0;
uniform float iTime;                 // shader playback time (in seconds)
//着色器输入
uniform vec3 iResolution;           // viewport resolution (in pixels)
// uniform float     iTime;                 // shader playback time (in seconds)
uniform float iTimeDelta;            // render time (in seconds)
uniform float iFrameRate;            // shader frame rate
uniform int iFrame;                // shader playback frame
uniform float iChannelTime[4];       // channel playback time (in seconds)
uniform vec3 iChannelResolution[4]; // channel resolution (in pixels)
//////////////////////////////
//shader toy define
// #ifdef GL_ES
// precision highp float;
// precision highp int;
// #endif

float round(float x) {
    return floor(x + 0.5);
}
vec2 round(vec2 x) {
    return floor(x + 0.5);
}
vec3 round(vec3 x) {
    return floor(x + 0.5);
}
vec4 round(vec4 x) {
    return floor(x + 0.5);
}
float trunc(float x, float n) {
    return floor(x * n) / n;
}
mat3 transpose(mat3 m) {
    return mat3(m[0].x, m[1].x, m[2].x, m[0].y, m[1].y, m[2].y, m[0].z, m[1].z, m[2].z);
}
float determinant(in mat2 m) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}
float determinant(mat4 m) {
    float b00 = m[0][0] * m[1][1] - m[0][1] * m[1][0], b01 = m[0][0] * m[1][2] - m[0][2] * m[1][0], b02 = m[0][0] * m[1][3] - m[0][3] * m[1][0], b03 = m[0][1] * m[1][2] - m[0][2] * m[1][1], b04 = m[0][1] * m[1][3] - m[0][3] * m[1][1], b05 = m[0][2] * m[1][3] - m[0][3] * m[1][2], b06 = m[2][0] * m[3][1] - m[2][1] * m[3][0], b07 = m[2][0] * m[3][2] - m[2][2] * m[3][0], b08 = m[2][0] * m[3][3] - m[2][3] * m[3][0], b09 = m[2][1] * m[3][2] - m[2][2] * m[3][1], b10 = m[2][1] * m[3][3] - m[2][3] * m[3][1], b11 = m[2][2] * m[3][3] - m[2][3] * m[3][2];
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
mat2 inverse(mat2 m) {
    float det = determinant(m);
    return mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / det;
}
mat4 inverse(mat4 m) {
    float inv0 = m[1].y * m[2].z * m[3].w - m[1].y * m[2].w * m[3].z - m[2].y * m[1].z * m[3].w + m[2].y * m[1].w * m[3].z + m[3].y * m[1].z * m[2].w - m[3].y * m[1].w * m[2].z;
    float inv4 = -m[1].x * m[2].z * m[3].w + m[1].x * m[2].w * m[3].z + m[2].x * m[1].z * m[3].w - m[2].x * m[1].w * m[3].z - m[3].x * m[1].z * m[2].w + m[3].x * m[1].w * m[2].z;
    float inv8 = m[1].x * m[2].y * m[3].w - m[1].x * m[2].w * m[3].y - m[2].x * m[1].y * m[3].w + m[2].x * m[1].w * m[3].y + m[3].x * m[1].y * m[2].w - m[3].x * m[1].w * m[2].y;
    float inv12 = -m[1].x * m[2].y * m[3].z + m[1].x * m[2].z * m[3].y + m[2].x * m[1].y * m[3].z - m[2].x * m[1].z * m[3].y - m[3].x * m[1].y * m[2].z + m[3].x * m[1].z * m[2].y;
    float inv1 = -m[0].y * m[2].z * m[3].w + m[0].y * m[2].w * m[3].z + m[2].y * m[0].z * m[3].w - m[2].y * m[0].w * m[3].z - m[3].y * m[0].z * m[2].w + m[3].y * m[0].w * m[2].z;
    float inv5 = m[0].x * m[2].z * m[3].w - m[0].x * m[2].w * m[3].z - m[2].x * m[0].z * m[3].w + m[2].x * m[0].w * m[3].z + m[3].x * m[0].z * m[2].w - m[3].x * m[0].w * m[2].z;
    float inv9 = -m[0].x * m[2].y * m[3].w + m[0].x * m[2].w * m[3].y + m[2].x * m[0].y * m[3].w - m[2].x * m[0].w * m[3].y - m[3].x * m[0].y * m[2].w + m[3].x * m[0].w * m[2].y;
    float inv13 = m[0].x * m[2].y * m[3].z - m[0].x * m[2].z * m[3].y - m[2].x * m[0].y * m[3].z + m[2].x * m[0].z * m[3].y + m[3].x * m[0].y * m[2].z - m[3].x * m[0].z * m[2].y;
    float inv2 = m[0].y * m[1].z * m[3].w - m[0].y * m[1].w * m[3].z - m[1].y * m[0].z * m[3].w + m[1].y * m[0].w * m[3].z + m[3].y * m[0].z * m[1].w - m[3].y * m[0].w * m[1].z;
    float inv6 = -m[0].x * m[1].z * m[3].w + m[0].x * m[1].w * m[3].z + m[1].x * m[0].z * m[3].w - m[1].x * m[0].w * m[3].z - m[3].x * m[0].z * m[1].w + m[3].x * m[0].w * m[1].z;
    float inv10 = m[0].x * m[1].y * m[3].w - m[0].x * m[1].w * m[3].y - m[1].x * m[0].y * m[3].w + m[1].x * m[0].w * m[3].y + m[3].x * m[0].y * m[1].w - m[3].x * m[0].w * m[1].y;
    float inv14 = -m[0].x * m[1].y * m[3].z + m[0].x * m[1].z * m[3].y + m[1].x * m[0].y * m[3].z - m[1].x * m[0].z * m[3].y - m[3].x * m[0].y * m[1].z + m[3].x * m[0].z * m[1].y;
    float inv3 = -m[0].y * m[1].z * m[2].w + m[0].y * m[1].w * m[2].z + m[1].y * m[0].z * m[2].w - m[1].y * m[0].w * m[2].z - m[2].y * m[0].z * m[1].w + m[2].y * m[0].w * m[1].z;
    float inv7 = m[0].x * m[1].z * m[2].w - m[0].x * m[1].w * m[2].z - m[1].x * m[0].z * m[2].w + m[1].x * m[0].w * m[2].z + m[2].x * m[0].z * m[1].w - m[2].x * m[0].w * m[1].z;
    float inv11 = -m[0].x * m[1].y * m[2].w + m[0].x * m[1].w * m[2].y + m[1].x * m[0].y * m[2].w - m[1].x * m[0].w * m[2].y - m[2].x * m[0].y * m[1].w + m[2].x * m[0].w * m[1].y;
    float inv15 = m[0].x * m[1].y * m[2].z - m[0].x * m[1].z * m[2].y - m[1].x * m[0].y * m[2].z + m[1].x * m[0].z * m[2].y + m[2].x * m[0].y * m[1].z - m[2].x * m[0].z * m[1].y;
    float det = m[0].x * inv0 + m[0].y * inv4 + m[0].z * inv8 + m[0].w * inv12;
    det = 1.0 / det;
    return det * mat4(inv0, inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8, inv9, inv10, inv11, inv12, inv13, inv14, inv15);
}
float sinh(float x) {
    return (exp(x) - exp(-x)) / 2.;
}
float cosh(float x) {
    return (exp(x) + exp(-x)) / 2.;
}
float tanh(float x) {
    return sinh(x) / cosh(x);
}
float coth(float x) {
    return cosh(x) / sinh(x);
}
float sech(float x) {
    return 1. / cosh(x);
}
float csch(float x) {
    return 1. / sinh(x);
}
float asinh(float x) {
    return log(x + sqrt(x * x + 1.));
}
float acosh(float x) {
    return log(x + sqrt(x * x - 1.));
}
float atanh(float x) {
    return .5 * log((1. + x) / (1. - x));
}
float acoth(float x) {
    return .5 * log((x + 1.) / (x - 1.));
}
float asech(float x) {
    return log((1. + sqrt(1. - x * x)) / x);
}

float acsch(float x) {
    return log((1. + sqrt(1. + x * x)) / x);
}

// vec4 texelFetch(sampler2D s, ivec2 c, int l) {
//     return texture2DLodEXT(s, (vec2(c) + 0.5) / vec2(800, 450), float(l));
// };
// vec2 iResolution = vec2(1320, 743);

vec4 fbm(vec2 uv) {
    vec4 n = vec4(0.);
    float t = 0.;
    for(float i = 1.; i < 40.; i *= 2.) {
        n += texture2D(iChannel0, uv * i / 32.) / i;
        t += 1. / i;
    }
    return n / t;
}

vec4 voronoi(vec2 uv, float tiling) {
    float d1 = 10000.001;
    float d2 = 10000.001;
    vec2 id = vec2(0., 0.);
    for(float i = -1.; i < 1.5; i++) {
        for(float j = -1.; j < 1.5; j++) {
            vec2 tileUV = fract(tiling * uv) + vec2(i, j);
            vec2 tileID = floor(tiling * uv) - vec2(i, j);
            // vec4 noise = texelFetch(iChannel0, ivec2(mod(tileID, iChannelResolution[0].xy)), 0);
            vec4 noise = texture2D(iChannel0, vec2(mod(tileID, iChannelResolution[0].xy)));
            vec2 pd = noise.xy - tileUV;
            float d = dot(pd, pd);
            if(d < d1) {
                d2 = d1;
                d1 = d;
                id = tileID;
            }
            if(d < d2 && d > d1) {
                d2 = d;
            }
        }
    }
    return vec4(d1, abs(d1 - d2), id);
}

vec2 distortion(vec2 fbmNoise, float height, out float visibility) {
    vec2 offset = (2. * fbmNoise.xy - 1.) * .02;
    visibility = smoothstep(.4, .0, height - length(offset / 4.) * 100.);
    return visibility * offset;
}

float water(vec2 uv, vec2 distortedUV, vec2 flow) {
    vec4 noise2 = texture2D(iChannel0, distortedUV.yx * .2 + iTime * .01 + flow);
    float color = fbm(uv.yx * 5. + noise2.xy * .5 + iTime * .01 + flow).x;
    noise2 = texture2D(iChannel0, distortedUV * .2 - vec2(iTime * .01, -iTime * .01) + flow);
    color *= fbm(uv.xy * 5. + noise2.zw * .5 - iTime * .01 + flow).y;
    return color * max(smoothstep(.13, .1, color), step(.5, color));
}

void main() {
    vec2 fragCoord = v_uv;
    float zoom = .25;//clamp(0.2, 1., iResolution.y/450.*.2);
    fragCoord *= zoom;
    vec4 f1 = fbm(fragCoord / iResolution.xy * 1.5 + iTime * .05);
    vec4 f = fbm(fragCoord / iResolution.xy * 3. + f1.xy * .5 - iTime * .1);

    vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.y;
    float tiling = 10.;

    vec4 v = voronoi(uv, tiling);

    float waterVis;
    uv += distortion(f1.xy, v.y, waterVis);
    v = voronoi(uv, tiling);

    f *= f;
    f *= f;

    vec2 eps = vec2(.005, .0);
    float dx = voronoi(uv + eps, tiling).y - voronoi(uv - eps, tiling).y;
    float dy = voronoi(uv + eps.yx, tiling).y - voronoi(uv - eps.yx, tiling).y;
    vec3 normal = normalize(vec3(-dx, -dy, f.x + .4));

    vec2 mouse;
    mouse = ((cos(iTime * vec2(1., 1.432)) * .3 + 1.) * zoom - 1.) * iResolution.xy / iResolution.y;
    // if(iMouse.xy == vec2(0.))
    //     mouse = ((cos(iTime * vec2(1., 1.432)) * .3 + 1.) * zoom - 1.) * iResolution.xy / iResolution.y;
    // else
    //     mouse = (2. * iMouse.xy * zoom - iResolution.xy) / iResolution.y;

    vec3 light = normalize(vec3(mouse - uv, f.y + .4));
    float diff = max(0.4 + f.z, dot(normal, light));
    vec3 dir = normalize(vec3(-uv, 1. / tan(radians(30.))));
    float spec = pow(max(.0, dot(normal, normalize(light + dir))), 32.);
    // vec4 noise = texelFetch(iChannel0, ivec2(mod(v.zw, iChannelResolution[0].xy)), 0);
    vec4 noise = texture2D(iChannel0, vec2(mod(v.zw, iChannelResolution[0].xy)));
    float lightDist = clamp(2. - length(uv - mouse), 0., 1.);
    gl_FragColor = v.y * (lightDist * (diff + spec + f.w) * .75 + .2) * noise;

    gl_FragColor += max(lightDist, .04) * waterVis *
        water(fragCoord / iResolution.xy, uv, normal.xy * .01);
}