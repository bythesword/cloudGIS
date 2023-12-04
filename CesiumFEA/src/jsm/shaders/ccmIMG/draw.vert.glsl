precision mediump float;

attribute float a_index;
// uniform sampler2D u_particles;//js 每次更新
uniform sampler2D u_channel0;//js 每次更新
uniform float u_particles_res;//32 ,if counts =1024
uniform float u_w;
uniform float u_h;
uniform float u_pointSize;

varying vec2 v_particle_pos;
varying vec2 ccc;
varying float iii;

void main() {
    // vec4 color = texture2D(u_channel0, vec2(fract((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w),//0.0-1.0之间即可，可以再乘除其他系数
    // floor(a_index / u_particles_res  ) / u_h));//同上 9.0 等，随意

    //0.0-1.0之间即可，可以再乘除其他系数
    //channel0=PST1
    vec4 color = texture2D(u_channel0, vec2((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w,
     1.0 - floor(a_index / u_particles_res) / u_h));//同上 9.0 等，随意
// vec4 color = texture2D(u_channel0, vec2((a_index - floor(a_index / u_particles_res) * u_particles_res) / u_w, floor(a_index / u_particles_res) / u_h));//同上 9.0 等，随意
    // decode current particle position from the pixel's RGBA value
    //位置，index，update.GLSL
    //是png中的位置，vec2 0.0-1.0之间的
    v_particle_pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a);

    iii = a_index;
    ccc = color.ba;

    gl_PointSize = u_pointSize;//1.0;//

    //从公式看，x0.0-1.0,y=-1.0-0.0
    //是点的输出位置
    //无系数，是右上的1/4，upside down 
    //end,左右扩张，上下对调+扩张
    // gl_Position = vec4(2.0 * v_particle_pos.x - 1.0,  1.0-2.0 * v_particle_pos.y, 0, 1);//输出到纹理的问题？

    //目前
    gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 2.0 * v_particle_pos.y - 1.0, 0, 1);//输出到纹理的问题？
    // gl_Position = vec4(v_particle_pos.x, v_particle_pos.y, 0, 1);//输出到纹理的问题？
    // gl_Position = vec4(v_particle_pos, 0, 1);//输出到纹理的问题？

}
