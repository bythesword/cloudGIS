 
uniform sampler2D u_channel0;

varying vec2 v_textureCoordinates;

void main() {
    gl_FragColor = texture2D(u_channel0, v_textureCoordinates);
   
}