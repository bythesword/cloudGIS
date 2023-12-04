uniform sampler2D u_channel0;
uniform float iTime;
uniform vec2 u_U_mm;
uniform vec2 u_V_mm;


varying vec2 v_uv;
varying float v_dem;
varying vec2 v_cm_UV00;

//作废，不使用
float get_x(vec2 dir, float y, float b) {
    float x;
    float fa = dir.x / dir.y;
    y = fa * x + b;
    return x;
}
float get_y(vec2 dir, float x, float b) {
    float y;
    float fa = dir.y / dir.x;
    y = fa * x + b;
    return y;
}

//b在0-2之间，在屏幕范围内，公式对应于笛卡尔坐标（UV也是笛卡尔）
vec3 line(vec2 a_uv, float thickness, float b, vec2 uv) {
    if(b > 2.0) {
           // b-=4.25;//y=f*x+b,忘记了为什么是-4.25了,反正就是平面空间
    }
    vec2 dir = normalize(vec2(-a_uv.y, a_uv.x));

    float y1;
    float x1 = 1.0;
    vec2 v0 = vec2(0.0, 0.0); //线上的某个点(x=1,y=fa*x+b)
    if(dir.x == 0.0) {
        y1 = get_x(dir, x1, b);
        v0 = vec2(y1, x1);
    } else {
        y1 = get_y(dir, x1, b);
        v0 = vec2(x1, y1);
    }

    //当前求的线的向量
    //直线的单位长度法线，垂直的a_uv的线
    vec2 nor_a_uv = normalize(a_uv);

    // signed distance from p to the line
    //p到直线的有符号距离
    float dist = dot(uv - v0, nor_a_uv);//每个uv点到line的距离，核心

    float sphereMask = dist;
    //float hardness = 0.21;
    //float sphereMask = 1.0 - (distance(uv, a_uv1*-20.) / (1.0 - hardness));    
    float wavesSpeed = 4.0;
    float wavesFrequency = 6.0;

    float sine = sin(iTime * wavesSpeed + sphereMask * wavesFrequency);

    vec3 col = vec3(abs(sine) < thickness);//无过度
    //vec3 col = vec3(abs(dist)<thickness);//无过度
    //vec3 col = vec3(1.0-smoothstep(abs(dist),0.0, thickness));

    return col;

}
mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}
vec2 a_uv1 = vec2(-.5, -0.5);
float step = 0.5;

void main() {
    if(v_dem == 0.0)
        discard;
    if(v_cm_UV00.x == 0.0 && v_cm_UV00.y == 0.0)
        discard;
    float thickness = 0.3;
    vec2 a_uv1 = mix(vec2(u_U_mm.x, u_V_mm.x), vec2(u_U_mm.y, u_V_mm.y), v_cm_UV00);
    vec2 uv = v_uv;


    vec3 col1 = line(vec2(-a_uv1.x,-a_uv1.y), thickness, 0., uv);
    gl_FragColor = vec4(col1, 1.0);

    // gl_FragColor=vec4(1,0,0,1);
}
