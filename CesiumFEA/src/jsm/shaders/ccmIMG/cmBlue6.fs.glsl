uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

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

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

uniform bool u_toscreen;
void main() {
    if(v_dem == 0.0) {
        // discard;
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    }
    // gl_FragColor = vec4(texture2D(u_DS, v_uv).rgb, 1.0);
    // // gl_FragColor = texture2D(u_DS, v_uv);
    // // gl_FragColor = vec4(0, 0, 1, 1);
    // return;

    int n = 12;
    float w1 = (1.0 - v_uv.x);
    float w2 = (v_uv.x - v_uv.y);
    float w3 = v_uv.y;

    float cm1 = v_cm_zbed[0];
    float cm2 = v_cm_zbed[1];
    float cm3 = v_cm_zbed[2];

    float v;

    bool flag_break = false;
    if(u_filter.x == true) {
        if(u_filterKind.x == 1) {
            float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
            float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
            float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);
            v = w1 * cmP1 + w2 * cmP2 + w3 * cmP3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        } else if(u_filterKind.x == 2) {
            v = w1 * cm1 + w2 * cm2 + w3 * cm3;
            if(v >= u_filterValue_zebd.x && v <= u_filterValue_zebd.y) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                flag_break = true;
                discard;
                return;
            }
        }
    }

    v = w1 * cm1 + w2 * cm2 + w3 * cm3;

    float dv = 1.0 / float(n);
    float nv = float(v / dv);
    float vv = float(nv) * dv;   
                    // if( flag_break ==true ){ discard;}
    vec4 fragColor = vec4(1);
    if(flag_break == false) {
        if(vv <= 1.0 / 6.0 && vv >= 0.) {
            fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
        } else if(vv > 1.0 / 6.0 && vv <= 2.0 / 6.0) {
            fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
        } else if(vv > 2.0 / 6.0 && vv <= 0.5) {
            fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
        } else if(vv > 0.5 && vv <= 4.0 / 6.0) {
            fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
        } else if(vv > 4.0 / 6.0 && vv <= 5.0 / 6.0) {
            fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
        } else if(vv > 5.0 / 6.0 && vv <= 1.0) {
            fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
        } else {
            fragColor = vec4(.0, 0, 1., 1.0);
        }
    }
    gl_FragColor = fragColor;
    vec4 finalColor = vec4(0);

}