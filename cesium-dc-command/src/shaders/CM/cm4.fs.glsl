varying vec2 v_uv;

uniform float iTime;
vec2 iResolution = vec2(100, 100);

void main() {

    // Normalized pixel coordinates (from 0 to 1)
    // vec2 uv = v_uv / iResolution.xy;
    vec2 uv = v_uv;

    float step = 12.0;

    vec3 CM = vec3(1.0, 0.50, .0);
    vec4 C1 = vec4(1., 0.5, 1.0, 0.5);
    vec3 C2 = vec3(5., 1., .5);

    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];

    float dv = 1.0 / step;

    float vv = v;

/*    if( vv <= 0.2 ) {
        fragColor = vec4(0.0, vv/0.2, 1.0, 1.0);
    }    else if ( vv > 0.2 && vv <= 0.5) {
         fragColor = vec4(0.0, 1.0, 1.0-(vv-0.2)/0.3 , 1.0);
    }else if ( vv > 0.5 && vv <= 0.8) {
        fragColor = vec4( (vv-0.5)/0.3, 1.0, 0.0, 1.0);
    }else{
        fragColor = vec4( 1.0, 1.0-(vv-0.8)/0.2, 0.0, 1.0);
    }
*/
    vec4 fragColor = vec4(1);
    if(vv <= 0.08333333333333333 && vv >= 0.) {
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
    } else if(vv > 0.9166666666666667 && vv <= 1.0) {
        fragColor = vec4(1., .0, 0., 1.0);
    } else {
        fragColor = vec4(1.0, 1.0, 1., 1.0);
    }
    gl_FragColor = fragColor;

    //fragColor = vec4( .0 ,.0, 1., 1.0); 
    // Time varying pixel color
    // vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    //fragColor = vec4(col,1.0);
}