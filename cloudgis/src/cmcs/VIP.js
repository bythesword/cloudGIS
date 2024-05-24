

let oneNodesVIP = {
    "width": 16384,//这个时默认值，可以更改
    "height": 512,//这个按照实际情况，1，2，100
    "vertexWidth":3,
    "vertexNumPerline":5461,//最大值
    "url": "vertex.png",
    "count":200000,//非必须，方便校验
};
let oneResourceVP = {
    "type":"png",
    "siteName": [
        "a.u",
        "a.v",
        "a.w",
        "a.m"
    ],
    "pngStruct": {
        "width": 512,
        "height": 512,
        "siteNumber": 4,
        "perLineNodeNumber": 128,
    },
    "frames": [
        [
            "1",
            "2",
            "3"
        ], //or         ["1s","6s","12s"] or ["1"]
        [
            "1.png",
            "2.png",
            "3.png"
        ]
    ]
};


let VIP = {
    "description": {
        "projectName": "abc",
        "date": "20240101",
    },
    "type": "VIP",
    "MNDNdesc": {
        "mesh": false,
        "nodes": {
            "format": "PLTFS",//orgine,PLTFS,none
        },
        "data": {
            "format": "PLTFS",//orgine,PLTFS,none
        },
        "uniformND": true,//
    },
    "nodes": [oneNodesVIP],
    "data": [oneResourceVP],
    //...
}