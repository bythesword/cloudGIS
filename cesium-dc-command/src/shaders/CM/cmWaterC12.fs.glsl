uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 v_uv;

varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;

vec2 iResolution = vec2(1, 1);

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
    // vec3 CM = vec3(1.0, 0.50, .0);
    // vec4 C1 = vec4(1., 0.5, 1.0, 0.5);
    // vec3 C2 = vec3(5., 1., .5);
    float w1 = (1.0 - uv.x);
    float w2 = (uv.x - uv.y);
    float w3 = uv.y;

    float v = w1 * CM[0] + w2 * CM[1] + w3 * CM[2];
    float dv = 1.0 / step;
    float vv = v;
    vec4 fragColor = vec4(1, 0, 0, 1);

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

    return fragColor;
}

void main() {
  
    float speed = .80;

    // Water Scale, scales the water, not the background.
    float scale = 1.;

    // Water opacity, higher opacity means the water reflects more light.
    float opacity = 0.105;//白斑
    // float opacity = 0.05;//浅色斑

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

    // Background image
    // vec4 background = texture(iChannel1, vec2(uv) + avg(water1) * 0.05);
    vec3 CM = vec3(1.0, 0.50, .0);
    vec4 background = CMC(vec2(uv) + avg(water1) * 0.035, CM);                      //有波纹 

    // background=vec4(0,0,1,1);
    // Average the colors of the water layers (convert from 1 channel to 4 channel
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
    gl_FragColor = (water1+water2  ) * alpha + background;
}
