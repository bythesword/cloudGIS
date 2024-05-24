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

let VP = {
    "description": {
        "projectName": "abc",
        "date": "20240101",
    },
    "type": "VP",
    "data": [oneResourceVP],
    //...
}