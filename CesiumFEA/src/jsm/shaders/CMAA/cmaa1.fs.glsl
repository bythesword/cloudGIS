precision highp float;

uniform sampler2D u_channel0;
uniform float u_Umin;
uniform float u_Vmin;
uniform float u_Umax;
uniform float u_Vmax;

uniform float u_w;
uniform float u_h;

uniform float u_rate1;
uniform float u_rate2;
uniform float u_rate3;

uniform float u_limit;

uniform float u_alpha;

// uniform int u_round;

// varying vec2 v_tex_pos;
varying vec2 v_textureCoordinates;
vec4 one_vs_three(vec4 a, vec4 b, vec4 c, vec4 d) {
    float fr, fg, fb, fa;
    float rate_r = 0.6;
    float rate_g = 0.6;
    float rate_b = 0.6;
    vec2 min = vec2(u_Umin, u_Vmin);
    vec2 max = vec2(u_Umax, u_Vmax);
    // 水平速度为红色，垂直速度为绿色。

    // vec2 uv_a = mix(min, max, (a.gb * 255.0 - 1.0) / 254.0);
    vec2 uv_b = mix(min, max, (b.gb * 255.0 - 1.0) / 254.0);
    vec2 uv_c = mix(min, max, (c.gb * 255.0 - 1.0) / 254.0);
    vec2 uv_d = mix(min, max, (d.gb * 255.0 - 1.0) / 254.0);

    if(b.g == 0.0)
        uv_b.x = 0.0;
    if(b.b == 0.0)
        uv_b.y = 0.0;
    if(c.g == 0.0)
        uv_c.x = 0.0;
    if(c.b == 0.0)
        uv_c.y = 0.0;
    if(d.g == 0.0)
        uv_d.x = 0.0;
    if(d.b == 0.0)
        uv_d.y = 0.0;

    fr = (b.r + c.r + d.r) / 3.0 * u_rate3 + u_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = ((uv_b.x + uv_c.x + uv_d.x) / 3.0 * u_rate3 - min.x) / (max.x - min.x);
    fb = ((uv_b.y + uv_c.y + uv_d.y) / 3.0 * u_rate3 - min.x) / (max.x - min.x);
    fa = u_alpha;

    //    gl_FragColor.rgb = u_rate3 * gl_FragColor.rgb + u_limit;
    return vec4(fr, fg, fb, fa);
}

vec4 two_vs_two(vec4 a, vec4 B, vec4 C, vec4 D) {
    vec4 b, c, d;
    if(B.a == 0.0) {
        b = C;
        c = D;
    }
    if(C.a == 0.0) {
        b = B;
        c = D;
    }
    if(D.a == 0.0) {
        b = B;
        c = C;
    }

    float fr, fg, fb, fa;

    vec2 min = vec2(u_Umin, u_Vmin);
    vec2 max = vec2(u_Umax, u_Vmax);
    // 水平速度为红色，垂直速度为绿色。

    // vec2 uv_a = mix(min, max, (a.gb * 255.0 - 1.0) / 254.0);
    vec2 uv_b = mix(min, max, (b.gb * 255.0 - 1.0) / 254.0);
    vec2 uv_c = mix(min, max, (c.gb * 255.0 - 1.0) / 254.0);

    if(b.g == 0.0)
        uv_b.x = 0.0;
    if(b.b == 0.0)
        uv_b.y = 0.0;
    if(c.g == 0.0)
        uv_c.x = 0.0;
    if(c.b == 0.0)
        uv_c.y = 0.0;

    fr = (b.r + c.r) / 2.0 * u_rate2 + u_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = ((uv_b.x + uv_c.x) / 3.0 * u_rate2 - min.x) / (max.x - min.x);
    fb = ((uv_b.y + uv_c.y) / 3.0 * u_rate2 - min.x) / (max.x - min.x);
    fa = u_alpha;

    //    gl_FragColor.rgb = u_rate3 * gl_FragColor.rgb + u_limit;
    return vec4(fr, fg, fb, fa);
}
vec4 one_vs_one(vec4 a, vec4 B, vec4 C, vec4 D) {

    vec4 one;
    if(B.a != 0.0) {
        one = B;
    }
    if(C.a != 0.0) {
        one = C;
    }
    if(D.a == 0.0) {
        one = D;
    }

    float fr, fg, fb, fa;

    vec2 min = vec2(u_Umin, u_Vmin);
    vec2 max = vec2(u_Umax, u_Vmax);
    // 水平速度为红色，垂直速度为绿色。

    vec2 uv_one = mix(min, max, (one.gb * 255.0 - 1.0) / 254.0);

    if(one.g == 0.0)
        uv_one.x = 0.0;
    if(one.b == 0.0)
        uv_one.y = 0.0;

    fr = (one.r) / 4.0 * u_rate1 + u_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = ((uv_one.x) / 4.0 * u_rate1 - min.x) / (max.x - min.x);
    fb = ((uv_one.y) / 4.0 * u_rate1 - min.x) / (max.x - min.x);
    fa = u_alpha;

    //    gl_FragColor.rgb = u_rate3 * gl_FragColor.rgb + u_limit;
    return vec4(fr, fg, fb, fa);
}
struct do_color {
    bool done;
    vec4 color;
};

