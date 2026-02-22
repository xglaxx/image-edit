import axios from "axios";
import formData from "form-data";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
export default class HttpSource {
   constructor(data) {
      Object.assign(this, data);
   }
   
   addText(text) {
      if (text) this.arrayText.push(text.toString());
   }
   
   async createToken() {
      const jar = new CookieJar();
      const client = wrapper(axios.create({ jar }));
      this.ev.emit("token.wait", { url: this.url, tag: this.tag });
      return client.get(this.url, {
         headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            referer: "https://textpro.me/"
         }
      }).then(({ data: html }) => {
         const $ = cheerio.load(html);
         const token = this.getMatch(html, /name="token"\s*value="(.*?)"/);
         const id = this.getMatch(html, /name="build_server_id"\s*value="(.*?)"/);
         const server = this.getMatch(html, /name="build_server"\s*value="(.*?)"/);
         const gre = this.getMatch(html, /name="grecaptcharesponse"\s*value="(.*?)"/);
         if (!id) return Promise.reject({ message: "Não foi criado o id ou encontrado.", error: html });
         if (!token) return Promise.reject({ message: "Não foi criado o token ou encontrado.", error: html });
         if (!server) return Promise.reject({ message: "Não foi criado o server ou encontrado.", error: html });
         
         this.id = id;
         this.server = server;
         this.client = client;
         this.radiosList = this.ArrayRadios.radios($, $('.item-input.select_option_wrapper > label'));
         this.radios = this.ArrayRadios.findRadios(this.selectRadios, this.radiosList);
         this.ev.emit("token.extracted", this);
         return Promise.resolve(token);
      }).catch((error) => {
         this.ev.emit("token.error", { url: this.url, tag: this.tag, error });
         return Promise.reject(error);
      });
   }
   
   async getRadios() {
      if (!this.radiosList) await this.createToken();
      return this.radiosList;
   }
   
}