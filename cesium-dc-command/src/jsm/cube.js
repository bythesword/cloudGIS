
import { vec2, vec3, vec4 } from "wgpu-matrix";
// import { Vec2, Vec3, Vec4 } from "wgpu-matrix";
// import { Mat3, Mat4 } from "wgpu-matrix";
class cube {

    constructor(size = 200) {
        this.cubeSize = size / 2;
        this.init();

    }
    init() {
        //C
        let A = [0 - this.cubeSize, 0 - this.cubeSize, 0 - this.cubeSize];
        let B = [this.cubeSize, 0 - this.cubeSize, 0 - this.cubeSize];
        let C = [0 - this.cubeSize, 0 - this.cubeSize, this.cubeSize];
        let D = [this.cubeSize, 0 - this.cubeSize, this.cubeSize];



        let E = [0 - this.cubeSize, this.cubeSize, 0 - this.cubeSize];
        let F = [this.cubeSize, this.cubeSize, 0 - this.cubeSize];
        let G = [0 - this.cubeSize, this.cubeSize, this.cubeSize];
        let H = [this.cubeSize, this.cubeSize, this.cubeSize];

        this.nodes = [A, B, C, D, E, F, G, H];
        this.elements = [
            [A, B, C, D, E, F, G, H]
        ]

        let plane = [1, 0, 0, 50];
        console.log(this.generateTriangles(A, B, C, D, E, F, G, H));
        console.log(this.generateFramelines(A, B, C, D, E, F, G, H))
        console.log(this.generateNetworks(A, B, C, D, E, F, G, H));
        this.getIntersect(plane);
    }

    generateTriangles(A, B, C, D, E, F, G, H) {
        let triangles = [];
        //front
        triangles.push(A, B, C, B, D, C);
        //back
        triangles.push(F, E, H, E, G, H);
        //right
        triangles.push(B, F, D, F, H, D);
        //left
        triangles.push(E, A, G, A, C, G);

        // //top
        triangles.push(C, D, G, D, H, G);
        // //bottom
        triangles.push(F, E, B, E, A, B);

        this.triangles = [];
        for (let i of triangles) {
            this.triangles.push(i[0], i[1], i[2]);
        }
        return this.triangles

    }
    generateNetworks(A, B, C, D, E, F, G, H) {
        let lines = [];
        lines.push([A, B], [B, D], [D, C], [C, A]);
        lines.push([E, F], [F, H], [H, G], [G, E]);
        lines.push([C, G], [D, H], [B, F], [A, E]);

        this.networks = lines;
        return this.networks
    }
    generateFramelines(A, B, C, D, E, F, G, H) {
        let lines = [];
        lines.push(A, B, B, D, D, C, C, A);
        lines.push(E, F, F, H, H, G, G, E);
        lines.push(C, G, D, H, B, F, A, E);

        this.frameLines = [];
        for (let i of lines) {
            this.frameLines.push(i[0], i[1], i[2]);
        }
        return this.frameLines
    }

    getIntersect(plane) {
        let points = [];

        /**
         * 1
         */
        for (let i of this.networks) {
            let onePoint = this.getOnelineIntersectOfPlane(plane, i);
            if (onePoint) {
                points.push([onePoint[0], onePoint[1], onePoint[2]]);
            }
        }
        this.pointsOfIntersectOfPlane = points;
        return points;
    }
    getOnelineIntersectOfPlane(plane, point) {

        let A = vec3.create(point[0][0], point[0][1], point[0][2]);
        let B = vec3.create(point[1][0], point[1][1], point[1][2]);

        const direction = vec3.subtract(B, A);
        const normalPlane = vec3.create(plane[0], plane[1], plane[2]);
        const constantPlane = plane[3];
        const denominator = vec3.dot(normalPlane, direction);


        if (denominator === 0) {

            // line is coplanar, return origin
            if (vec3.dot(normalPlane, A) + constantPlane === 0) {

                return A;

            }

            // Unsure if this is the correct method to handle this case.
            return null;

        }

        const t = - (vec3.dot(A, normalPlane) + constantPlane) / denominator;

        if (t < 0 || t > 1) {

            return null;

        }

        let vvv = vec3.addScaled(A, direction, t);
        return vvv;

    }


}


export { cube }