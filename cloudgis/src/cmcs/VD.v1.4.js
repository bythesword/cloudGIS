let oneMesh = {
    "format": {//非必须，如果有，则使用此单独设置，无：全局
        "type": "data",//data,url
        "format": "json",//png,jsonz(json->zip),json,binz(VAO+zip)
        "filetype": false,
    },
    "name": "abc",
    "matrix": [],
    "clonefrom": false,//非必须，默认=false，是装配的概念，number=meshNames数组的下标。注意，1、如果clone，matrix应该是不同的；2、其他的属性PLTFS都不存在或false
    "points": {
        "indices": [0, 1, 2],                  //索引
        "cmindex": [0, 1, 2],                  //cm索引，这个就是material
        "position": []
    },
    "lines": {
        "indices": [0, 1, 1, 2],
        "cmindex": [0, 1, 2, 2],
        "position": []
    },
    "triangles": {
        "indices": [0, 1, 2, 1, 3, 2],
        "cmindex": [0, 1, 2, 1, 3, 2],
        "uv": [0, 1, 2, 0, 1, 2],           //二选一
        "tindex": [0, 1, 2, 0, 1, 2],    //二选一
        "position": []
    },
    "frameLines": {
        "indices": [0, 1, 1, 2],
        "position": []
    },
    "shellPoints": {
        "indices": [0, 1, 2],
        "position": []
    },
    "description": {},//待扩展
};

let oneNodes = {
    "clonefrom": false,//非必须，默认=false，是装配的概念，number=meshNames数组的下标。注意，1、如果clone，matrix应该是不同的；2、其他的属性PLTFS都不存在或false
    "format": {//非必须，如果有，则使用此单独设置，无：全局
        "type": "data",//data,url
        "format": "json",//png,jsonz(json->zip),json,binz(VAO+zip)
    },
    //or "format":false,
    "data": {
        "position":
        //binz,jsonz,png
        //  binz's or josnz's,png's url
        //json
        [
            "1.x", "1.y", "1.z",
            "2.x", "2.y", "2.z",
            "3.x", "3.y", "3.z",
            //...
        ],
        "tindex": [
            0, 0,
            0, 1,
            1, 1
            //...
        ],//float,
        "uv": [
            0, 1, 2,
            0, 1, 2,
            0, 1, 2,
            //...
        ],//int,
    }
};
let oneResource = {
    "format": {//非必须，如果有，则使用此单独设置，无：全局
        "type": "data",//data,url
        "format": "json",//png,jsonz(json->zip),json,binz(VAO+zip)
    },
    "siteName": ["a.u", "a.v", "a.w", "a.m"],
    "clonefrom": false,//非必须，默认=false，否则，number=meshNames数组的下标。注意，1、如果clone，matrix应该是不同的；2、其他的属性PLTFS都不存在或false

    //第一种format示例
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
    ],
    //第二种format示例
    // "frames": [
    //     ["1", "2", "3"],//or         ["1s","6s","12s"] or ["1"]
    //     [
    //         //1
    //         url1,
    //         //2
    //         url2,
    //         //3+...
    //     ]
    // ]
};

let groups = {
    "root": {
        node: true,
        visible: true,
        id: false,
        content: {
            "a": {
                node: false,
                visible: true,
                id: 0,
                content:false,
                description: ""
            }
        },
        description: ""
    }
};

let VD = {
    "format": {
        "type": "data",//data,url
        "format": "json",//png,jsonz(json->zip),json,binz(VAO+zip)
        "filetype": false,//false||zip||raw
    },
    "description": {
        "projectName": "abc",
        "date": "20240101",
    },
    "type": "VD",
    "version": "1.0",
    "MNDUdesc": {
        "mesh": false,
        "nodes": {
            "format": "origin",//orgine,PLTFS,none
        },
        "data": {
            "format": "origin",//orgine,PLTFS,none
        },
        "uniformND": true,
    },
    "meshnames": ["a", "b"],
    "mesh": [oneMesh, oneMesh],
    "nodes": [oneNodes],
    "data": [oneResource],
    "groups": groups,
};