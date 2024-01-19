let quadVert = `precision mediump float;

// 2 3
// 0 1
// 0.0，0.0 -->1.0，1.0
attribute vec2 position;//两个三角形，六个点，六次执行

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = position;
    //与screen同步修改
    // gl_Position = vec4( position , 0, 1);//-1.0，1.0,
    gl_Position = vec4(2.0 * position - 1.0, 0, 1);//-1.0，1.0,
    // gl_Position = vec4(1.0 - 2.0 * position, 0, 1);//从0.0，1.0，变换到1.0，-1.0，对调,
}
`
export { quadVert }