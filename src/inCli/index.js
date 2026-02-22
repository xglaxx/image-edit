import EventEmitter from "events";
import getMatch from "../inCore/getMatch.js";
import ArrayRadios from "../inCore/ArrayRadio.js";
import HttpsPortsSource from "../inPorts/HttpsSource.js";
import TextProSource from "../TextPro/HttpsSourceCreate.js";
import PhotooxySource from "../Photooxy/HttpsSourceCreate.js";
import Ephoto360Source from "../Ephoto360/HttpsSourceCreate.js";
const httpsportssource = (data) => new HttpsPortsSource({
   ...data, getMatch, ArrayRadios,
   ev: new EventEmitter()
});
const TextPro = (arrayText, url, selectRadios = []) => new TextProSource(httpsportssource({ arrayText, url, selectRadios }));
const Photooxy = (arrayText, url, selectRadios = []) => new PhotooxySource(httpsportssource({ arrayText, url, selectRadios }));
const Ephoto360 = (arrayText, url, selectRadios = []) => new Ephoto360Source(httpsportssource({ arrayText, url, selectRadios }));
const General = (arrayText, url, selectRadios = []) => {
   if (/textpro\.me/.test(url)) return TextPro(arrayText, url, selectRadios);
   if (/photooxy\.com/.test(url)) return Photooxy(arrayText, url, selectRadios);
   if (/ephoto360\.com/.test(url)) return Ephoto360(arrayText, url, selectRadios);
   
   throw new Error("Não existe um scrapper com essa url: "+url);
};
export { Ephoto360, TextPro, Photooxy, General };