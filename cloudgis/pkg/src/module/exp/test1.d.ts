/**
 * Class  这个是Test1类
 *
 */
declare class Test1 {
    /**
     * @property {number} id  身份
     */
    id: number;
    /***
     * @property {string} name  名称
     */
    name: string;
    /**
  * Test1的构造函数
  * @constructor
  * @param {number} id - ID
  * @param {string} name - name
  */
    constructor(id: number, name: string);
    /**
     * 获取ID
     * @returns {number} id -ID
     */
    getID(): number;
    /**
     * 设置ID
     * @param id {number} id-ID
     */
    setID(id: number): void;
}
export { Test1 };
