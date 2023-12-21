precision mediump float;
attribute float a_index;

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
void main() {
    float row = floor(a_index / u_DS_XY.x);
    float col = a_index - row * u_DS_XY.x;
    rgba = texture2D(u_DS, vec2(col / u_DS_XY.x, row / u_DS_XY.y));
    float z = 0.;
    // if(u_dem_enable == true)
    //     // z = u_dem_base + u_z_rateZbed * (rgba1.a == 0.0 ? 0.0 : mix(v_cm_zbed.x, v_cm_zbed.y, rgba1.r)) + u_z_enable_dem_rate * (rgba1.a == 0.0 ? -50.0 : mix(u_dem_mm.x, u_dem_mm.y, rgba1.a));
    //     z = u_dem_base;

    vec4 position = vec4(col * u_DS_CellSize, row * u_DS_CellSize, z, 1.0);
    gl_Position = czm_projection * czm_view * czm_model * position;
    // gl_Position = position;//vec4(1);
}
