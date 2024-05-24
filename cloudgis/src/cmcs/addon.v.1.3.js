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
    "values": {//每种不同，取其一,这个是get的参数，返回时默认时原来的
        "mesh": ["a", "b"],//[]=空=全部
        "clipping": {
            "plane": [//有几个plane，就求几个clipping，方式在客户端
                ["vector.x", "vector.y", "vector.z", "distance"],
                ["vector.x", "vector.y", "vector.z", "distance"],
            ]
        },
        "flowlines": {
            "points": [//有几个点，则求几个点
                ["p1.x", "p1.y", "p1.z"],
                ["p2.x", "p2.y", "p2.z"],
            ]
        },
        "contour_volume": {
            "volume": [0.1, 0.2],
            "site": ["a.u", "a.v"],
        },
    },
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
    // "meshNames": ["a", "b"],
    "meshNames": ["a_clipping_0", "a_clipping_1", "b_clipping_0", "b_clipping_1"],
    "mesh": [a_0, a_1, b_0, b_1],
    "nodes": [nodes_a_0, nodes_a_1, nodes_b_0, nodes_b_1],
    "data": [RES_a_0, RES_a_1, RES_b_0, RES_b_1],
    "groups": {
        "a": ["a"],
        "b": ["b"],
    }

};