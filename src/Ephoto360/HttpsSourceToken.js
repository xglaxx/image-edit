import formData from "form-data";
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
      form.append("submit", "GO");
      form.append("token", token);
      form.append("build_server", this.server);
      form.append("build_server_id", this.id);
      return this.client.post(this.url, form, {
         headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            origin: "https://en.ephoto360.com",
            referer: this.url
         } 
      }).then(({ data: html }) => {
         let data = this.getMatch(html, /name="form_value_input"\s*value="(.*?)"/);
         if (!data) return Promise.reject({ message: "Não foi encontrado o token renderizado.", error: html });
         
         data = data.replaceAll("&quot;", " ");
         const id = this.getMatch(data, /id\s*:\s*(.*?)\s*,/);
         const token = this.getMatch(data, /token\s*:\s*(.*?)\s*,/);
         if (!id) return Promise.reject({ message: "Não foi criado o id ou encontrado/renderizado.", error: html });
         if (!token) return Promise.reject({ message: "Não foi criado o token ou encontrado/renderizado.", error: html });
         
         return Promise.resolve({ token: token.replaceAll(`\\`, ""), id });
      });
   }
}