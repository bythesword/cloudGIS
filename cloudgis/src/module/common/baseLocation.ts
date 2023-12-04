/** 顶级位置 */
// import *  as Cesium from "cesium"
import { Destination, Orientation, Locations, PerLocation } from "./baseConfig"


class BaseLocation {
    /**位置数组 */
    locations: Locations = []
    projectID: string = ''

    /**
     * 构造函数
     * @param projectID : 可选，如果有从数据库中装置
     */
    constructor(projectID?: string) {
        if (projectID) {
            this.load(projectID);
        }
    }

    delOne(name: string) {
        for (let i of this.locations) {
            if (i.name == name) {
                i.deleted = true;
            }
        }
    }
    addOne(name: string, dest: Destination, ori: Orientation) {
        let per: PerLocation = {
            destination: dest,
            orientation: ori,
            name: name,
            children: [],
            main: false,
            deleted: false,
        }
        this.locations.push(per)
        return per

    }
    init(projectID: string) {
        this.projectID = projectID;
    }
    /**
     * 从数据库加载位置信息
     * @param projectID 项目ID
     */
    load(projectID: string) {
        this.init(projectID)
    }

    /**
     * 保存信息到数据库
     * @param projectID 项目ID
     */
    save(projectID: string) {
        this.init(projectID)
    }

    /**
     * 返回当前页面（项目）内的位置数组
     * @returns 位置数组
     */
    getLocations() {
        return this.locations
    }

    /**
     * 保存当前项目的数组
     * @param locations 位置数组
     */
    setLocation(locations: Locations) {
        this.locations = locations;
    }
}


export { BaseLocation }