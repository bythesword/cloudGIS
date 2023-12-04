import cpFS from './cp.fs.glsl?raw';
import raingrassFS from './raingrass.fs.glsl?raw';
import cpVS from './cp.vs.glsl?raw';
class Material {

    constructor() {

        this.cpFS = cpFS;
        this.cpVS = cpVS;
        this.raingrassFS = raingrassFS;

    }
}
export { Material }
