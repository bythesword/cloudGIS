uniform sampler2D u_DS;
uniform vec2 u_DS_XY;
uniform float u_DS_CellSize;
uniform bool u_dem_enable;
uniform float u_dem_base;
uniform float u_CMType;

uniform vec2 u_U_mm;
uniform vec2 u_V_mm;
uniform vec2 u_dem_mm;
uniform vec2 u_zbed_mm;

uniform bool u_UVs;
uniform ivec3 u_filterKind;
uniform bvec3 u_filter;
uniform vec2 u_filterValue_zebd;
uniform vec2 u_filterValue_U;
uniform vec2 u_filterValue_V;

varying vec2 v_uv;
varying vec3 v_cm_zbed;
varying vec3 v_cm_U;
varying vec3 v_cm_V;
varying float v_dem;
varying vec2 v_cm_UV00;
uniform float iTime;  

#define PI 3.14159265358979
float timeSpeed = 2.0;
float reflectionAmount = 100.0; //100.0 = 100%
float reflectionIntensity = 0.0;
float objectScale = 1.0; //1.0 is default
float causticScale = 1.0; // 1.0 is default

float randomVal(float inVal) {
    return fract(sin(dot(vec2(inVal, 2523.2361), vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
}

vec2 randomVec2(float inVal) {
    return normalize(vec2(randomVal(inVal), randomVal(inVal + 151.523)));
}
float makeWaves(vec2 uv, float theTime, float offset) {
    float result = 0.0 + ((reflectionAmount / 100.0) - (1.0));
    float direction = 0.0;
    float sineWave = 0.0;
    vec2 randVec = vec2(1.0, 0.0);
    float i;
    for(int n = 0; n < 16; n++) {
        i = float(n) + offset;
        //theTime += cursorDistance;
        randVec = randomVec2(float(i));
        direction = (uv.x * randVec.x + uv.y * randVec.y);
        sineWave = sin(direction * randomVal(i + 1.6516) + (theTime * timeSpeed));
        sineWave = smoothstep(0.0, 1.0, sineWave);
        result += randomVal(i + 123.0) * sineWave;
    }
    return result;
}

void main() {
    if(v_dem == 0.0)
        discard;

    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
	//vec2 uv = fragCoord.xy / iResolution.x; //Uncomment for square image
    vec2 uv = v_uv;

    vec2 uv2 = uv * (2150.0 / causticScale); // scale
    uv /= objectScale;

    float result = 0.0;
    float result2 = 0.0;

    result = makeWaves(uv2 + vec2(iTime * timeSpeed, 0.0), iTime, 0.1);
    result2 = makeWaves(uv2 - vec2(iTime * 0.8 * timeSpeed, 0.0), iTime * 0.8 + 0.06, 0.26);

    //result *= 2.6;

    result = smoothstep(0.4, 1.1, 1.0 - abs(result)) + (reflectionIntensity * 0.1);
    result2 = smoothstep(0.4, 1.1, 1.0 - abs(result2)) + (reflectionIntensity * 0.1);

    result = 2.0 * smoothstep(0.35, 1.8, (result + result2) * 0.5);

	//fragColor = vec4(result)*0.7+texture( iChannel0 , uv );

    // thank for this code below Shane!
    vec2 p = vec2(result, result2) * .015 + sin(uv * 16. - cos(uv.yx * 16. + iTime * timeSpeed)) * .015; // Etc.
    gl_FragColor = vec4(0,result*0.9,result,1)    ;
}
