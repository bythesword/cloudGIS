export interface oneFormat {
    type: "data" | "url",
    format: "json" | "jsonz" | "png" | "binz" | "bin",
    filetype: string | boolean

}
export interface oneMesh {
    format: boolean | oneFormat,
    name: string,
    matrix: number[],
    clonefrom: boolean | number,
    points: {
        indices?: boolean | number[],
        cmindex?: boolean | number[],
        position?: boolean | number[],
    },
    lines: {
        indices?: boolean | number[],
        cmindex?: boolean | number[],
        cm?: boolean | number[],
        position?: boolean | number[],
    },
    triangles: {
        indices?: boolean | number[],
        cmindex?: boolean | number[],
        position?: boolean | number[],
        uv?: number[],
        tindex?: number[],
    },
    framelines: {
        indices?: boolean | number[],
        position?: boolean | number[],
    },
    shellpoints: {
        indices?: boolean | number[],
        position?: boolean | number[],
    },
    description: any,
}

export interface oneNodes {
    format: boolean | oneFormat,
    clonefrom: boolean | number,
    data: {
        position: number[] | string,//json or url
        uv?: number[] | string,
        tindex?: number[] | string,
    }
}

export interface oneResource {
    format: boolean | oneFormat,
    clonefrom: boolean | number,
    sitename: [string],
    frames: [
        string[],
        [] | string//json or url
    ]
}

export interface onegroup {
    node: boolean,
    visible: boolean,
    id: number | boolean,
    content: any,
    description: any,
}

export interface groups {
    [name: string]: onegroup
}

export type meshNames = string[]

// export type MNDUdescType = "orgin" | "PLTFS" | "none"
// export interface MNDUdesc {
//     mesh: any,
//     nodes: {
//         format:MNDUdescType
//     },
//     data:{
//         format:MNDUdescType
//     },

// }
export type clippingPlane = number[]
export type flowlinesPoint = number[]
export type contorVolume = {
    volume: number[],
    site: string[]
}
export interface add_on_values {
    mesh: string[],
    clipping?: clippingPlane[],
    flowlines?: flowlinesPoint[],
    contourVolme?: contorVolume
}

export interface description {
    name?: string,
    projectID?: string | number,
    data?: string
}

export interface VD {
    format: oneFormat,
    description: description,
    type: "VD" | "add-on",
    version: string,
    meshnames: string[],
    mesh: oneMesh[],
    nodes: oneNodes[],
    data: oneResource[],
    groups: boolean | groups,
    values?: add_on_values
}

