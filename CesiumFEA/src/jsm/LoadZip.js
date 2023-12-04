
import * as zip from "tomzipjs";
class LoadZip {
    constructor() { }

    async loadZipAndFun(url, fun, fileName = false) {
        const zipReader = new zip.ZipReader(new zip.HttpReader(url, { useXHR: true }));
        this.log({
            type: "log",
            succeed: true,
            subject: "传输文件完成",
            sender: "main.loadZip()",
        });
        let zipEntries = await zipReader.getEntries();

        for (let i in zipEntries) {
            if (zipEntries[i].filename == fileName || fileName === false) {
                let data = await zipEntries[i].getData(new zip.TextWriter());

                fun(data, this);
                if (fileName === false) break;
            }
        }
        await zipReader.close();
    }
    async getZipDataFromUrl(url, fileName = false) {
        let data;
        const zipReader = new zip.ZipReader(new zip.HttpReader(url, { useXHR: true }));

        let zipEntries = await zipReader.getEntries();

        for (let i in zipEntries) {
            if (zipEntries[i].filename == fileName || fileName === false) {
                data = await zipEntries[i].getData(new zip.TextWriter());

                if (fileName === false) break;
            }
        }
        await zipReader.close();
        return data;
    }
}

export { LoadZip }