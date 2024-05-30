
import { vec2, vec3, vec4, mat4, mat3 } from "wgpu-matrix";
import triangulate from "delaunay-triangulate";

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
        // console.log(
        this.generateTriangles(A, B, C, D, E, F, G, H)
        // );
        // console.log        (
        this.generateFramelines(A, B, C, D, E, F, G, H)
        // )
        // console.log(
        this.generateNetworks(A, B, C, D, E, F, G, H)
        // );
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
        let pointsObj = {};

        /**
         * 1
         */
        let planeNormalize = vec3.normalize(vec3.create(plane[0], plane[1], plane[2]));
        for (let i of this.networks) {
            let onePoint = this.getOnelineIntersectOfPlane([planeNormalize[0], planeNormalize[1], planeNormalize[2], plane[3]], i);
            if (onePoint) {
                // points.push([onePoint[0], onePoint[1], onePoint[2]]);
                let name = onePoint.join("_");
                pointsObj[name] = [onePoint[0], onePoint[1], onePoint[2]];
            }
        }
        for (let i in pointsObj) {
            let perOne = pointsObj[i];
            points.push(perOne);
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


    getViewMatrix(plane) {
        const normalPlane = vec3.create(plane[0], plane[1], plane[2]);
        let vectorZ = vec3.normalize(normalPlane);
        // console.log("vector Z normalize", vectorZ);
        let vectorX = vec3.create(1, 0, 0);
        if (vectorZ[0] == 0 && vectorZ[1] == 0 && vectorZ[2] == 1) { }
        else
            vectorX = vec3.cross(vec3.create(0, 0, 1), vectorZ);
        // console.log("vector X normalize", vectorX);
        let vectorY = vec3.cross(vectorZ, vectorX);
        // console.log("vector Y normalize", vectorY);
        // let m4 = mat4.create();
        let m4 = mat4.set(
            vectorX[0], vectorX[1], vectorX[2], 0,
            vectorY[0], vectorY[1], vectorY[2], 0,
            vectorZ[0], vectorZ[1], vectorZ[2], 0,
            0, 0, 0, 1
        );
        return mat4.inverse(m4);
    }
    getPointsOf2D(plane, points) {
        let m4 = this.getViewMatrix(plane);
        let points2D = [];
        for (let perPoint of points) {
            let one = vec3.transformMat4(vec3.create(perPoint[0], perPoint[1], perPoint[2]), m4);
            let onePoint2D = [one[0], one[1]];
            points2D.push(onePoint2D);
        }
        // console.log(points2D)
        return points2D;

    }
    getDelaunay2D(plane) {
        let trianglesPosition = [];
        let frameLinePosition = [];
        let frameLinePositionObj = {};
        if (plane.length == 4) {
            let points = this.getIntersect(plane);
            // console.log(points);
            let pointsOf2D = this.getPointsOf2D(plane, points);
            // console.log(pointsOf2D)
            let cell = triangulate(pointsOf2D);
            // console.log(cell)
            for (let i of cell) {
                trianglesPosition.push(points[i[0]][0], points[i[0]][1], points[i[0]][2]);
                trianglesPosition.push(points[i[1]][0], points[i[1]][1], points[i[1]][2]);
                trianglesPosition.push(points[i[2]][0], points[i[2]][1], points[i[2]][2]);
                frameLinePositionObj[[i[0], i[1]].sort().join("_")] = [i[0], i[1]];
                frameLinePositionObj[[i[1], i[2]].sort().join("_")] = [i[1], i[2]];
                frameLinePositionObj[[i[2], i[1]].sort().join("_")] = [i[2], i[0]];
            }
            for (let i in frameLinePositionObj) {
                let perOne = frameLinePositionObj[i];
                frameLinePosition.push(points[perOne[0]][0], points[perOne[0]][1], points[perOne[0]][2]);
                frameLinePosition.push(points[perOne[1]][0], points[perOne[1]][1], points[perOne[1]][2]);
            }

            this.clippingTriangles = trianglesPosition;
            this.clippingFramelines = frameLinePosition;

        }
        else {
            console.log("错误:plane 的格式=[x,y,z,w]");
        }
    }

    generateNetworksBydata(data) {
        let networks = [];
        for (let i = 0; i < data.length; i += 6) {
            networks.push([[data[i], data[i + 1], data[i + 2]], [data[i + 3], data[i + 4], data[i + 5]]]);
        }
        this.networks = networks;
        return this.networks
    }
}


export { cube }