let oneMesh = {
    "name": "abc",
    "matrix": [],
    "points": {
        "indices": [0, 1, 2],                  //索引
        "cmindex": [0, 1, 2],                  //cm索引，这个就是material
    },
    "lines": {
        "indices": [0, 1, 1, 2],
        "cmindex": [0, 1, 2, 2]
    },
    "triangles": {
        "indices": [0, 1, 2, 1, 3, 2],
        "cmindex": [0, 1, 2, 1, 3, 2],
        "uv": [0, 1, 2, 0, 1, 2],           //二选一
        "tindex": [0, 1, 2, 0, 1, 2]        //二选一
    },
    "frameLines": {
        "indices": [0, 1, 1, 2],
    },
    "shellPoints": {
        "indices": [0, 1, 2],
    },
}
let triangleUV = [0, 0, 0, 1, 1, 1];//float
let triangleTindex = [0, 1, 2];//int
let oneNodes = [
    1.1, 1.2, 1.3,
    2.1, 2.2, 2.3,
    3.1, 3.2, 3.3,
    //...
];
let oneResource = {
    "siteName": ["a.u", "a.v", "a.w", "a.m"],
    "type":"data",
    "frames": [
        ["1", "2", "3"],//or         ["1s","6s","12s"] or ["1"]
        [
            //1
            [
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.u
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.v
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.w
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.m

            ],
            //2
            [
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.u
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.v
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.w
                [12, 123, 7, 3, 4, 788, 5, 56, 6, 87, 5, 6, 56, 6786, 56, 56],// a.m

            ],
            //3+...
        ]
    ]
};

let VD = {
    "description": {
        "projectName": "abc",
        "date": "20240101",
    },
    "type": "VD",
    "version": "1.0",
    "MNDNdesc": {
        "mesh": false,
        "nodes": {
            "format": "origin",//orgine,PLTFS,none
        },
        "data": {
            "format": "origin",//orgine,PLTFS,none
        },
        "uniformND": true,
    },
    "meshNames": ["a", "b"],
    "mesh": [oneMesh, oneMesh],
    "nodes": [oneNodes],
    "data": [oneResource],
    "groups": {
        "a": ["a"],
        "b": ["b"],
    }

};