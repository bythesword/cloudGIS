#extension GL_OES_standard_derivatives : enable
//////////////////////////////////////////
//uniform by tom
varying vec2 v_uv;

uniform float iTime;

vec2 iResolution = vec2(1320, 743);
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

//////////////////////////////////
// glsl program

const float k_screenshotTime = 13.0;
const int k_raymarchSteps = 96;
const int k_fmbSteps = 3;
const int k_superSampleCount = 10;
const int k_fmbWaterSteps = 4;
#define OBJ_ID_SKY 0.0
#define OBJ_ID_GROUND 1.0
float g_fTime;
const vec3 g_vSunDir = vec3(-100.0, 70., 25.);
vec3 GetSunDir() {
    return normalize(g_vSunDir);
}

const vec3 g_sunColour = vec3(1.0, 0.85, 0.5) * 5.0;
const vec3 g_skyColour = vec3(0.1, 0.5, 1.0) * 1.0;
const vec3 k_bgSkyColourUp = g_skyColour * 4.0;
const vec3 k_bgSkyColourDown = g_skyColour * 6.0;
const vec3 k_envFloorColor = vec3(0.3, 0.2, 0.2);
const vec3 k_vFogExt = vec3(0.01, 0.015, 0.015) * 3.0;
const vec3 k_vFogIn = vec3(1.0, 0.9, 0.8) * 0.015;

#define MOD2 vec2(4.438975,3.972973)

// 哈希算法, 提供随机噪声的高度
float Hash(float p) {
    vec2 p2 = fract(vec2(p) * MOD2);
    p2 += dot(p2.yx, p2.xy + 19.19);
    return fract(p2.x * p2.y);
}

