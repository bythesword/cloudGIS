varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;
uniform float iTime;  
/// uncoment for height quality
//#define HQ

/// epsilon
#define E 0.001

/// rotate point p around OX
vec3 rotRX(vec3 p, float l) {
    float sl = sin(l), cl = cos(l);
    return vec3(p.x, cl * p.y - sl * p.z, sl * p.y + cl * p.z);
}

/// height map
float mapH(vec2 p) {
    float r = 0.0;

    float h = 0.5;
    float ph = 0.5;
    bool am0 = true;

#ifdef HQ
    for(int a = 0; a < 9; a++)
#else
        for(int a = 0; a < 7; a++)
#endif
        {
            vec2 p2 = p;
            if(!am0) {
                p2.x = p.y;
                p2.y = p.x;
            }
            p2 *= ph;

		/// wave argument
            float v = p2.x;
            v = p2.y + sin(p2.x) + iTime;

		/// wave 0.0 to 1.0
            v = sin(v) * (0.75 - 0.25 * sin(2.0 * v));
            v = 0.5 * v - 0.5;
            v = v * v;

		/// add to final
            r += h * v;

		/// change scalars
            h *= 0.44;
            ph *= 2.0;

		/// a%2
            am0 = !am0;
        }

	/// return final value
    return r;
}

/// position of the sun (witch look like a moon, fine with me)
const vec3 sunPos = vec3(5, 40, 50);

/// sky color basing on direction ray
vec3 getSkyColor(vec3 dir) {
    return mix(vec3(0.01, 0.01, 0.13), vec3(0.5, 0.5, 0.5), clamp(2.0 * dir.z, 0.0, 1.0));
}

/// render by throwing ray from sp point in dir direction
vec3 render(vec3 sp, vec3 dir) {

	/// search hit point p2
	/// v2 = distance from camera
	/// h2 = height of water in hit point
    float v1, v2, v3;
    v1 = 0.0;
    v3 = 100.0;
    v2 = (v1 + v2) / 2.0;
    float h1, h2, h3;
    vec3 p1, p2, p3;
    h1 = mapH((p1 = sp + v1 * dir).xy);
    if(!(h1 <= p1.z)) {
        return vec3(1, 0, 0);
    }
    h3 = mapH((p3 = sp + v3 * dir).xy);
    if(!(p3.z <= h3)) {
        return getSkyColor(dir);
    }
    for(int a = 0; a < 0x200; a++) {
        v2 = 0.05 * v1 + 0.95 * v3;
        p2 = sp + v2 * dir;
        h2 = mapH(p2.xy);
        if(h2 < p2.z) {
            v1 = v2;
        } else {
            v3 = v2;
        }
    }

	/// normal
    vec3 nor = normalize(vec3((h2 - mapH(p2.xy + vec2(E, 0))), (h2 - mapH(p2.xy + vec2(0, E))), E));

	/// sun reflect
    vec3 sunDir = normalize(sunPos - p2);
    float sunRef = clamp(dot(nor, reflect(sunDir, -dir)), 0.0, 1.0);
    sunRef = 1.0 + 2.0 * pow(sunRef, 1024.0);

	/// final color
    return mix(
			/// see color
    vec3(.1, clamp(0.25 + 0.5 * h2, 0.0, 1.0), 0.99) * (0.5 + 0.5 * dot(-dir, nor)) * (0.5 + 0.5 * dot(vec3(0, 0, 1), nor)) * sunRef,
			/// sky color
    getSkyColor(dir),
			/// fog
    0.0 + clamp((v2 - 20.0) / 80.0, 0.0, 1.0));
}

void main() {
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
	//vec2 uv = fragCoord.xy / iResolution.x; //Uncomment for square image

    vec2 uv = 2.0 * v_uv - vec2(1.0, 1.0);

    vec3 sp = vec3(0.0, 0.0, 2.0);
    vec3 dir = normalize(vec3(uv.x, 4.0, uv.y));
    dir = rotRX(dir, -0.085 * 3.1415);//old -0.05

    gl_FragColor = vec4(render(sp, dir), 0.70);
}
