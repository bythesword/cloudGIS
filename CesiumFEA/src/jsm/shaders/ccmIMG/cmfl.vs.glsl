precision mediump float;
attribute float a_index;
attribute float a_tp;

uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform float u_z_enable_dem_rate;
uniform float u_z_baseZ;
uniform float u_z_rateZbed;

varying vec4 rgba;
varying vec2 v_uv;
varying float v_dem;
void main() {
    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;
    vec4 rgba4;
    v_dem = 1.0;
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
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
            v_dem = 0.0;
        }

    } else if(a_tp == 1.0) {
        a = vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        b = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        c = vec2((col - 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        d = vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba2.a == 0.0) {
            v_dem = 0.0;
        }

    } else if(a_tp == 2.0) {
        a = vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        b = vec2((col + 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y);
        c = vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        d = vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y);
        rgba1 = texture2D(u_DS, a);
        rgba2 = texture2D(u_DS, b);
        rgba3 = texture2D(u_DS, c);
        rgba4 = texture2D(u_DS, d);//20231213
        if(rgba1.a == 0.0 || rgba3.a == 0.0) {
            v_dem = 0.0;
        }

    }

    if(rgba1.a == 0.0 && rgba2.a == 0.0 && rgba3.a == 0.0 && rgba4.a == 0.0) {
        v_dem = 0.0;
    }

    // rgba = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z = 0.;
    // if(u_dem_enable == true)
    //     // z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
    //     z = u_dem_base;

    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, z, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);
}