vec2 Hash2(float p) {
    vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

// Perlin噪声 + 线性过度处理
float SmoothNoise(in vec2 o) {
    vec2 p = floor(o);
    vec2 f = fract(o);
    float n = p.x + p.y * 57.0;
    float a = Hash(n + 0.0);
    float b = Hash(n + 1.0);
    float c = Hash(n + 57.0);
    float d = Hash(n + 58.0);
    vec2 f2 = f * f;
    vec2 f3 = f2 * f;
    vec2 t = 3.0 * f2 - 2.0 * f3;
    float u = t.x;
    float v = t.y;
    float res = a + (b - a) * u + (c - a) * v + (a - b + d - c) * u * v;
    return res;
}

// FBM算法, 对perlin噪声进行迭代
float FBM(vec2 p, float ps) {
    float f = 0.0;
    float tot = 0.0;
    float a = 1.0;
    for(int i = 0; i < k_fmbSteps; i++) {
        f += SmoothNoise(p) * a;
        p *= 2.0;
        tot += a;
        a *= ps;
    }
    return f / tot;
}

// 对SmoothNoise求导
vec3 SmoothNoise_DXY(in vec2 o) {
    vec2 p = floor(o);
    vec2 f = fract(o);
    float n = p.x + p.y * 57.0;
    float a = Hash(n + 0.0);
    float b = Hash(n + 1.0);
    float c = Hash(n + 57.0);
    float d = Hash(n + 58.0);
    vec2 f2 = f * f;
    vec2 f3 = f2 * f;
    vec2 t = 3.0 * f2 - 2.0 * f3;
    vec2 dt = 6.0 * f - 6.0 * f2;
    float u = t.x;
    float v = t.y;
    float du = dt.x;
    float dv = dt.y;
    float res = a + (b - a) * u + (c - a) * v + (a - b + d - c) * u * v;
    float dx = (b - a) * du + (a - b + d - c) * du * v;
    float dy = (c - a) * dv + (a - b + d - c) * u * dv;
    return vec3(dx, dy, res);
}

// 对FBM求导
vec3 FBM_DXY(vec2 p, vec2 flow, float ps, float df) {
    vec3 f = vec3(0.0);
    float tot = 0.0;
    float a = 1.0;
    for(int i = 0; i < k_fmbWaterSteps; i++) {
        p += flow;
        flow *= -0.75; // modify flow for each octave - negating this is fun
        vec3 v = SmoothNoise_DXY(p);
        f += v * a;
        p += v.xy * df;
        p *= 2.0;
        tot += a;
        a *= ps;
    }
    return f / tot;
}

// 地形高度采样, 利用fbm迭代算出地形
float GetTerrainHeight(const vec3 vPos) {
    float fbm = FBM(vPos.xz * vec2(0.5, 1.0), 0.5);
    float fTerrainHeight = fbm * fbm * 0.05;
    fTerrainHeight -= 0.3 + (0.5 + 0.5 * sin(vPos.z * 0.001 + 3.0)) * 0.4;
    return fTerrainHeight;
}

// 距离场函数
float GetSceneDistance(const vec3 vPos) {
    return vPos.y - GetTerrainHeight(vPos);
}

float GetFlowDistance(const vec2 vPos) {
    return -GetTerrainHeight(vec3(vPos.x, 0.0, vPos.y));
}

vec2 GetBaseFlow(const vec2 vPos) {
    return vec2(1.0, 0.);
}

vec2 GetGradient(const vec2 vPos) {
    vec2 vDelta = vec2(0.01, 0.00);
    float dx = GetFlowDistance(vPos + vDelta.xy) - GetFlowDistance(vPos - vDelta.xy);
    float dy = GetFlowDistance(vPos + vDelta.yx) - GetFlowDistance(vPos - vDelta.yx);
    return vec2(dx, dy);
}

vec4 SampleWaterNormal(vec2 vUV, vec2 vFlowOffset, float fMag) {
    vec2 vFilterWidth = max(abs(dFdx(vUV)), abs(dFdy(vUV)));
    float fFilterWidth = max(vFilterWidth.x, vFilterWidth.y);
    float fScale = (1.0 / (1.0 + fFilterWidth * fFilterWidth * 2000.0));
    float fGradientAscent = 0.25;
    vec3 dxy = FBM_DXY(vUV * 20.0, vFlowOffset * 20.0, 0.75, fGradientAscent);
    vec3 vBlended = mix(vec3(0.0, 1.0, 0.0), normalize(vec3(dxy.x, fMag, dxy.y)), fScale);
    return vec4(normalize(vBlended), dxy.z * fScale);
}

vec4 SampleFlowingNormal(const vec2 vUV, const vec2 vFlowRate, const float time) {
    float fMag = 2.5 / (1.0 + dot(vFlowRate, vFlowRate) * 5.0);
    float t0 = fract(time);
    float t1 = fract(time + 0.5);

    float i0 = floor(time);
    float i1 = floor(time + 0.5);

    float o0 = t0 - 0.5;
    float o1 = t1 - 0.5;

    vec2 vUV0 = vUV + Hash2(i0);
    vec2 vUV1 = vUV + Hash2(i1);

    vec4 sample0 = SampleWaterNormal(vUV0, vFlowRate * o0, fMag);
    vec4 sample1 = SampleWaterNormal(vUV1, vFlowRate * o1, fMag);

    float weight = abs(t0 - 0.5) * 2.0;
    vec4 result = mix(sample0, sample1, weight);
    result.xyz = normalize(result.xyz);

    return result;
}

vec3 ApplyVignetting(const in vec2 vUV, const in vec3 vInput) {
    vec2 vOffset = (vUV - 0.5) * sqrt(2.0);
    float fDist = dot(vOffset, vOffset);
    const float kStrength = 0.8;
    float fShade = mix(1.0, 1.0 - kStrength, fDist);
    return vInput * fShade;
}

vec3 Tonemap(vec3 x) {
    float a = 0.010;
    float b = 0.132;
    float c = 0.010;
    float d = 0.163;
    float e = 0.101;
    return (x * (a * x + b)) / (x * (c * x + d) + e);
}

struct Intersection {
    float m_dist;
    float m_objId;
    vec3 m_pos;
};

void RaymarchScene(vec3 vRayOrigin, vec3 vRayDir, float near, float far, out Intersection intersection) {
    float stepScale = 1.0;
    intersection.m_dist = near;
    intersection.m_objId = OBJ_ID_SKY;
    float sceneDist = 0.0;
    // k_raymarchSteps 作为步进次数上限, 在次数限制内查找物体
    for(int iter = 0; iter < k_raymarchSteps; iter++) {
        vec3 vPos = vRayOrigin + vRayDir * intersection.m_dist;
        sceneDist = GetSceneDistance(vPos);
        intersection.m_dist += sceneDist * stepScale;
        intersection.m_objId = OBJ_ID_GROUND;
        if(sceneDist <= 0.01) {
            break;
        }
        if(intersection.m_dist > far) {
            intersection.m_objId = OBJ_ID_SKY;
            intersection.m_dist = far;
            break;
        }
    }
    intersection.m_pos = vRayOrigin + vRayDir * intersection.m_dist;
}

vec3 GetSceneNormal(const in vec3 vPos) {
    const float fDelta = 0.001;

    vec3 vDir1 = vec3(1.0, 0.0, -1.0);
    vec3 vDir2 = vec3(-1.0, 0.0, 1.0);
    vec3 vDir3 = vec3(-1.0, 0.0, -1.0);

    vec3 vOffset1 = vDir1 * fDelta;
    vec3 vOffset2 = vDir2 * fDelta;
    vec3 vOffset3 = vDir3 * fDelta;

    vec3 vPos1 = vPos + vOffset1;
    vec3 vPos2 = vPos + vOffset2;
    vec3 vPos3 = vPos + vOffset3;

    float f1 = GetSceneDistance(vPos1);
    float f2 = GetSceneDistance(vPos2);
    float f3 = GetSceneDistance(vPos3);

    vPos1.y -= f1;
    vPos2.y -= f2;
    vPos3.y -= f3;

    vec3 vNormal = cross(vPos1 - vPos2, vPos3 - vPos2);

    return normalize(vNormal);
}

// 追踪水面场景算法
void TraceWater(vec3 vRayOrigin, vec3 vRayDir, float near, float far, out Intersection intersection) {
    intersection.m_dist = far;
    // 求出相机在y轴分量上, 与是方向距离的倍数
    // 所得倍数与RayDir的乘积, 结合相机位置, 可求出水面的具体坐标
    float t = -vRayOrigin.y / vRayDir.y;
    if(t > 0.0) {
        intersection.m_dist = t;
    }
    intersection.m_pos = vRayOrigin + vRayDir * intersection.m_dist;
}

float tri(in float x) {
    return abs(fract(x) - .5);
}
vec3 tri3(in vec3 p) {
    return vec3(tri(p.z + tri(p.y)), tri(p.z + tri(p.x)), tri(p.y + tri(p.x)));
}
float triNoise(in vec3 p) {
    float z = 1.4;
    float rz = 0.;
    vec3 bp = p;
    for(float i = 0.; i <= 4.; i++) {
        p += tri3(bp * 2.);
        bp *= 1.8;
        z *= 1.5;
        p *= 1.2;
        rz += (tri(p.z + tri(p.x + tri(p.y)))) / z;
        bp += 0.14;
    }
    return rz;
}

struct Surface {
    vec3 m_pos;
    vec3 m_normal;
    vec3 m_albedo;
    vec3 m_specR0;
    float m_gloss;
    float m_specScale;
};

void GetSurfaceInfo(Intersection intersection, out Surface surface) {
    surface.m_pos = intersection.m_pos;
    surface.m_normal = GetSceneNormal(intersection.m_pos);
    vec3 vNoisePos = surface.m_pos * vec3(0.4, 0.3, 1.0);
    surface.m_normal = normalize(surface.m_normal + (vNoisePos));
    float fNoise = triNoise(vNoisePos);
    fNoise = pow(fNoise, 0.15);
    surface.m_albedo = mix(vec3(.7, .8, .95), vec3(.1, .1, .05), fNoise);
    surface.m_specR0 = vec3(0.001);
    surface.m_gloss = 0.0;
    surface.m_specScale = 1.0;
}

float GIV(float dotNV, float k) {
    return 1.0 / ((dotNV + 0.0001) * (1.0 - k) + k);
}

void AddSunLight(Surface surf, const vec3 vViewDir, const float fShadowFactor, inout vec3 vDiffuse, inout vec3 vSpecular) {
    vec3 vSunDir = GetSunDir();
    vec3 vH = normalize(vViewDir + vSunDir);
    float fNdotL = clamp(dot(GetSunDir(), surf.m_normal), 0.0, 1.0);
    float fNdotV = clamp(dot(vViewDir, surf.m_normal), 0.0, 1.0);
    float fNdotH = clamp(dot(surf.m_normal, vH), 0.0, 1.0);
    float diffuseIntensity = fNdotL;
    vDiffuse += g_sunColour * diffuseIntensity * fShadowFactor;
    float alpha = 1.0 - surf.m_gloss;
    float alphaSqr = alpha * alpha;
    float pi = 3.14159;
    float denom = fNdotH * fNdotH * (alphaSqr - 1.0) + 1.0;
    float d = alphaSqr / (pi * denom * denom);
    float k = alpha / 2.0;
    float vis = GIV(fNdotL, k) * GIV(fNdotV, k);
    float fSpecularIntensity = d * vis * fNdotL;
    vSpecular += g_sunColour * fSpecularIntensity * fShadowFactor;
}

void AddSkyLight(Surface surf, inout vec3 vDiffuse, inout vec3 vSpecular) {
    float skyIntensity = max(0.0, surf.m_normal.y * 0.3 + 0.7);
    vDiffuse += g_skyColour * skyIntensity;
}

vec3 GetFresnel(vec3 vView, vec3 vNormal, vec3 vR0, float fGloss) {
    float NdotV = max(0.0, dot(vView, vNormal));
    return vR0 + (vec3(1.0) - vR0) * pow(1.0 - NdotV, 5.0) * pow(fGloss, 20.0);
}

vec3 GetWaterExtinction(float dist) {
    float fOpticalDepth = dist * 6.0;
    vec3 vExtinctCol = 1.0 - vec3(0.5, 0.4, 0.1);
    vec3 vExtinction = exp2(-fOpticalDepth * vExtinctCol);
    return vExtinction;
}

vec3 GetSkyColour(vec3 vRayDir) {
    vec3 vSkyColour = mix(k_bgSkyColourDown, k_bgSkyColourUp, clamp(vRayDir.y, 0.0, 1.0));
    float fSunDotV = dot(GetSunDir(), vRayDir);
    float fDirDot = clamp(fSunDotV * 0.5 + 0.5, 0.0, 1.0);
    vSkyColour += g_sunColour * (1.0 - exp2(fDirDot * -0.5)) * 2.0;

    return vSkyColour;
}

vec3 GetEnvColour(vec3 vRayDir, float fGloss) {
    return mix(k_envFloorColor, k_bgSkyColourUp, clamp(vRayDir.y * (1.0 - fGloss * 0.5) * 0.5 + 0.5, 0.0, 1.0));
}

vec3 GetRayColour(const in vec3 vRayOrigin, const in vec3 vRayDir, const in float near, const in float far, out Intersection intersection) {
    RaymarchScene(vRayOrigin, vRayDir, near, far, intersection);
    if(intersection.m_objId == OBJ_ID_SKY) {
        return GetSkyColour(vRayDir);
    }

    Surface surface;
    GetSurfaceInfo(intersection, surface);

    vec3 vIgnore = vec3(0.0);
    vec3 vResult = vec3(0.0);
    float fSunShadow = 1.0;
    AddSunLight(surface, -vRayDir, fSunShadow, vResult, vIgnore);
    AddSkyLight(surface, vResult, vIgnore);
    return vResult * surface.m_albedo;
}

vec3 GetRayColour(const in vec3 vRayOrigin, const in vec3 vRayDir, const in float near, const in float far) {
    Intersection intersection;
    return GetRayColour(vRayOrigin, vRayDir, near, far, intersection);
}

vec3 GetScene(const in vec3 vRayOrigin, const in vec3 vRayDir, const in float near, const in float far) {
    float fSunDotV = dot(GetSunDir(), vRayDir);
    Intersection waterInt;
    TraceWater(vRayOrigin, vRayDir, near, far, waterInt);
    vec3 vReflectRayOrigin;
    vec3 vResult;
    vec3 vTransmitLight;
    Surface specSurface;
    vec3 vSpecularLight = vec3(0.0);
    vec2 vFlowRate = GetBaseFlow(waterInt.m_pos.xz) * 0.3;
    vec4 vWaterNormalAndHeight = SampleFlowingNormal(waterInt.m_pos.xz, vFlowRate, g_fTime / 5.0);
    float fFogDistance = waterInt.m_dist;
    vec3 vWaterNormal = vWaterNormalAndHeight.xyz;
    vReflectRayOrigin = waterInt.m_pos;
    vec3 vRefractRayOrigin = waterInt.m_pos;
    vec3 vRefractRayDir = refract(vRayDir, vWaterNormal, 1.0 / 1.3333);
    Intersection refractInt;
    vec3 vRefractLight = GetRayColour(vRefractRayOrigin, vRefractRayDir, near, far, refractInt); // note : dont need sky

    // add extra extinction for the light travelling to the point underwater
    vec3 vExtinction = GetWaterExtinction(refractInt.m_dist + abs(refractInt.m_pos.y));
    specSurface.m_pos = waterInt.m_pos;
    specSurface.m_normal = normalize(vWaterNormal);
    specSurface.m_albedo = vec3(1.0);
    specSurface.m_specR0 = vec3(0.01, 0.01, 0.01);
    vec2 vFilterWidth = max(abs(dFdx(waterInt.m_pos.xz)), abs(dFdy(waterInt.m_pos.xz)));
    float fFilterWidth = max(vFilterWidth.x, vFilterWidth.y);
    float fGlossFactor = exp2(-fFilterWidth * 0.3);
    specSurface.m_gloss = 0.99 * fGlossFactor;
    specSurface.m_specScale = 1.0;
    vec3 vSurfaceDiffuse = vec3(0.0);
    float fSunShadow = 1.0;
    AddSunLight(specSurface, -vRayDir, fSunShadow, vSurfaceDiffuse, vSpecularLight);
    AddSkyLight(specSurface, vSurfaceDiffuse, vSpecularLight);
    vec3 vInscatter = vSurfaceDiffuse * (1.0 - exp(-refractInt.m_dist * 0.1)) * (1.0 + fSunDotV);
    vTransmitLight = vRefractLight.rgb;
    vTransmitLight += vInscatter;
    vTransmitLight *= vExtinction;
    vec3 vReflectRayDir = reflect(vRayDir, vWaterNormal);
    vec3 vReflectLight = GetRayColour(vReflectRayOrigin, vReflectRayDir, near, far);
    vReflectLight = mix(GetEnvColour(vReflectRayDir, specSurface.m_gloss), vReflectLight, pow(specSurface.m_gloss, 40.0));
    vec3 vFresnel = GetFresnel(-vRayDir, vWaterNormal, specSurface.m_specR0, specSurface.m_gloss);
    vSpecularLight += vReflectLight;
    vResult = mix(vTransmitLight, vSpecularLight, vFresnel * specSurface.m_specScale);
    vec3 vFogColour = GetSkyColour(vRayDir);
    vec3 vFogExtCol = exp2(k_vFogExt * -fFogDistance);
    vec3 vFogInCol = exp2(k_vFogIn * -fFogDistance);
    vResult = vResult * (vFogExtCol) + vFogColour * (1.0 - vFogInCol);
    return vResult;
}

void initCamera(out vec3 ro, out vec3 rd, out float near, out float far) {
    // 相机参数
    vec3 lookAt = vec3(0., 0., 0.);
     vec3 cameraPosition = vec3(1.5, 3.5, -1.5); 

    // 相机控制
    // if(iMouse.z > 0.0) {
    //     float fHeading = iMouse.x * 10.0 / iResolution.x;
    //     float fDist = 5.0 - iMouse.y * 5.0 / iResolution.y;
    //     cameraPosition.y += 1.0 + fDist * fDist * 0.05;
    //     cameraPosition.x += sin(fHeading) * fDist;
    //     cameraPosition.z += cos(fHeading) * fDist;
    // }

    // 相机三轴
    vec3 forward = normalize(lookAt - cameraPosition);
    vec3 right = normalize(vec3(forward.z, 0., -forward.x));
    vec3 up = normalize(cross(forward, right));
    float FOV = 0.5;
    vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
    near = 0.01;
    far = 200.0;
    vec2 screenCoords = (2.0 * gl_FragCoord.xy / iResolution.xy - 1.0) * aspect;
    ro = cameraPosition;
    rd = normalize(forward + FOV * screenCoords.x * right + FOV * screenCoords.y * up);
}

void main() {
    vec3 ro, rd; // Rar Origin , Ray Direction 
    float near, far;
    g_fTime = iTime;
    initCamera(ro, rd, near, far);
    vec3 vResult = GetScene(ro, rd, near, far);
    vResult = ApplyVignetting(v_uv.xy / iResolution.xy, vResult);//需要更改
    vec3 vFinal = Tonemap(vResult * 3.0);
    vFinal = vFinal * 1.1 - 0.1;
    gl_FragColor = vec4(vFinal, .020);
}
