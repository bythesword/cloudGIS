import { TFL } from "./TFL";

class DNW extends TFL {
    constructor(inputJSON = false, cmType = "cm", setting = false) {
        super();
        this.multiUVs = false;
        this.inputJSON = inputJSON;
        if (typeof inputJSON == "string") {
            inputJSON = JSON.parse(inputJSON);
        }
        if (setting && typeof setting.base_z != "undefined") {
            this.z = setting.base_z;
        }
        else {
            this.z = 0;
        }
        this.multiUVs = false;
        if (setting && typeof setting.multiUVs != "undefined" && setting.multiUVs === true) {
            this.multiUVs = setting.multiUVs;
        }
        else {
            this.multiUVs = false;
        }
        this.zbed_up = true;
        if (setting && typeof setting.dem != "undefined" && setting.zbed_up === false) {
            this.zbed_up = setting.zbed_up;
        }
        else {
            this.zbed_up = true;
        }
        this.z_dem = false;
        if (setting && typeof setting.dem != "undefined" && setting.dem === true) {
            this.z_dem = setting.dem;
        }
        else {
            this.z_dem = false;
        }
        if (inputJSON === false) {
            console.error("DNW 初始化参数错误，input=JSON object， || JSON string");
            return false;
        }
        this.updateSource(inputJSON, cmType);


        return this;

    }
    updateZ(z = 0, dem = false) {

    }
    updateSource(inputJSON = false, cmType = false) {
        this.nw = {
            position: [],
            dem: [],
            uv: [],
            index: [],//non index for this 
            data: [],
            cmType: "cm",//cm,cmBLue,wind,uvANDuniformMap,
            cmName: ["zbed", "U", "V"],
            cmIndex: [0, 0],
            coordinate: [],
            info: {
                cols: this.inputJSON.dem.cols,
                rows: this.inputJSON.dem.rows,
                U: 0,
                V: 0,
                // N: 0,
                sourceData: this.inputJSON.data
            }
        };
        if (cmType)
            this.nw.cmType = cmType;
        this.nw.coordinate.push(inputJSON.dem.coordinate_x, inputJSON.dem.coordinate_y);

        let cols = this.inputJSON.dem.cols;
        let rows = this.inputJSON.dem.rows;
        let size = this.inputJSON.dem.cellsize;
        let start_col = this.inputJSON.dem.start_col;
        let start_row = this.inputJSON.dem.start_row;
        this.nw.dataContent = inputJSON.dataContent;
        // let dem = [];
        let data = [];
        // let i_dem = 0, b_dem = false;
        // let zbed_index = false, zbed_i = 0;
        // for (let ic in inputJSON.dataContent) {
        //     if (ic != "DEM") {
        //         this.nw.cmName.push(ic);
        //         if (b_dem === false) {
        //             i_dem++;
        //         }
        //     }
        //     else if (ic == "DEM") {
        //         b_dem = true;
        //     }
        //     if (ic == "zbed") {
        //         zbed_index = zbed_i;
        //     }
        //     if (ic == "U") {
        //         this.nw.info.U = zbed_i;
        //     }
        //     if (ic == "V") {
        //         this.nw.info.V = zbed_i;
        //     }
        //     zbed_i++;
        // }

        let i_dem = 0, b_dem = true;
        let zbed_index = 1, zbed_i = 4;
        this.nw.info.U = 2;
        this.nw.info.V = 3;

        let perLength = Object.keys(inputJSON.dataContent).length;
        let z = this.z;
        let sourceData = this.inputJSON.data;
        // let UMM = { min: false, max: false };
        // let VMM = { min: false, max: false };
        // for (let perDate_i in sourceData) {
        //     let perDate = sourceData[perDate_i];
        //     for (let j = 0; j < perDate.length; j += 4) {
        //         if (UMM.max === false) {
        //             UMM.min = perDate[j + 2];
        //             UMM.max = perDate[j + 2];
        //             UMM.min = perDate[j + 3];
        //             UMM.max = perDate[j + 3];
        //         }
        //         if (UMM.min > perDate[j + 2]) {
        //             UMM.min = perDate[j + 2];
        //         }
        //         if (UMM.max < perDate[j + 2]) {
        //             UMM.max = perDate[j + 2];
        //         }
        //         if (VMM.min > perDate[j + 3]) {
        //             VMM.min = perDate[j + 3];
        //         }
        //         if (VMM.max < perDate[j + 3]) {
        //             VMM.max = perDate[j + 3];
        //         }
        //     }
        // }
        // console.log(UMM, VMM);
        for (let perDate_i in sourceData) {
            let perDate = sourceData[perDate_i];
            // let windImage = new Float32Array(rows*cols*);
            // let dataZbed = new Float32Array((rows - 1) * (cols - 1) * 2 * 3 * 3);
            // let dataU = new Float32Array((rows - 1) * (cols - 1) * 2 * 3 * 3);;
            // let dataV = new Float32Array((rows - 1) * (cols - 1) * 2 * 3 * 3);;
            // let dataZbed = [];
            // let dataU = [];
            // let dataV = [];
            let totalZbedI = 0;
            let totalUI = 0;
            let totalVI = 0;
            for (let i = 0; i < rows - 1; i++) {
                //dir up
                // let y1 = (+ i) * size;
                // let y2 = (+ i + 1) * size;
                //dir down 
                let y1 = (start_row - i) * size;
                let y2 = (start_row - i - 1) * size;

                for (let j = 0; j < cols - 1; j++) {
                    let dem1 = z, dem2 = z, dem3 = z, dem4 = z;
                    let zbed1 = 0, zbed2 = 0, zbed3 = 0, zbed4 = 0;
                    let index_i = 0;
                    for (let k = 0; k < perLength; k++) {
                        if (k == i_dem) {
                            if (this.z_dem) {
                                dem1 = perDate[(i * cols + j) * perLength + k];
                                dem2 = perDate[(i * cols + j + 1) * perLength + k];
                                dem3 = perDate[((i + 1) * cols + j) * perLength + k];
                                dem4 = perDate[((i + 1) * cols + j + 1) * perLength + k];
                                if (dem1 == -9999.0) dem1 = 0.0;
                                if (dem2 == -9999.0) dem2 = 0.0;
                                if (dem3 == -9999.0) dem3 = 0.0;
                                if (dem4 == -9999.0) dem4 = 0.0;
                            }
                        }
                        else {
                            let c1 = perDate[(i * cols + j) * perLength + k];
                            let c2 = perDate[(i * cols + j + 1) * perLength + k];
                            let c3 = perDate[((i + 1) * cols + j) * perLength + k];
                            let c4 = perDate[((i + 1) * cols + j + 1) * perLength + k];
                            if (typeof data[perDate_i] == "undefined") {
                                data[perDate_i] = [];
                            }
                            if (typeof data[perDate_i][index_i] == "undefined") {
                                data[perDate_i][index_i] = [];
                            }
                            if (this.zbed_up && zbed_index !== false && zbed_index == k) {
                                zbed1 = c1;
                                zbed2 = c2;
                                zbed3 = c3;
                                zbed4 = c4;
                            }
                            // if (c1 == 25.419131546127044 || c2 == 25.419131546127044 || c3 == 25.419131546127044 || c4 == 25.419131546127044) {
                            //     let abc = 1;
                            // }

                            // dir up
                            // 1 2
                            // 3 4
                            // data[perDate_i][index_i].push(c1, c1, c1, c2, c2, c2, c3, c3, c3);
                            // data[perDate_i][index_i].push(c2, c2, c2, c4, c4, c4, c3, c3, c3);
                            //dir down 
                            // 1 2
                            // 3 4
                            
                            data[perDate_i][index_i].push(c3, c3, c3, c4, c4, c4, c2, c2, c2);
                            data[perDate_i][index_i].push(c2, c2, c2, c1, c1, c1, c3, c3, c3);
                            // if (index_i == 0) {
                            //     // dataZbed.push(c3, c3, c3, c4, c4, c4, c2, c2, c2);
                            //     // dataZbed.push(c2, c2, c2, c1, c1, c1, c3, c3, c3);
                            //     dataZbed[totalZbedI++] = c3;
                            //     dataZbed[totalZbedI++] = c3;
                            //     dataZbed[totalZbedI++] = c3;
                            //     dataZbed[totalZbedI++] = c4;
                            //     dataZbed[totalZbedI++] = c4;
                            //     dataZbed[totalZbedI++] = c4;
                            //     dataZbed[totalZbedI++] = c2;
                            //     dataZbed[totalZbedI++] = c2;
                            //     dataZbed[totalZbedI++] = c2;

                            //     dataZbed[totalZbedI++] = c2;
                            //     dataZbed[totalZbedI++] = c2;
                            //     dataZbed[totalZbedI++] = c2;
                            //     dataZbed[totalZbedI++] = c1;
                            //     dataZbed[totalZbedI++] = c1;
                            //     dataZbed[totalZbedI++] = c3;
                            //     dataZbed[totalZbedI++] = c3;
                            //     dataZbed[totalZbedI++] = c3;
                            // }
                            // else if (index_i == 1) {
                            //     dataU[totalUI++] = c3;
                            //     dataU[totalUI++] = c3;
                            //     dataU[totalUI++] = c3;
                            //     dataU[totalUI++] = c4;
                            //     dataU[totalUI++] = c4;
                            //     dataU[totalUI++] = c4;
                            //     dataU[totalUI++] = c2;
                            //     dataU[totalUI++] = c2;
                            //     dataU[totalUI++] = c2;

                            //     dataU[totalUI++] = c2;
                            //     dataU[totalUI++] = c2;
                            //     dataU[totalUI++] = c2;
                            //     dataU[totalUI++] = c1;
                            //     dataU[totalUI++] = c1;
                            //     dataU[totalUI++] = c3;
                            //     dataU[totalUI++] = c3;
                            //     dataU[totalUI++] = c3;
                            // }
                            // else if (index_i == 2) {
                            //     dataV[totalVI++] = c3;
                            //     dataV[totalVI++] = c3;
                            //     dataV[totalVI++] = c3;
                            //     dataV[totalVI++] = c4;
                            //     dataV[totalVI++] = c4;
                            //     dataV[totalVI++] = c4;
                            //     dataV[totalVI++] = c2;
                            //     dataV[totalVI++] = c2;
                            //     dataV[totalVI++] = c2;

                            //     dataV[totalVI++] = c2;
                            //     dataV[totalVI++] = c2;
                            //     dataV[totalVI++] = c2;
                            //     dataV[totalVI++] = c1;
                            //     dataV[totalVI++] = c1;
                            //     dataV[totalVI++] = c3;
                            //     dataV[totalVI++] = c3;
                            //     dataV[totalVI++] = c3;
                            // }
                            index_i++;
                        }
                    }
                    if (perDate_i == 0) {
                        dem1 += zbed1;
                        dem2 += zbed2;
                        dem3 += zbed3;
                        dem4 += zbed4;
                        // let x1 = (+ j) * size;
                        // let x2 = (+ j + 1) * size;

                        let x1 = (start_col + j) * size;
                        let x2 = (start_col + j + 1) * size;

                        // dir up
                        // c d
                        // a b
                        // this.nw.position.push(x1, y1, dem1);//a
                        // this.nw.position.push(x2, y1, dem2);//b
                        // this.nw.position.push(x1, y2, dem3);//c

                        // this.nw.position.push(x2, y1, dem2);//b
                        // this.nw.position.push(x2, y2, dem4);//d
                        // this.nw.position.push(x1, y2, dem3);//c

                        //dir down
                        // d c
                        // a b
                        this.nw.position.push(x1, y2, dem3);//a
                        this.nw.position.push(x2, y2, dem4);//b
                        this.nw.position.push(x2, y1, dem2);//c

                        this.nw.position.push(x2, y1, dem2);//c
                        this.nw.position.push(x1, y1, dem1);//d
                        this.nw.position.push(x1, y2, dem3);//a

                        if (this.multiUVs) {
                            let ua = (j) / cols;
                            let va = 1.0 - (i) / rows;
                            let ub = (j + 1) / cols;
                            let vb = 1.0 - (i + 1) / rows;
                            this.nw.uv.push(ua, vb, ub, vb, ub, va,);
                            this.nw.uv.push(ub, va, ua, va, ua, vb);
                        }
                        else {
                            this.nw.uv.push(0, 0, 1, 0, 1, 1,);
                            this.nw.uv.push(1, 1, 0, 1, 0, 0);
                        }
                        // this.nw.uv.push(0, 0, 1, 0, 1, 1,);
                    }
                }


            }
            // if (typeof data[perDate_i] == "undefined") {
            //     data[perDate_i] = [];
            // }
            // data[perDate_i].push(dataZbed);
            // data[perDate_i].push(dataU);
            // data[perDate_i].push(dataV);
        }
        this.nw.info.N = data.length;

        this.nw.data = data;

    }
    get() {
        return this.nw;
    }
}
export { DNW }
