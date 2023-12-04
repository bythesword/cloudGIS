class TFL {
    constructor(inputJSON = false, which = []) {
        this.nw = {
            position: [
                0, 0, 0,
                500, 0, 0,
                500, 500, 0,
                500, 500, 0,
                0, 500, 0,
                0, 0, 0
            ],
            
            dem: [0, 0, 0, 0, 0, 0],
            uv: [
                0, 0,
                1, 0,
                1, 1,
                1, 1,
                0, 1,
                0, 0
            ],
            index: [],//non index for this 
            dataContent: {
                "zbed": {
                    "global_MM": true,
                    "max": 1.0,
                    "min": 0.0,
                    "filterKind": 1,
                    "filterValue": 0.1,
                    "filter": false
                },

            },
            data: [
                [
                    [
                        0.0, 0, 0,
                        0.5, 0.5, 0.5,
                        1.0, 1.0, 1.0,
                        1, 1, 1.0,
                        0.8, 0.8, 0.8,
                        0, 0, 0.0
                    ],
                ],
                [
                    [
                        0, 0, 0,
                        0.3, 0.3, 0.3,
                        0.8, 0.8, 0.8,
                        0.8, 0.8, 0.8,
                        0.6, 0.6, 0.6,
                        0, 0, 0
                    ],
                ]
                ,
                [
                    [
                        0, 0, 0,
                        0.1, 0.1, 0.1,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.4, 0.4, 0.4,
                        0, 0, 0,
                    ],
                ]

            ],
            cmType: "cm",//cm,cmBLue,wind,uvANDuniformMap,
            cmName: ["zbed"],
            cmIndex: [0, 0],
            "coordinate": [116.3915382409668, 39.8085],
        }
        return this;

    }
    updateSource(inputJSON = false, which = []) {

    }
    get() {
        return this.nw;
    }

    setCMType(cmType) {
        this.nw.cmType = cmType;
    }
}

export { TFL }