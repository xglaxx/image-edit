import getMatch from "../inCore/getMatch.js";
import TextProSource from "../TextPro/HttpsSourceCreate.js";
import PhotooxySource from "../Photooxy/HttpsSourceCreate.js";
import Ephoto360Source from "../Ephoto360/HttpsSourceCreate.js";
const TextPro = (arrayText, url) => new TextProSource({
   url, arrayText, getMatch
});
const Photooxy = (arrayText, url) => new PhotooxySource({
   url, arrayText, getMatch
});
const Ephoto360 = (arrayText, url) => new Ephoto360Source({
   url, arrayText, getMatch
});
const General = (arrayText, url) => {
   if (/textpro\.me/.test(url)) return TextPro(arrayText, url);
   if (/photooxy\.com/.test(url)) return Photooxy(arrayText, url);
   if (/ephoto360\.com/.test(url)) return Ephoto360(arrayText, url);
   
   throw new Error("Não existe um scrapper com essa url: "+url);
};
export { Ephoto360, TextPro, Photooxy, General };