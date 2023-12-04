/**
 * 基础类型声明
 */

/** 经纬度和高度
 *  数组
 */
export type Destination = number[]

/**
 * 方向：
 * heading 和pitch
 */
export type Orientation = {
    heading: number,
    pitch: number
}


/**每个位置的定义
 * main:boolean ,是否为默认场景
 * children：下属的对象，参加baseObject
 * selected:是否为当前场景
 */
export type PerLocation = {
    destination: Destination,
    orientation: Orientation,
    name: string,
    children: any,
    main: boolean,
    deleted: boolean
}

/** 位置数组 */
export type Locations = PerLocation[]


/** 这个需要在页面内初始化值 */
declare global {
    interface Window {
        /** 中台接口 */
        Project_interface_URL: string
        cloudGISLocations: Locations
    }
}

// export enum StatusOfObject{ 'normal','selected','over','move','alert','offline'}
/**
 * StatusOfObject 规定了object的状态必须在预定范围内
 */
export type StatusOfObjectString  = 'normal' | 'selected' | 'over' | 'move' | 'alert' | 'offline'
/**
 * ObjectStatus 定义了一个类型，可以为undefined
 * 对象的状态，
 * POI可以为每个的不同对象的切换
 */
export type ObjectStatus<T> = {
    [n in StatusOfObjectString as string]: T | undefined
}