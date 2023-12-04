// precision mediump float;
precision highp float;

// attribute float a_index;
attribute vec2 position;//两个三角形，六个点，六次执行

// uniform sampler2D u_particles;//js 每次更新
// uniform float u_particles_res;//32 ,if counts =1024

// uniform float u_w;
// uniform float u_h;
// varying  float v_WHT;

varying vec2 v_tex_pos;



void main() {
    v_tex_pos = position;
    gl_Position = vec4( 2.0 * position-1.0, 0, 1);//-1.0，1.0,
    // gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);//从0.0，1.0，变换到1.0，-1.0，对调,
}

