import axios from "axios";
import formData from "form-data";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
export default class HttpSource {
   constructor({ url, arrayText, getMatch }) {
      this.url = url;
      this.getMatch = getMatch;
      this.arrayText = (arrayText || []);
      this.client = this.server = this.id = null;
   }
   
   addText(text) {
      if (text) this.arrayText.push(text.toString());
   }
   
   async createToken() {
      const jar = new CookieJar();
      const client = wrapper(axios.create({ jar }));
      return client.get(this.url, {
         headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            referer: "https://en.ephoto360.com/home-p2"
         }
      }).then(({ data: html }) => {
         const token = this.getMatch(html, /name="token"\s*value="(.*?)"/);
         const id = this.getMatch(html, /name="build_server_id"\s*value="(.*?)"/);
         const server = this.getMatch(html, /name="build_server"\s*value="(.*?)"/);
         if (!id) return Promise.reject({ message: "Não foi criado o id ou encontrado.", error: html });
         if (!token) return Promise.reject({ message: "Não foi criado o token ou encontrado.", error: html });
         if (!server) return Promise.reject({ message: "Não foi criado o server ou encontrado.", error: html });
         
         this.id = id;
         this.server = server;
         this.client = client;
         return Promise.resolve(token);
      });
   }
}