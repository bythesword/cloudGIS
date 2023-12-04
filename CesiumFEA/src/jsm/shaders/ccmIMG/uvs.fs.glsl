uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

uniform bvec3 u_filterGlobalMM;
uniform bool u_UV_and;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform sampler2D u_channel0;

varying vec2 v_cm_UV00;

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;
    float v;

    bool flag_U = false;
    bool flag_V = false;

    float cmU1 = v_cm_U[0];
    float cmU2 = v_cm_U[1];
    float cmU3 = v_cm_U[2];

    if(u_filter.y == true) {
        if(u_filterKind.y == 1) {
            float cmPU1 = mix(u_U_mm.x, u_U_mm.y, cmU1);
            float cmPU2 = mix(u_U_mm.x, u_U_mm.y, cmU2);
            float cmPU3 = mix(u_U_mm.x, u_U_mm.y, cmU3);
            v = w1 * cmPU1 + w2 * cmPU2 + w3 * cmPU3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_U = true;
            }
        } else if(u_filterKind.y == 2) {
            v = w1 * cmU1 + w2 * cmU2 + w3 * cmU3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_U = true;
            }
        }
    }

    float cmV1 = v_cm_V[0];
    float cmV2 = v_cm_V[1];
    float cmV3 = v_cm_V[2];
    if(u_filter.z == true) {
        if(u_filterKind.z == 1) {
            float cmPV1 = mix(u_U_mm.x, u_U_mm.y, cmV1);
            float cmPV2 = mix(u_U_mm.x, u_U_mm.y, cmV2);
            float cmPV3 = mix(u_U_mm.x, u_U_mm.y, cmV3);
            v = w1 * cmPV1 + w2 * cmPV2 + w3 * cmPV3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_V = true;
            }
        } else if(u_filterKind.z == 2) {
            v = w1 * cmV1 + w2 * cmV2 + w3 * cmV3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                flag_V = true;
            }
        }
    }
    if(u_UV_and) {
        if(flag_U && flag_V) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    } else {
        if(flag_U || flag_V) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }
    }

    vec4 color = texture2D(u_channel0, v_uv);
    // if(color == vec4(0))
    //     discard;
    gl_FragColor = color;
    // gl_FragColor=vec4(1,0,0,1);
}

// uniform sampler2D u_channel0;
// varying vec2 v_uv;
// varying float v_dem;
// varying vec2 v_cm_UV00;
// void main() {
//     if(v_dem == 0.0)
//         discard;
//     if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
//         discard;
//     vec4 color = texture2D(u_channel0, v_uv);
//     gl_FragColor = color;
//     // gl_FragColor=vec4(1,0,0,1);
// }
