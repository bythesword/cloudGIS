precision mediump float;
// uniform sampler2D u_DS_new;
// uniform sampler2D u_DS;
// uniform vec2 u_DS_XY;
// uniform float u_DS_CellSize;
// uniform bool u_dem_enable;
// uniform float u_dem_base;
// uniform float u_CMType;

// uniform vec2 u_U_mm;
// uniform vec2 u_V_mm;
// uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

// uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
// uniform vec2 u_filterValue_U;
// uniform vec2 u_filterValue_V;

// uniform bvec3 u_filterGlobalMM;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 v_uv;
varying vec3 v_cm_zbed;

// varying vec3 v_cm_U;
// varying vec3 v_cm_V;
varying float v_dem;

varying vec3 v_cm_r_CMAA;
varying vec3 v_cm_g_CMAA;
varying vec3 v_cm_b_CMAA;
varying vec3 v_cm_a_CMAA;

varying float test1;

uniform bool u_toscreen;

uniform float u_water_wave_speed;// = .80;

    // Water Scale, scales the water, not the background.
uniform float u_water_wave_scale;// = 0.5;

    // Water opacity, higher opacity means the water reflects more light.
    // float opacity = 0.105;//白斑
uniform float u_water_wave_opacity;// = 0.015;//浅色斑

uniform bool u_enable_CMAA;

vec4 texture(sampler2D s, vec2 c) {
    return texture2D(s, c);
}
vec4 texture(sampler2D s, vec2 c, float b) {
    return texture2D(s, c, b);
}
vec4 texture(samplerCube s, vec3 c) {
    return textureCube(s, c);
}
vec4 texture(samplerCube s, vec3 c, float b) {
    return textureCube(s, c, b);
}

float avg(vec4 color) {
    return (color.r + color.g + color.b) / 3.0;
}
vec4 CMC(vec2 uv, vec3 CM) {
    if(uv.x < .0)
        uv.x = .0;
    if(uv.y < .0)
        uv.y = .0;
    if(uv.x > 1.0)
        uv.x = 1.0;
    if(uv.y > 1.0)
        uv.y = 1.0;
    float step = 12.0;
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];
    float dv = 1.0 / step;
    float vv = v;
    vec4 fragColor = vec4(0);

    if(vv <= 0.08333333333333333) {
        fragColor = vec4(0.0, 0, 1.0, 1.0);
    } else if(vv > 0.08333333333333333 && vv <= 0.16666666666666666) {
        fragColor = vec4(0.0, 0.3607843137254902, 1.0, 1.0);
    } else if(vv > 0.16666666666666666 && vv <= 0.250) {
        fragColor = vec4(0.0, 0.7254901960784313, 1.0, 1.0);
    } else if(vv > 0.250 && vv <= 0.3333333333333333) {
        fragColor = vec4(0.0, 1., 0.9058823529411765, 1.0);
    } else if(vv > 0.3333333333333333 && vv <= 0.41666666666666663) {
        fragColor = vec4(0.0, 1., 0.5450980392156862, 1.0);
    } else if(vv > 0.41666666666666663 && vv <= 0.49999999999999994) {
        fragColor = vec4(0.0, 1., 0.1803921568627451, 1.0);
    } else if(vv > 0.49999999999999994 && vv <= 0.5833333333333333) {
        fragColor = vec4(0.1803921568627451, 1., 0., 1.0);
    } else if(vv > 0.5833333333333333 && vv <= 0.6666666666666666) {
        fragColor = vec4(0.5450980392156862, 1., 0., 1.0);
    } else if(vv > 0.6666666666666666 && vv <= 0.75) {
        fragColor = vec4(0.9058823529411765, 1., 0., 1.0);
    } else if(vv > 0.75 && vv <= 0.8333333333333334) {
        fragColor = vec4(1., .7254901960784313, 0., 1.0);
    } else if(vv > 0.8333333333333334 && vv <= 0.9166666666666667) {
        fragColor = vec4(1., .3607843137254902, 0., 1.0);
    } else {
        fragColor = vec4(1., 1.0, 1., 1.0);
    }

    return fragColor;
}
vec4 CMC6(vec2 uv, vec3 CM) {
    if(uv.x < .0)
        uv.x = .0;
    if(uv.y < .0)
        uv.y = .0;
    if(uv.x > 1.0)
        uv.x = 1.0;
    if(uv.y > 1.0)
        uv.y = 1.0;
    float step = 12.0;
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];
    float dv = 1.0 / step;
    float vv = v;
    // vec4 fragColor = vec4(1, 0.6, 0, 1.0);
    vec4 fragColor = vec4(0);
    if(vv < 0.0) {
        fragColor = vec4(0.3);
        discard;
    } else if(vv == 0.0) {
        if(u_enable_CMAA == true) {
            if(v_dem == 0.0) {
                discard;
                gl_FragColor = vec4(0);
            // return;
            }
        }
        fragColor = vec4(0.5);
        discard;
    } else if(vv <= 0.1 && vv >= 0.) {
        // fragColor = vec4(float(20.0 / 255.0), float(20.0 / 255.0), float(246.0 / 255.0), 1.0);
        fragColor = vec4(float(203.0 / 255.0), float(225.0 / 255.0), float(246.0 / 255.0), 1.0);
    } else if(vv > 0.1 && vv <= 0.15) {
        fragColor = vec4(float(160.0 / 255.0), float(210.0 / 255.0), float(234.0 / 255.0), 1.0);
    } else if(vv > 0.15 / 6.0 && vv <= 0.27) {
        fragColor = vec4(float(135.0 / 255.0), float(212.0 / 255.0), float(241.0 / 255.0), 1.0);
    } else if(vv > 0.27 && vv <= 0.4) {
        fragColor = vec4(float(75.0 / 255.0), float(148.0 / 255.0), float(192.0 / 255.0), 1.0);
    } else if(vv > 0.4 && vv <= 0.6) {
        fragColor = vec4(float(31.0 / 255.0), float(119.0 / 255.0), float(172.0 / 255.0), 1.0);
    } else if(vv > 0.6) {
        fragColor = vec4(float(17.0 / 255.0), float(100.0 / 255.0), float(165.0 / 255.0), 1.0);
    } 
    // else if(vv > 0.6) {
    //     fragColor = vec4(0, 1, 0, 1.0);
    // }
    return fragColor;
}

