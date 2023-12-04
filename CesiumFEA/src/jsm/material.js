// import drawpointFS from './shaders/mapbox/drawpoint.fs.glsl?raw';
// import drawpointVS from './shaders/mapbox/drawpoint.vs.glsl?raw';
// import updateFS from './shaders/mapbox/update.fs.glsl?raw';
// import updateVS from './shaders/mapbox/update.vs.glsl?raw';

class material {
    constructor() {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // wind map 
        // //画新粒子

        this.testShader = {
            vertexShader: `attribute vec2 uv;
            attribute vec3 position;
            varying vec2 v_uv;
            void main() {
                v_uv = uv;
                gl_Position = vec4(position, 1.0);
            }
            `,

            fragmentShader: `
            // uniform sampler2D u_channel0;
            varying vec2 v_uv;
            uniform vec2 mm;
            
            void main() {
                // vec4 color = texture2D(u_channel0, v_uv);
                // gl_FragColor = color;
                if(mm.y ==1.0)
                 gl_FragColor = vec4(0, 1, 0, 1);
                if(mm.x ==0.0)
                 gl_FragColor = vec4(1, 0, 0, 1);
            }`
        };



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.fire_main = {
            vertexShader:
                `attribute vec2 uv; 
                attribute vec3 position;
                varying vec2 v_uv;   
                void main() {
                   v_uv = uv;  
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `varying vec2 v_uv;                   
                uniform sampler2D u_channel0;
                uniform sampler2D u_channel1;
                vec2 iResolution= vec2(1,1); 
                void main() {   
                    vec2 uv = v_uv;
                    vec4 background = texture2D(u_channel0,1.0- vec2(uv) );
                    gl_FragColor = background;
                    // if( uv.x >0.3 && uv.x<0.7)
                    //     gl_FragColor = texture2D(u_channel1,vec2(uv) );
                        
                    // if( uv.x <0.3)
                    //     gl_FragColor = vec4(1.0,1.0,0.0,1.0);

                    // if(gl_FragColor.r<=0.20 && gl_FragColor.g<=0.20 && gl_FragColor.b<=0.20){
                    //         gl_FragColor=vec4(0.0);
                    //   }

                }`
        };
        this.fire_Channal0 = {
            vertexShader: `attribute vec2 uv; 
                attribute vec3 position;
                varying vec2 v_uv;                    
                void main() {
                    v_uv = uv;  
                    //gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                    gl_Position = vec4(position, 1.0);
                }`,


            fragmentShader: `varying vec2 v_uv;   
                uniform sampler2D u_channel0;
                uniform float iTime; 
                vec2 iResolution= vec2(1,1); 
                
                float rand(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }

                float hermite(float t)
                {
                    return t * t * (3.0 - 2.0 * t);
                }

                float noise(vec2 co, float frequency)
                {
                    vec2 v = vec2(co.x * frequency, co.y * frequency);

                    float ix1 = floor(v.x);
                    float iy1 = floor(v.y);
                    float ix2 = floor(v.x + 1.0);
                    float iy2 = floor(v.y + 1.0);

                    float fx = hermite(fract(v.x));
                    float fy = hermite(fract(v.y));

                    float fade1 = mix(rand(vec2(ix1, iy1)), rand(vec2(ix2, iy1)), fx);
                    float fade2 = mix(rand(vec2(ix1, iy2)), rand(vec2(ix2, iy2)), fx);

                    return mix(fade1, fade2, fy);
                }

                float pnoise(vec2 co, float freq, int steps, float persistence)
                {
                    float value = 0.0;
                    float ampl = 1.0;
                    float sum = 0.0;
                    for(int i=0 ; i<5;i++)
                    {
                        sum += ampl;
                        value += noise(co, freq) * ampl;
                        freq *= 2.0;
                        ampl *= persistence;
                    }
                    return value / sum;
                }

                void main(  ) {
                    vec2 uv = v_uv;
                    float gradient = 1.0 - uv.y;
                    float gradientStep = 0.2;
                    
                    vec2 pos = uv.xy / iResolution.x;
                    pos.y -= iTime * 0.3125;
                    
                    vec4 brighterColor = vec4(1.0, 0.65, 0.1, 0.25);
                    vec4 darkerColor = vec4(1.0, 0.0, 0.15, 0.0625);
                    vec4 middleColor = mix(brighterColor, darkerColor, 0.5);

                    float noiseTexel = pnoise(pos, 10.0, 5, 0.5);
                    
                    float firstStep = smoothstep(0.0, noiseTexel, gradient);
                    float darkerColorStep = smoothstep(0.0, noiseTexel, gradient - gradientStep);
                    float darkerColorPath = firstStep - darkerColorStep;
                    vec4 color = mix(brighterColor, darkerColor, darkerColorPath);

                    float middleColorStep = smoothstep(0.0, noiseTexel, gradient - 0.2 * 2.0);
                    
                    color = mix(color, middleColor, darkerColorStep - middleColorStep);
                    color = mix(vec4(0.0), color, firstStep);
                    gl_FragColor =vec4( color.r,color.g,color.b,1.0);
                    if(gl_FragColor.r==0.0 && gl_FragColor.g==0.0 && gl_FragColor.b==0.0){
                        gl_FragColor=vec4(0.0);
                    }
                }
                `
        };
        this.Channal0 = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                uniform float iTime; 
                uniform sampler2D u_channel0;
                varying vec3 val;   
                varying vec2 vuv;   

                vec2 iResolution= vec2(1,1); 

                void main() {   

                    gl_FragColor = texture2D(u_channel0, vuv);
                    // gl_FragColor=vec4(1.0,0,0,1);


                }`
        };
        this.TriangleShaderWater_blue = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                uniform float iTime; 
                varying vec3 val;   
                varying vec2 vuv;   

                vec2 iResolution= vec2(1,1); 

                float random(float x) {
 
                    return fract(sin(x) * 10000.);
                          
                }
                
                float noise(vec2 p) {
                
                    return random(p.x + p.y * 10000.);
                            
                }
                
                vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
                vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
                vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
                vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }
                
