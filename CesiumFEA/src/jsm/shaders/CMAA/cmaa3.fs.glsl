precision highp float;

uniform sampler2D u_channel0;
uniform bool u_origin;

uniform float u_Umin;
uniform float u_Vmin;
uniform float u_Umax;
uniform float u_Vmax;

uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform float u_w;
uniform float u_h;

uniform float u_round;
uniform float u_limit;

// varying vec2 v_tex_pos;
varying vec2 v_textureCoordinates;

float value_limit = 0.1;

vec4 one_vs_three(vec4 a, vec4 b, vec4 c, vec4 d) {
    float fr, fg, fb, fa;
    float alpha = b.a;
    if(alpha < c.a) {
        alpha = c.a;
    }
    if(alpha < d.a) {
        alpha = d.a;
    }

    fr = (b.r + c.r + d.r) / 3.0 - value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = (b.g + c.g + d.g) / 3.0;
    fb = (b.b + c.b + d.b) / 3.0;

    fa = alpha + 1.0;

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
    float alpha = b.a;
    if(alpha < c.a) {
        alpha = c.a;
    }

    fr = (b.r + c.r) / 3.0 - value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = (b.g + c.g) / 3.0;
    fb = (b.b + c.b) / 3.0;
    fa = alpha + 1.0;

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
    float alpha = one.a;

    fr = (one.r) / 4.0 - value_limit;//这里以zbed为基准，其他参数以zbed的值为是否进行discar的判断
    fg = one.g / 4.0;
    fb = one.b / 4.0;
    fa = alpha + 1.0;

    return vec4(fr, fg, fb, fa);
}

void main() {
    // gl_FragColor = vec4(0.0);
    // return;
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

    if(u_origin == true) {//first time
        gl_FragColor = rgba5;
        //   gl_FragColor = vec4(0);
        return;
    } else {
        // gl_FragColor = vec4(-1.0);
        // return;
        gl_FragColor = vec4(0.0);
    }

    if(rgba5.a > 0.0 || rgba5.a == -1.0) {// second ++
        gl_FragColor = rgba5;
        return;
    } else if(rgba5.r <= u_limit) {
        gl_FragColor = rgba5;
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

    float t_a = 0.0;// rgba1.a + rgba2.a + rgba4.a;
    float t_b = 0.0;// rgba2.a + rgba3.a + rgba6.a;
    float t_c = 0.0;// rgba4.a + rgba7.a + rgba8.a;
    float t_d = 0.0;// rgba6.a + rgba8.a + rgba9.a;

    //over limit round
    if(rgba1.a > u_round || rgba2.a > u_round || rgba4.a > u_round) {
        t_a = 0.;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba1.a != 0.0) {
            t_a += 1.0;
        }
        if(rgba2.a != 0.0) {
            t_a += 1.0;
        }
        if(rgba4.a != 0.0) {
            t_a += 1.0;
        }
    }
    if(rgba2.a > u_round || rgba3.a > u_round || rgba6.a > u_round) {
        t_b = 0.;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba2.a != 0.0) {
            t_b += 1.0;
        }
        if(rgba3.a != 0.0) {
            t_b += 1.0;
        }
        if(rgba6.a != 0.0) {
            t_b += 1.0;
        }
    }
    if(rgba4.a > u_round || rgba7.a > u_round || rgba8.a > u_round) {
        t_c = 0.;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba4.a != 0.0) {
            t_c += 1.0;
        }
        if(rgba7.a != 0.0) {
            t_c += 1.0;
        }
        if(rgba8.a != 0.0) {
            t_c += 1.0;
        }
    }

    if(rgba6.a > u_round || rgba8.a > u_round || rgba9.a > u_round) {
        t_d = 0.;
        gl_FragColor = vec4(0, 0, 0, 1000);
        return;
    } else {
        if(rgba6.a != 0.0) {
            t_d += 1.0;
        }
        if(rgba8.a != 0.0) {
            t_d += 1.0;
        }
        if(rgba9.a != 0.0) {
            t_d += 1.0;
        }
    }

    gl_FragColor = rgba5;// vec4(1);
    //1vs3
    if(t_d == 3.0 || t_c == 3.0 || t_b == 3.0 || t_a == 3.0) {
        vec4 a, b, c;
        if(t_a == 3.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 3.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 3.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 3.0) {
            a = rgba8;
            b = rgba9;
            c = rgba6;
        }
        gl_FragColor = one_vs_three(rgba5, a, b, c);
        // gl_FragColor = vec4(1);

    } 
    //2vs2
    else if(t_d == 2.0 || t_c == 2.0 || t_b == 2.0 || t_a == 2.0) {
        vec4 a, b, c;
        if(t_a == 2.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 2.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 2.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 2.0) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = two_vs_two(rgba5, a, b, c);
    } 
    //1v1
    else if(t_d == 1.0 || t_c == 1.0 || t_b == 1.0 || t_a == 1.0) {
        vec4 a, b, c;
        if(t_a == 1.0) {
            a = rgba4;
            b = rgba1;
            c = rgba2;
        } else if(t_b == 1.0) {
            a = rgba2;
            b = rgba3;
            c = rgba6;
        } else if(t_c == 1.0) {
            a = rgba4;
            b = rgba7;
            c = rgba8;
        } else if(t_d == 1.0) {
            a = rgba7;
            b = rgba8;
            c = rgba9;
        }
        gl_FragColor = one_vs_one(rgba5, a, b, c);
    }
    if(gl_FragColor.r < u_limit) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, u_round + 1.0);
    }

}
