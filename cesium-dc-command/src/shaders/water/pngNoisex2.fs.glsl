varying vec2 v_uv;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D u_background;
float avg(vec4 color) {
    return (color.r + color.g + color.b) / 3.0;
}

void main() {
    // Flow Speed, increase to make the water flow faster.
    float speed = 1.3150;//原值=1.0 //如果噪点小，channel 0 和 2都可以更好，可以选择0.5的值

    // Water Scale, scales the water, not the background.
    float scale = 0.8;//噪点的尺寸

    // Water opacity, higher opacity means the water reflects more light.
    float opacity = 0.235;//原值=0.5时，会有白色斑块

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = v_uv;
    vec2 scaledUv = uv * scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture2D(iChannel0, scaledUv + iTime * 0.02 * speed - 0.1);
    vec4 water2 = texture2D(iChannel0, scaledUv.xy + iTime * speed * vec2(-0.02, -0.02) + 0.1);

    // Water highlights
    vec4 highlights1 = texture2D(iChannel1, scaledUv.xy + iTime * speed / vec2(-10, 100));
    vec4 highlights2 = texture2D(iChannel1, scaledUv.xy + iTime * speed / vec2(10, 100));

    // Background image
    vec4 background = texture2D(u_background, vec2(uv) + avg(water1) * 0.05);

    // Average the colors of the water layers (convert from 1 channel to 4 channel
    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));

    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1) / 1.5);
    highlights2.rgb = vec3(avg(highlights2) / 1.5);

    float alpha = opacity;

    if(avg(water1 + water2) > 0.3) {
        alpha = 0.0;
    }

    if(avg(water1 + water2 + highlights1 + highlights2) > 0.75) {
        alpha = 5.0 * opacity;
    }

    // Output to screen
    gl_FragColor = (water1 + water2) * alpha + background;
}
