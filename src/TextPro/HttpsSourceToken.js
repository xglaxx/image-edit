import formData from "form-data";
import * as cheerio from "cheerio";
import HttpSource from "./HttpsSource.js";
export default class HttpSourceToken extends HttpSource {
   constructor(data) {
      super(data);
   }
   
   async renderToken() {
      const form = new formData();
      const token  = await this.createToken();
      if (!(Array.isArray(this.arrayText) && this.arrayText.length >= 1)) return Promise.reject(new Error("Não foi adicionado nenhum texto."));
      if (!this.client) return Promise.reject(new Error("Não foi renderizado o client."));
      
      for (const txt of this.arrayText) {
         form.append("text[]", txt);
      }
      form.append("token", token);
      form.append("build_server", this.server);
      form.append("build_server_id", this.id);
      form.append("grecaptcharesponse", '');
      return this.client.post(this.url, form, {
         headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            origin: "https://textpro.me",
            referer: this.url
         } 
      }).then(({ data: html }) => {
         const $ = cheerio.load(html);
         const data = JSON.parse($(".sr-only").eq(1).text());
         if (!data) return Promise.reject({ message: "Não foi encontrado o token renderizado.", error: html });
         if (!data.id) return Promise.reject({ message: "Não foi criado o id ou encontrado/renderizado.", error: html });
         if (!data.token) return Promise.reject({ message: "Não foi criado o token ou encontrado/renderizado.", error: html });
         
         return Promise.resolve(data);
      });
   }
}