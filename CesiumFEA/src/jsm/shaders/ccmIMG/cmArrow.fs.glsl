#define GRID_SCALE 1.
#define CELL_SCALE 11.0
#define VECTOR_SCALE 1.15
#define pi 3.14159
#define bgColor 0.6

// uniform sampler2D u_DS;
// uniform vec2 u_DS_XY;
// uniform float u_DS_CellSize;
// uniform bool u_dem_enable;
// uniform float u_dem_base;
// uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
// uniform vec2 u_dem_mm;
// uniform vec2 u_zbed_mm;

// uniform bool u_UVs;
// uniform ivec3 u_filterKind;
// uniform bvec3 u_filter;
// uniform vec2 u_filterValue_zebd;
// uniform vec2 u_filterValue_U;
// uniform vec2 u_filterValue_V;

uniform bool u_filterUVofZeroOfGB;
varying vec2 v_uv;
// varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;

float sinh(float x) {
    return (exp(x) - exp(-x)) / 2.;
}
float cosh(float x) {
    return (exp(x) + exp(-x)) / 2.;
}
float tanh(float x) {
    return sinh(x) / cosh(x);
}
float thc(float a, float b) {
    return tanh(a * cos(b)) / tanh(a);
}
float sdEquilateralTriangle(in vec2 p, vec2 v) {
    float r = 1.;
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if(p.x + k * p.y > 0.0)
        p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0, 0.0);
    return -length(p) * sign(p.y);
}

float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.)) + min(max(d.x, d.y), 0.0);
}
// direction and normal for x and y (-1 to 1)
// exp:xy1,xy2,xy3
vec2 xy1 = vec2(1.0, 1.0);
vec2 xy2 = vec2(0.1, .5);
vec2 xy3 = vec2(-0.2, -0.2);
vec2 xy4 = vec2(1, -1.);

float arrow(vec2 uv, vec2 v) {
    float h = 0.3 + 0.4 * thc(4., 2.);
    float d1 = sdEquilateralTriangle(uv - vec2(0., 0.5 - h), v);
    float s1 = step(d1, -0.35 + 0.1 * length(v));//箭头大小

    float d2 = sdBox(uv - vec2(0., -h * .1), vec2(0.05 + 0.05 * length(v), 0.2 + 0.2 * length(v)));
    float s2 = step(d2, 0.);

    //return s2;
    return max(s1, s2);
}

//p=uv,v=向量
float sdVectorArrow(in vec2 p, in vec2 v) {

    float m = length(v);//向量长度，length(1,1)=1.4142...
    vec2 n = v / m;// n=(0.7017,0.7071)
    p = vec2(dot(p, n.yx * vec2(1.0, -1.0)), dot(p, n));//方向判断(逆时针90度)，n控制长度(归一化，统一，变小)
    return arrow(p, v);//shape 
}

vec3 CMC(vec2 uv, vec3 CM) {
    float step = 12.0;
    float perStep = step / 4.0;
    float stair = 0.25;
   /* 
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;
    */
    vec3 cmColor;

    // int i = 0;
    int j = int(perStep);

    float vv = CM[0];

    if(vv <= 0.25 && vv >= 0.0) {
        for(int i = 0; i < 3; i++) {
            if(vv >= float(i) * stair / perStep && vv <= (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(0.0, float(i) / perStep, 1.0);
                break;
            }
        }
    } else if(vv > 0.25 && vv <= 0.5) {
        for(int i = 0; i < 3; i++) {
            if(vv > 0.25 + float(i) * stair / perStep && vv <= 0.25 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(0.0, 1.0, 1.0 - float(i + 1) / perStep);
                break;
            }
        }
    } else if(vv > 0.5 && vv <= 0.75) {
        for(int i = 0; i < 3; i++) {
            if(vv > 0.5 + float(i) * stair / perStep && vv <= 0.5 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(float(i + 1) / perStep, 1.0, 0.0);
                break;
            }
        }
    } else if(vv > 0.75 && vv <= 1.0) {
        for(int i = 0; i < 3; i++) {
            if(vv >= 0.75 + float(i) * stair / perStep && vv <= 0.75 + (float(i) + 1.0) * stair / perStep) {
                cmColor = vec3(1.0, 1. - float(i + 1) / perStep, 0.0);
                break;
            }
        }
    } else {
        cmColor = vec3(1.0, .0, .0);
    }

    return cmColor;
}

void main() {
    float a_sub_a=0.0001;
    if(v_dem == 0.0)
        discard;
    float zeroU = (mix(u_U_mm.x, u_U_mm.y, 0.0) - u_U_mm.x) / (u_U_mm.y - u_U_mm.x);
    float zeroV = (mix(u_V_mm.x, u_V_mm.y, 0.0) - u_V_mm.x) / (u_V_mm.y - u_V_mm.x);
    //0为zero时，而非插值结果时，与数据格式相关
    if(u_filterUVofZeroOfGB == true) {
        if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
            discard;
    } else {

        if(abs(v_cm_UV00.x - zeroU) < a_sub_a && abs(v_cm_UV00.y - zeroV) < a_sub_a) {
            discard;
        }
    }

    vec2 uv000 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);

    //0为zero时，而非插值结果时，与数据格式相关
    if(u_filterUVofZeroOfGB == true) {
        if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0) {
            uv000 = vec2(0);
        }
    } else {
        if(abs(v_cm_UV00.x - zeroU) < a_sub_a && abs(v_cm_UV00.y - zeroV) < a_sub_a) {
            uv000 = vec2(0);
        }
    }
    // vec3 CM = sqrt(exp2(v_cm_U) + exp2(v_cm_V));
    // vec3 CM = vec3(sqrt(exp2(v_cm_U.x) + exp2(v_cm_V.x)), sqrt(exp2(v_cm_U.y) + exp2(v_cm_V.y)), sqrt(exp2(v_cm_U.z) + exp2(v_cm_V.z)));
    vec3 CM = vec3(sqrt(v_cm_U.x * v_cm_U.x + v_cm_V.x * v_cm_V.x), sqrt(v_cm_U.y * v_cm_U.y + v_cm_V.y * v_cm_V.y), sqrt(v_cm_U.z * v_cm_U.z + v_cm_V.z * v_cm_V.z));

    // vec3 CM = vec3(1.0, 1.0, 0.0);
    vec2 uv1 = (v_uv * 4. - (1.95) * 1.0) / 1.0;

    // float vector1 = sdVectorArrow(uv1, xy1);
    float vector1 = sdVectorArrow(uv1, uv000 / 0.5);

    vec3 mixcolor = vec3(bgColor);

    mixcolor = mix(mixcolor, CMC(vec2(.0, .0), CM), vector1);

    if(mixcolor.r == 0.0 && mixcolor.g == 0.0 && mixcolor.b == 0.0) {
        gl_FragColor = vec4(mixcolor, 0.0);
    } else {
        gl_FragColor = vec4(mixcolor, 1.0);
    }
    if(gl_FragColor.r == bgColor && gl_FragColor.g == bgColor && gl_FragColor.b == bgColor) {
        gl_FragColor.a = bgColor;
    }
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

}