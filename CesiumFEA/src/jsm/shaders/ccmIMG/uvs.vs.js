let uvsVS =
    `attribute float a_index;
attribute float a_tp;
// attribute vec2 a_uv;

uniform sampler2D u_DS;
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

//20231221
uniform vec4 u_xy_mm;//wind map fix ,other shader in js don't 

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;
void main() {
    // v_uv = a_uv;
    float cols = u_DS_XY.x;
    float rows = u_DS_XY.y;
    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    v_dem = 1.0;
    vec4 rgba1;
    vec4 rgba2;
    vec4 rgba3;

    if(a_tp == 0.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 1.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);

    } else if(a_tp == 2.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    } else if(a_tp == 3.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
        v_uv = vec2(0);
    } else if(a_tp == 4.0) {
        rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1, 0);
    } else if(a_tp == 5.0) {
        rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
        rgba2 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
        v_uv = vec2(1);
    }
    // if(a_tp == 0.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(0);
    // } else if(a_tp == 1.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(1, 0);

    // } else if(a_tp == 2.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(1);
    // } else if(a_tp == 3.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 1.0) / u_DS_XY.y));
    //     v_uv = vec2(0);
    // } else if(a_tp == 4.0) {
    //     rgba1 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col - 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(1, 1);
    // } else if(a_tp == 5.0) {
    //     rgba1 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row - 1.0) / u_DS_XY.y));
    //     rgba2 = texture2D(u_DS, vec2((col + 1.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     rgba3 = texture2D(u_DS, vec2((col + 0.0) / u_DS_XY.x, (row + 0.0) / u_DS_XY.y));
    //     v_uv = vec2(0, 1);
    // }
    v_cm_UV00 = vec2(rgba1.g, rgba1.b);
    // v_uv = vec2((col + 0.0) / cols, (row + 0.0) / rows);
    v_uv = vec2((col - u_xy_mm.x) / (u_xy_mm.z - u_xy_mm.x), (row - u_xy_mm.y) / (u_xy_mm.w - u_xy_mm.y));

    v_cm_zbed = vec3(rgba1.r, rgba2.r, rgba3.r);
    v_cm_U = vec3(rgba1.g, rgba2.g, rgba3.g);
    v_cm_V = vec3(rgba1.b, rgba2.b, rgba3.b);
    if(rgba1.a == 0.0 || rgba2.a == 0.0 || rgba3.a == 0.0) {
        v_dem = 0.0;
    }

    // v_uv = vec2(col / u_DS_XY.x, row / u_DS_XY.y);//IMG 使用
    rgba1 = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a)), 1.0);

    // vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, u_dem_base + rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r) + rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a) * 3., 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);

}
`
export { uvsVS }