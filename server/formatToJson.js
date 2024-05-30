// let pointsOfLangLatDepth = [
//     [
//         langLeft, latBottom, [1500, 500, 500, 500]
//     ],
//     [
//         langRight, latBottom, [1500, 500, 500, 500]
//     ],
//     [
//         langLeft, latTop, [1500, 500, 500, 500]
//     ]
// ]

import fs from "fs"


let dataFromFile = fs.readFileSync("fengtaicsv.csv", 'utf-8');

let lines = dataFromFile.split("\n");

let data = [];
for (let i of lines) {
    let perLine = i.split("\r")[0].split(",");
    data.push([perLine[0], perLine[1], [perLine[2], perLine[3], perLine[4], perLine[5]]]);
}

var ws = fs.createWriteStream("lldddd.json", 'utf-8');
// console.log(JSON.stringify(dat.data.res[i]));
ws.write(JSON.stringify(data));