void main() {
    // if( v_cm_zbed_CMAA[0] == 1.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    // }
    // return;

    if(u_enable_CMAA == true) {
        if(v_dem == 0.0) {
            // discard;
            gl_FragColor = vec4(0);
            // return;
        }
    } else if(v_dem == 0.0) {
        discard;
        // gl_FragColor = vec4(0);
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

    cm1 = v_cm_r_CMAA[0];
    cm2 = v_cm_r_CMAA[1];
    cm3 = v_cm_r_CMAA[2];

    // float cmP1 = mix(u_zbed_mm.x, u_zbed_mm.y, cm1);
    // float cmP2 = mix(u_zbed_mm.x, u_zbed_mm.y, cm2);
    // float cmP3 = mix(u_zbed_mm.x, u_zbed_mm.y, cm3);

    // cm1 = cmP1;
    // cm2 = cmP2;
    // cm3 = cmP3;

    // gl_FragColor = CMC6(v_uv, vec3(cm1, cm2, cm3));                      //有波纹 

    // float vm1 = v_cm_g_CMAA[0];
    // float vm2 = v_cm_g_CMAA[1];
    // float vm3 = v_cm_g_CMAA[2];
    // //1vs3
    // if(vm1 > 99.0) {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    //     return;
    // }
    // //2vs2
    // if(vm1 > 89.0) {
    //     gl_FragColor = vec4(1, 0.5, 0, 1);
    //     return;
    // }
    // //1vs1
    // if(vm1 > 79.0) {
    //     gl_FragColor = vec4(1, 1, 0, 1);
    //     return;
    // }
    // //超次
    // if(vm1 > 69.0) {
    //     gl_FragColor = vec4(0, 0, 0, 1);
    //     return;
    // }

    // //超限
    // if(vm1 > 49.0) {
    //     gl_FragColor = vec4(0, 1, 0, 1);
    //     return;
    // }

    // return;

    float speed = u_water_wave_speed;//.80;

    // // Water Scale, scales the water, not the background.
    float scale = u_water_wave_scale;//0.5;

    // // Water opacity, higher opacity means the water reflects more light.
    // // float opacity = 0.105;//白斑
    // float opacity = 0.015;//浅色斑
    float opacity = u_water_wave_opacity;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;//(fragCoord / iResolution.xy);
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    vec4 background = CMC6(vec2(uv) + avg(water1) * 0.025, vec3(cm1, cm2, cm3));                      //有波纹 

    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.83) {//0.3无第二层，0.93釉第二层
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 2.15) {//原值0.75，在cesium中调整为2.15
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}