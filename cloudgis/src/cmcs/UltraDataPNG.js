let ultraData = {
    "siteName": ["a.u", "a.v", "a.w", "a.m"],
    "type": "data",
    "width": 16384,
    "data": {
        "a.u": [
            {
                "frameNUM": [0,0],//all nodes,第一种情况
                url: "a.u.1.png",
            },
        ],
        "a.v": [
            {
                "frameNUM": [0,1024],//0-1024 nodes ，第二种情况，最大16个，
                url: "a.u.1.png",
            },
            {
                "frameNUM": [1024,0],//1024-end nodes
                url: "a.u.1.png",
            },
        ],
        "a.w": [],
        "a.m": [],
    },
    "perFrameNUM": 1,

}

let ultraMode = {
    "description": {
        "projectName": "abc",
        "date": "20240101",
    },

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
    //"data": [],
    "ultraData":ultraData
    //...
}