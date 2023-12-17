precision mediump float;
attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

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

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;

varying vec2 v_uv;
varying vec3 v_cm_zbed;

varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying float test1;
varying vec2 v_cm_UV00;

uniform sampler2D u_DS;
uniform sampler2D u_DS_new;

varying vec3 v_cm_r_CMAA;
varying vec3 v_cm_g_CMAA;
varying vec3 v_cm_b_CMAA;
varying vec3 v_cm_a_CMAA;
void main() {
    // v_uv = a_uv;

    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;
    vec4 rgba4;
//34
//12
//124 one
//143 two
    vec2 a = vec2(0);
    vec2 b = vec2(0);
    vec2 c = vec2(0);
    vec2 d = vec2(0);
    if(a_tp == 0.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col - 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(1, 0);
    } else if(a_tp == 2.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(1, 0);
    } else if(a_tp == 5.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213

        v_uv = vec2(1);
    }
    // float zbed_down=-.60;
    // if(rgba1.a == 0.0 ) {
    //     rgba1.r=zbed_down;
    // }
    // if(rgba2.a == 0.0 ) {
    //     rgba2.r=zbed_down;
    // }
    // if(rgba3.a == 0.0 ) {
    //     rgba3.r=zbed_down;
    // }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_r_CMAA = vec3(texture2D(u_DS_new, a).r, texture2D(u_DS_new, b).r, texture2D(u_DS_new, c).r);
    v_cm_g_CMAA = vec3(texture2D(u_DS_new, a).g, texture2D(u_DS_new, b).g, texture2D(u_DS_new, c).g);
    v_cm_b_CMAA = vec3(texture2D(u_DS_new, a).b, texture2D(u_DS_new, b).b, texture2D(u_DS_new, c).b);
    v_cm_a_CMAA = vec3(texture2D(u_DS_new, a).a, texture2D(u_DS_new, b).a, texture2D(u_DS_new, c).a);

    // v_dem_CMAA = texture2D(u_DS_new, vec2(col/ u_DS_XY.x, row / u_DS_XY.y)).r;
    test1 = 1.0;

    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0 || rgba4.a == 0.0) {
        v_dem = 0.0;
    }

    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z = 0.;
    // if(u_dem_enable == true)
    //     // z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
    //     z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? 0.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));

    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, z, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);

}