                float smoothNoise(vec2 p) {
                
                    vec2 interp = smoothstep(0., 1., fract(p));
                    float s = mix(noise(sw(p)), noise(se(p)), interp.x);
                    float n = mix(noise(nw(p)), noise(ne(p)), interp.x);
                    return mix(s, n, interp.y);
                        
                }
                
                float fractalNoise(vec2 p) {
                
                    float x = 0.;
                    x += smoothNoise(p      );
                    x += smoothNoise(p * 2. ) / 2.;
                    x += smoothNoise(p * 4. ) / 4.;
                    x += smoothNoise(p * 8. ) / 8.;
                    x += smoothNoise(p * 16.) / 16.;
                    x /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
                    return x;
                            
                }
                
                float movingNoise(vec2 p) {
                 
                    float x = fractalNoise(p + iTime);
                    float y = fractalNoise(p - iTime);
                    return fractalNoise(p + vec2(x, y));   
                    
                }
                
                // call this for water noise function
                float nestedNoise(vec2 p) {
                    
                    float x = movingNoise(p);
                    float y = movingNoise(p + 100.);
                    return movingNoise(p + vec2(x, y));
                    
                }



                void main() {   

                    vec2 uv = vuv.xy / iResolution.xy;
                    float n = nestedNoise(uv * 6.);
    
	                gl_FragColor = vec4(mix(vec3(.4, .6, 1.), vec3(.1, .2, 1.), n), 1.);
                  



                }`
        };
        this.TriangleShaderWater_blue1 = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                uniform float iTime; 
                varying vec3 val;   
                varying vec2 vuv;   

                vec2 iResolution= vec2(1,1); 
                #define f length(fract(q*=m*=.6+.1*d++)-.5)
                void main() {   
                    float d = 0.;

                    vec3 q = vec3(vuv.xy/iResolution.yy-13., iTime*.2);
                    mat3 m = mat3(-2,-1,2, 3,-2,1, -1,1,3);
                    vec3 col = vec3(pow(min(min(f,f),f), 7.)*40.);
                    gl_FragColor = vec4(clamp(col + vec3(0., 0.35, 0.5), 0.0, 1.0), 1.0);





                }`
        };
        this.TriangleShaderWater = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                uniform float iTime; 
                varying vec3 val;   
                varying vec2 vuv;   

                vec2 iResolution= vec2(1,1); 

                // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
                // Created by S.Guillitte 
                
                
                float hash( in vec2 p ) 
                {
                    return fract(sin(p.x*15.32+p.y*35.78) * 43758.23);
                }
                
                vec2 hash2(vec2 p)
                {
                    return vec2(hash(p*.754),hash(1.5743*p.yx+4.5891))-.5;
                }
                
                
                vec2 add = vec2(1.0, 0.0);
                
                vec2 noise2(vec2 x)
                {
                    vec2 p = floor(x);
                    vec2 f = fract(x);
                    f = f*f*(3.0-2.0*f);
                    
                    vec2 res = mix(mix( hash2(p),          hash2(p + add.xy),f.x),
                                    mix( hash2(p + add.yx), hash2(p + add.xx),f.x),f.y);
                    return res;
                }
                vec2 noise2b( in vec2 p )// Simplex Noise from IQ
                {
                    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
                    const float K2 = 0.211324865; // (3-sqrt(3))/6;
                    p /=2.;
                    vec2 i = floor( p + (p.x+p.y)*K1 );
                    
                    vec2 a = p - i + (i.x+i.y)*K2;
                    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
                    vec2 b = a - o + K2;
                    vec2 c = a - 1.0 + 2.0*K2;

                    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

                    vec3 nx = h*h*h*h*vec3( dot(a,hash2(i+0.0)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
                    vec3 ny = h*h*h*h*vec3( dot(a,hash2(i+4.5)), dot(b,hash2(i+o+4.5)), dot(c,hash2(i+1.0+4.5)));

                    return vec2(dot( nx, vec3(70.0) ),dot( ny, vec3(70.0) ));
                    
                }


                mat2 m2;
                vec2 fbm2(vec2 x)
                {
                    vec2 r = vec2(0.0);
                    float a = 1.;
                    
                    for (int i = 0; i < 6; i++)
                    {
                        r += m2*noise2b(x+r)*a; 
                        x +=.3*r+.4;
                    }     
                    return r;
                }


                vec2 water(vec2 x)
                {
                    x=fbm2(x);
                    x=abs(x)/dot(x,x)-1.;
                    return abs(x)/dot(x,x)-1.;
                }





                void main() {   
                    vec2 uv = 2.*vuv.xy / iResolution.xy;
                    uv*=15.0;
                    float t = 1.5*iTime;
                    float st = sin(t), ct = cos(t);
                    m2 = mat2(ct,st,-st,ct);
                    vec2 p = water(uv+2.*iTime)+2.;
                    float c = length(p)/7.;
                    c=clamp(pow(c,1.),0.,1.);
                    vec3 col=vec3(0);      
                    col=mix(col,vec3(0.70,.7,.9),c);
                    gl_FragColor = vec4(col,0.50);



                }`
        };
        this.shaderToyT1 = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,


            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                uniform float iTime; 
                varying vec3 val;   
                varying vec2 vuv;   

                vec2 iResolution= vec2(1,1); 

                #define TAU 6.2831852
                #define MOD3 vec3(.1031,.11369,.13787)
                #define BLACK_COL vec3(16,21,25)/255.
                
                vec3 hash33(vec3 p3)
                {
                    p3 = fract(p3 * MOD3);
                    p3 += dot(p3, p3.yxz+19.19);
                    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
                }
                
                float simplex_noise(vec3 p)
                {
                    const float K1 = 0.333333333;
                    const float K2 = 0.166666667;
                    
                    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
                    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
                        
                    vec3 e = step(vec3(0.0), d0 - d0.yzx);
                    vec3 i1 = e * (1.0 - e.zxy);
                    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
                    
                    vec3 d1 = d0 - (i1 - 1.0 * K2);
                    vec3 d2 = d0 - (i2 - 2.0 * K2);
                    vec3 d3 = d0 - (1.0 - 3.0 * K2);
                    
                    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
                    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
                    
                    return dot(vec4(31.316), n);
                }

                void main() {   
vec2 uv = (vuv.xy-iResolution.xy*0.50)/iResolution.y;
                           
    float a = sin(atan(uv.y, uv.x));
    float am = abs(a-.5)/4.;
    float l = length(uv);                         
    
    float m1 = clamp(.1/smoothstep(.0, 1.75, l), 0., 1.);
    float m2 = clamp(.1/smoothstep(.42, 0., l), 0., 1.);
    float s1 = (simplex_noise(vec3(uv*2., 1. + iTime*.525))*(max(1.0 - l*1.75, 0.)) + .9);
    float s2 = (simplex_noise(vec3(uv*1., 15. + iTime*.525))*(max(.0 + l*1., .025)) + 1.25);
    float s3 = (simplex_noise(vec3(vec2(am, am*100. + iTime*3.)*.15, 30. + iTime*.525))*(max(.0 + l*1., .25)) + 1.5);
    s3 *= smoothstep(0.0, .3345, l);    
    
    float sh = smoothstep(0.15, .35, l);
    
    
    float m = m1*m1*m2 * ((s1*s2*s3) * (1.-l)) * sh;
    //m = clamp(m, 0., 1.);
    
    vec3 col = mix(BLACK_COL, (0.5 + 0.5*cos(iTime+uv.xyx*3.+vec3(0,2,4))), m);
            
    gl_FragColor = vec4(col, 1.);


                }`
        };
        this.TriangleShaderBlueFilter = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,

            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                varying vec3 val;   
                varying vec2 vuv;   
                void main() {   
                    int  n = 12 ;
                    float w1 = (1.0 - vuv.x);   
                    float w2 = (vuv.x - vuv.y);   
                    float w3 = vuv.y;   
                    float  cm1;
                    float  cm2;
                    float  cm3;
                    float v;                

                    bool flag_break=false;

                    if( u_filter ==true ){
                        if( u_filterT ==1 ){
                            cm1= (val[0]-u_min)/(u_max-u_min);
                            cm2= (val[1]-u_min)/(u_max-u_min);
                            cm3= (val[2]-u_min)/(u_max-u_min);
                            v = w1*cm1 + w2*cm2 + w3*cm3;  
                            if( v < u_filterV){
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);  
                                flag_break=true;
                            }
                        }
                        else if( u_filterT ==2 ){
                            cm1= val[0];
                            cm2= val[1];
                            cm3= val[2];
                            v = w1*cm1 + w2*cm2 + w3*cm3;  
                            if( v < u_filterV){
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);  
                                flag_break=true;
                            }
                        }
                    }
                    cm1= (val[0]-u_min)/(u_max-u_min);
                    cm2= (val[1]-u_min)/(u_max-u_min);
                    cm3= (val[2]-u_min)/(u_max-u_min);
                    v = w1*cm1 + w2*cm2 + w3*cm3;  

                    float dv = 1.0 / float(n);   
                    float nv = float(v/dv);   
                    float vv = float(nv)*dv;                    

                    if( flag_break == false){
                        float step=12.0;
                        float perStep=step/4.0;
                        float stair=0.25;
                        // int i=0;
                        int j= int (perStep);
                        vec4 fragColor=vec4(0.0);
                        
                        if( vv <= 0.25 && vv>=0.0) {
                            for(int i=0;i<3;i++){                     
                                if( vv >= float(i) *stair/perStep &&vv <= (float(i)+1.0)*stair/perStep)
                                {
                                    fragColor = vec4(0.0, 1.0- float(i)/perStep*stair+0.0, 1.0, 1.0);
                                    break;
                                }
                            }
                        }     
                        else if ( vv > 0.25 && vv <= 0.5) {
                            for(int i=0;i<3;i++){
                                if( vv >= 0.25+float(i) *stair/perStep &&vv <=0.25+ (float(i)+1.0)*stair/perStep)
                                {
                                    fragColor = vec4(0.0, 0.75- float(i)/perStep*stair , 1.0, 1.0);
                                    break;
                                }
                            }
                        }
                        else if ( vv > 0.5 && vv <= 0.75) {
                            for(int i=0;i<3;i++){
                                if( vv >= 0.5+float(i) *stair/perStep &&vv <=0.5+ (float(i)+1.0)*stair/perStep)
                                {
                                    fragColor = vec4(0.0, 0.5- float(i)/perStep*stair , 1.0, 1.0);
                                    break;
                                }
                            }
                        }
                        else if ( vv > 0.75 && vv <= 1.0) {
                            for(int i=0;i<3;i++){
                                if( vv >= 0.75+float(i) *stair/perStep &&vv <=0.75+ (float(i)+1.0)*stair/perStep)
                                {
                                    fragColor = vec4(0.0, 0.25- float(i)/perStep*stair , 1.0, 1.0);
                                    break;
                                } 
                            }
                        }  
                        else{  
                            fragColor = vec4( 1.0 ,1.0, 1., 1.0); 
                        }  

                        gl_FragColor=fragColor;
                    }
                   
                }`
        };
        this.TriangleShaderFilter = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,

            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                varying vec3 val;   
                varying vec2 vuv;   
                void main() {   
                
                    int  n = 12 ;
                    float w1 = (1.0 - vuv.x);   
                    float w2 = (vuv.x - vuv.y);   
                    float w3 = vuv.y;   
                    float  cm1;
                    float  cm2;
                    float  cm3;

                
                    // float v = w1*val[0] + w2*val[1] + w3*val[2];   
                    // float v = w1*cm1 + w2*cm2 + w3*cm3;     
                    float v;                  
                    // float dv = 1.0 / float(n);   
                    // float nv = float(v/dv);   
                    // float vv = float(nv)*dv;   
                    
                    bool flag_break=false;
                    if( u_filter ==true ){
                        if( u_filterT ==1 ){
                            cm1= (val[0]-u_min)/(u_max-u_min);
                            cm2= (val[1]-u_min)/(u_max-u_min);
                            cm3= (val[2]-u_min)/(u_max-u_min);
                            v = w1*cm1 + w2*cm2 + w3*cm3;  
                            if( v < u_filterV){
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);  
                                flag_break=true;
                            }
                        }
                        else if( u_filterT ==2 ){
                            cm1= val[0];
                            cm2= val[1];
                            cm3= val[2];
                            v = w1*cm1 + w2*cm2 + w3*cm3;  
                            if( v < u_filterV){
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);  
                                flag_break=true;
                            }
                        }

                    }
                    cm1= (val[0]-u_min)/(u_max-u_min);
                    cm2= (val[1]-u_min)/(u_max-u_min);
                    cm3= (val[2]-u_min)/(u_max-u_min);
                    v = w1*cm1 + w2*cm2 + w3*cm3;  

                    float dv = 1.0 / float(n);   
                    float nv = float(v/dv);   
                    float vv = float(nv)*dv;   
                    // if( flag_break ==true ){ discard;}
                    if( flag_break == false){
                        if( vv <= 0.08333333333333333) {   
                            gl_FragColor = vec4(0.0, 0, 1.0, 1.0);   
                        }   
                        else if ( vv > 0.08333333333333333 && vv <= 0.16666666666666666) {   
                            gl_FragColor = vec4(0.0, 0.3607843137254902, 1.0 , 1.0);   
                        }   
                        else if ( vv > 0.16666666666666666 && vv <= 0.250) {   
                            gl_FragColor = vec4(0.0, 0.7254901960784313, 1.0 , 1.0);   
                        }   
                        else if ( vv > 0.250 && vv <= 0.3333333333333333) {   
                            gl_FragColor = vec4(0.0, 1., 0.9058823529411765 , 1.0);   
                        }   
                        else if ( vv > 0.3333333333333333 && vv <= 0.41666666666666663) {   
                            gl_FragColor = vec4(0.0, 1., 0.5450980392156862 , 1.0);   
                        }   
                        else if ( vv > 0.41666666666666663 && vv <= 0.49999999999999994) {   
                            gl_FragColor = vec4(0.0, 1., 0.1803921568627451 , 1.0);   
                        }   
                        else if ( vv > 0.49999999999999994 && vv <= 0.5833333333333333) {   
                            gl_FragColor = vec4( 0.1803921568627451 ,1.,0., 1.0);   
                        }   
                        else if ( vv > 0.5833333333333333 && vv <= 0.6666666666666666) {   
                            gl_FragColor = vec4( 0.5450980392156862 ,1.,0., 1.0);   
                        }   
                        else if ( vv > 0.6666666666666666 && vv <= 0.75) {   
                            gl_FragColor = vec4( 0.9058823529411765 ,1.,0., 1.0);   
                        }   
                        else if ( vv > 0.75 && vv <= 0.8333333333333334) {   
                            gl_FragColor = vec4( 1. ,.7254901960784313,0., 1.0);   
                        }   
                        else if ( vv > 0.8333333333333334 && vv <= 0.9166666666666667) {   
                            gl_FragColor = vec4( 1. ,.3607843137254902,0., 1.0);   
                        }   
                        else{   
                            gl_FragColor = vec4( 1. ,.0,0., 1.0);   
                        }   
                    }
                    vec4 finalColor =vec4(0);
                }`
        };
        this.TriangleShader = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,

            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                varying vec3 val;   
                varying vec2 vuv;   
                void main() {   
                
                    int  n = 12 ;
                    float w1 = (1.0 - vuv.x);   
                    float w2 = (vuv.x - vuv.y);   
                    float w3 = vuv.y;   
                    float  cm1= (val[0]-u_min)/(u_max-u_min);
                    float  cm2= (val[1]-u_min)/(u_max-u_min);
                    float  cm3= (val[2]-u_min)/(u_max-u_min);
                    // float v = w1*val[0] + w2*val[1] + w3*val[2];   
                    float v = w1*cm1 + w2*cm2 + w3*cm3;   
                    float dv = 1.0 / float(n);   
                    float nv = float(v/dv);   
                    float vv = float(nv)*dv;   
                    
                    if( vv <= 0.08333333333333333) {   
                        gl_FragColor = vec4(0.0, 0, 1.0, 1.0);   
                    }   
                    else if ( vv > 0.08333333333333333 && vv <= 0.16666666666666666) {   
                        gl_FragColor = vec4(0.0, 0.3607843137254902, 1.0 , 1.0);   
                    }   
                    else if ( vv > 0.16666666666666666 && vv <= 0.250) {   
                        gl_FragColor = vec4(0.0, 0.7254901960784313, 1.0 , 1.0);   
                    }   
                    else if ( vv > 0.250 && vv <= 0.3333333333333333) {   
                        gl_FragColor = vec4(0.0, 1., 0.9058823529411765 , 1.0);   
                    }   
                    else if ( vv > 0.3333333333333333 && vv <= 0.41666666666666663) {   
                        gl_FragColor = vec4(0.0, 1., 0.5450980392156862 , 1.0);   
                    }   
                    else if ( vv > 0.41666666666666663 && vv <= 0.49999999999999994) {   
                        gl_FragColor = vec4(0.0, 1., 0.1803921568627451 , 1.0);   
                    }   
                    else if ( vv > 0.49999999999999994 && vv <= 0.5833333333333333) {   
                        gl_FragColor = vec4( 0.1803921568627451 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.5833333333333333 && vv <= 0.6666666666666666) {   
                        gl_FragColor = vec4( 0.5450980392156862 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.6666666666666666 && vv <= 0.75) {   
                        gl_FragColor = vec4( 0.9058823529411765 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.75 && vv <= 0.8333333333333334) {   
                        gl_FragColor = vec4( 1. ,.7254901960784313,0., 1.0);   
                    }   
                    else if ( vv > 0.8333333333333334 && vv <= 0.9166666666666667) {   
                        gl_FragColor = vec4( 1. ,.3607843137254902,0., 1.0);   
                    }   
                    else{   
                        gl_FragColor = vec4( 1. ,.0,0., 1.0);   
                    }   
                }`
        };
        this.arrow = {
            vertexShader:
                `
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter;

                attribute vec3 color;  
                attribute vec3 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,

            fragmentShader: `       
                uniform float u_max;
                uniform float u_min;
                uniform float u_filterV;
                uniform int u_filterT;
                uniform bool u_filter; 
                varying vec3 val;   
                varying vec2 vuv;   
                void main() {   
                
                    int  n = 12 ;
                    float w1 = (1.0 - vuv.x);   
                    float w2 = (vuv.x - vuv.y);   
                    float w3 = vuv.y;   
                    float  cm1= (val[0]-u_min)/(u_max-u_min);
                    float  cm2= (val[1]-u_min)/(u_max-u_min);
                    float  cm3= (val[2]-u_min)/(u_max-u_min);
                    // float v = w1*val[0] + w2*val[1] + w3*val[2];   
                    float v = w1*cm1 + w2*cm2 + w3*cm3;   
                    float dv = 1.0 / float(n);   
                    float nv = float(v/dv);   
                    float vv = float(nv)*dv;   
                    
                    if( vv <= 0.08333333333333333) {   
                        gl_FragColor = vec4(0.0, 0, 1.0, 1.0);   
                    }   
                    else if ( vv > 0.08333333333333333 && vv <= 0.16666666666666666) {   
                        gl_FragColor = vec4(0.0, 0.3607843137254902, 1.0 , 1.0);   
                    }   
                    else if ( vv > 0.16666666666666666 && vv <= 0.250) {   
                        gl_FragColor = vec4(0.0, 0.7254901960784313, 1.0 , 1.0);   
                    }   
                    else if ( vv > 0.250 && vv <= 0.3333333333333333) {   
                        gl_FragColor = vec4(0.0, 1., 0.9058823529411765 , 1.0);   
                    }   
                    else if ( vv > 0.3333333333333333 && vv <= 0.41666666666666663) {   
                        gl_FragColor = vec4(0.0, 1., 0.5450980392156862 , 1.0);   
                    }   
                    else if ( vv > 0.41666666666666663 && vv <= 0.49999999999999994) {   
                        gl_FragColor = vec4(0.0, 1., 0.1803921568627451 , 1.0);   
                    }   
                    else if ( vv > 0.49999999999999994 && vv <= 0.5833333333333333) {   
                        gl_FragColor = vec4( 0.1803921568627451 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.5833333333333333 && vv <= 0.6666666666666666) {   
                        gl_FragColor = vec4( 0.5450980392156862 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.6666666666666666 && vv <= 0.75) {   
                        gl_FragColor = vec4( 0.9058823529411765 ,1.,0., 1.0);   
                    }   
                    else if ( vv > 0.75 && vv <= 0.8333333333333334) {   
                        gl_FragColor = vec4( 1. ,.7254901960784313,0., 1.0);   
                    }   
                    else if ( vv > 0.8333333333333334 && vv <= 0.9166666666666667) {   
                        gl_FragColor = vec4( 1. ,.3607843137254902,0., 1.0);   
                    }   
                    else{   
                        gl_FragColor = vec4( 1. ,.0,0., 1.0);   
                    }   
                }`
        };
        this.LineShader = {
            vertexShader:
                `
                attribute vec3 color;  
                attribute vec2 cm; 
                attribute vec2 uv; 
                varying vec3 val;  
                varying vec2 vuv;   
                attribute vec3 position;
               
               varying vec3 vcolor;   
                void main() {
                   val=cm;
                   vuv = uv;  
                   vcolor=  color  ;
                  gl_Position = czm_projection * czm_view * czm_model * vec4(position, 1.0);
                }`,
            fragmentShader:
                "                  precision mediump float;  \n\
                 precision mediump int;     \n\
                 uniform int n;  \n\
                 varying vec2 val;  \n\
                 varying vec2 vuv;  \n\
                 varying vec3 vposition;  \n\
                  void main() {  \n\
                     float w1 = (1.0 - vuv.x);  \n\
                     float w2 = (vuv.x - 0.);  \n\
                     float w3 =0.;  \n\
                     float v = w1*val[0] + w2*val[1];  \n\
                      float dv = 1.0 / float(n);  \n\
                     float nv = float(v/dv);  \n\
                     float vv = float(nv)*dv;  \n\
                          if( vv <= 0.08333333333333333) {  \n\
                         gl_FragColor = vec4(0.0, 0, 1.0, 1.0);  \n\
                      }  \n\
                     else if ( vv > 0.08333333333333333 && vv <= 0.16666666666666666) {  \n\
                          gl_FragColor = vec4(0.0, 0.3607843137254902, 1.0 , 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.16666666666666666 && vv <= 0.250) {  \n\
                          gl_FragColor = vec4(0.0, 0.7254901960784313, 1.0 , 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.250 && vv <= 0.3333333333333333) {  \n\
                          gl_FragColor = vec4(0.0, 1., 0.9058823529411765 , 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.3333333333333333 && vv <= 0.41666666666666663) {  \n\
                          gl_FragColor = vec4(0.0, 1., 0.5450980392156862 , 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.41666666666666663 && vv <= 0.49999999999999994) {  \n\
                          gl_FragColor = vec4(0.0, 1., 0.1803921568627451 , 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.49999999999999994 && vv <= 0.5833333333333333) {  \n\
                          gl_FragColor = vec4( 0.1803921568627451 ,1.,0., 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.5833333333333333 && vv <= 0.6666666666666666) {  \n\
                          gl_FragColor = vec4( 0.5450980392156862 ,1.,0., 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.6666666666666666 && vv <= 0.75) {  \n\
                          gl_FragColor = vec4( 0.9058823529411765 ,1.,0., 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.75 && vv <= 0.8333333333333334) {  \n\
                          gl_FragColor = vec4( 1. ,.7254901960784313,0., 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.8333333333333334 && vv <= 0.9166666666666667) {  \n\
                          gl_FragColor = vec4( 1. ,.3607843137254902,0., 1.0);  \n\
                     }  \n\
                     else if ( vv > 0.9166666666666667 && vv <= 1.0) {  \n\
                       gl_FragColor = vec4( 1. ,.0,0., 1.0);  \n\
                    }  \n\
                     else{  \n\
                       gl_FragColor = vec4( .0 ,.0, 1., 1.0);  \n\
                     }  \n\
                  } "
        };
        this.FrameLine = {
            vertexShader:
                `
                   attribute vec3 color;  
                      attribute vec3 position;
                  
                  varying vec3 vcolor;   
                   void main() {
                      vcolor=  color  ;
                     gl_Position = czm_projection * czm_view * czm_model * vec4(position, .9992);
                   }`
            ,
            fragmentShader:
                "                  precision mediump float;  \n\
                 precision mediump int;     \n\
                 varying vec3 vcolor;  \n\
                  void main() {  \n\
                       gl_FragColor = vec4(vcolor, 1.0);  \n\
                     }  \n\
                     "
        };
    };

}
export { material }

