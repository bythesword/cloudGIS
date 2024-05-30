
import { vec2, vec3, vec4, mat4, mat3 } from "wgpu-matrix";

function getViewMatrix(plane) {
    const normalPlane = vec3.create(plane[0], plane[1], plane[2]);
    let vectorZ = vec3.normalize(normalPlane);
    // console.log("vector Z normalize", vectorZ);
    let vectorX = vec3.create(1, 0, 0);
    if (vectorZ[0] == 0 && vectorZ[1] == 0 && vectorZ[2] == 1) { }
    else
        vectorX = vec3.cross(vec3.create(0, 0, 1), vectorZ);
    vectorX = vec3.normalize(vectorX);
    // console.log("vector X normalize", vectorX);
    let vectorY = vec3.cross(vectorZ, vectorX);
    vectorY = vec3.normalize(vectorY);
    // console.log("vector Y normalize", vectorY);
    // let m4 = mat4.create();
    let m4 = mat4.set(
        vectorX[0], vectorX[1], vectorX[2], 0,
        vectorY[0], vectorY[1], vectorY[2], 0,
        vectorZ[0], vectorZ[1], vectorZ[2], 0,
        0, 0, 0, 1
    );
    return m4;
}



export { getViewMatrix }