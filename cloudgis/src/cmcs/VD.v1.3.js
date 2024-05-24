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
};
let triangleUV = [
    0, 0,
    0, 1,
    1, 1
    //...
];//float
let triangleTindex = [
    0, 1, 2,
    0, 1, 2,
    0, 1, 2,
    //...
];//int
let oneNodes = {
    "position": [
        "1.x","1.y","1.z",
        "2.x","2.y","2.z",
        "3.x","3.y","3.z",
        //...
    ],
    "tindex": triangleTindex,
    "uv": triangleUV,
};
let oneResource = {
    "siteName": ["a.u", "a.v", "a.w", "a.m"],
    "type": "data",
    "frames": [
        ["1", "2", "3"],//or         ["1s","6s","12s"] or ["1"]
        [
            //1
            [
                ["1.u", "2.u", "3.u",],// a.u
                ["1.v", "2.v", "3.v",],// a.v
                ["1.w", "2.w", "3.w",],// a.w
                ["1.m", "2.m", "3.m",],// a.w
                ,// a.m

            ],
            //2
            [
                //...

            ],
            //3+...
        ]
    ]
};

let VD = {
    "format": {
        "type": "data",//data,url
        "format": "json",//png,zip(json),json

    },
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