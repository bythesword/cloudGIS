
import { LoadZip } from "../jsm/LoadZip";


let abc = document.getElementById("abc");

let zzz = new LoadZip();

let text = await zzz.getZipDataFromUrl("/public/abc.zip");

console.log(text);
abc.innerHTML = text;