void main() {
    /*
    7 8 9
    4 5 6
    1 2 3

    c d
    a b
    */
    vec4 rgba0 = vec4(0);
    vec4 rgba1 = vec4(0);
    vec4 rgba2 = vec4(0);
    vec4 rgba3 = vec4(0);
    vec4 rgba4 = vec4(0);
    vec4 rgba5 = vec4(0);
    vec4 rgba6 = vec4(0);
    vec4 rgba7 = vec4(0);
    vec4 rgba8 = vec4(0);
    vec4 rgba9 = vec4(0);
    rgba5 = texture2D(u_channel0, v_textureCoordinates);

    if(rgba5.a != 0.0) {
        // discard;
        gl_FragColor = rgba5;
        // gl_FragColor.a = u_alpha;
        return;
    }

    if(v_textureCoordinates.x == 0.0 && v_textureCoordinates.y == 0.0) {
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.x == 1.0 && v_textureCoordinates.y == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
    } else if(v_textureCoordinates.x == 0.0) {
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.x == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));

    } else if(v_textureCoordinates.y == 0.0) {
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    } else if(v_textureCoordinates.y == 1.0) {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
    } else {
        rgba1 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba2 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba3 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h - 1.0) / u_h));
        rgba4 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba6 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 0.0) / u_h));
        rgba7 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w - 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba8 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 0.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
        rgba9 = texture2D(u_channel0, vec2((v_textureCoordinates.x * u_w + 1.0) / u_w, (v_textureCoordinates.y * u_h + 1.0) / u_h));
    }

    float t_a = rgba1.a + rgba2.a + rgba4.a;
    float t_b = rgba2.a + rgba3.a + rgba6.a;
    float t_c = rgba4.a + rgba7.a + rgba8.a;
    float t_d = rgba7.a + rgba8.a + rgba9.a;

    // u_alpha =1(orign ),=0.7(⚪),=-0.5（⚪+圆形）,=0.3（空心圆圈） =0.0
    gl_FragColor = rgba5;// vec4(1);

    if(t_d == u_alpha * 3.0 || t_c == u_alpha * 3.0 || t_b == u_alpha * 3.0 || t_a == u_alpha * 3.0) {
        vec4 a, b, c;
        if(t_a == u_alpha * 3.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == u_alpha * 3.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == u_alpha * 3.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == u_alpha * 3.0) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = one_vs_three(rgba5, a, b, c);
        // gl_FragColor = vec4(1);

    } 

    else if(t_d == u_alpha * 2.0 || t_c == u_alpha * 2.0 || t_b == u_alpha * 2.0 || t_a == u_alpha * 2.0) {
        vec4 a, b, c;
        if(t_a == u_alpha * 2.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == u_alpha * 2.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == u_alpha * 2.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == u_alpha * 2.0) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = two_vs_two(rgba5, a, b, c);
        gl_FragColor.rgb = u_rate2 * gl_FragColor.rgb + u_limit;
    } else if(t_d == u_alpha * 1.0 || t_c == u_alpha * 1.0 || t_b == u_alpha * 1.0 || t_a == u_alpha * 1.0) {
        vec4 a, b, c;
        if(t_a == u_alpha * 1.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == u_alpha * 1.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == u_alpha * 1.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == u_alpha * 1.0) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = one_vs_one(rgba5, a, b, c);
        gl_FragColor.rgb = u_rate1 * gl_FragColor.rgb + u_limit;
    }

}
