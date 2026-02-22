import formData from "form-data";
import HttpSourceToken from "./HttpsSourceToken.js";
export default class HttpSourceCreate extends HttpSourceToken {
   constructor(data) {
      super(data);
   }
   
   async createImage() {
      const form = new formData();
      const { token, id } = await this.renderToken();
      form.append("id", id);
      for (const txt of this.arrayText) {
         form.append("text[]", txt);
      }
      form.append("grecaptcharesponse", '');
      form.append("g-recaptcha-response", '');
      form.append("token", token);
      form.append("build_server", this.server);
      form.append("build_server_id", this.id);
      return this.client.post("https://photooxy.com/effect/create-image", form, {
         headers: {
            accept: "*/*",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
            origin: "https://photooxy.com",
            referer: this.url
         } 
      }).then(({ data }) => {
         if (!data.success) return Promise.reject(data);
         
         data.server = "photooxy.com";
         data.url = this.server+data.image;
         this.client = this.server = this.id = null;
         return Promise.resolve(data);
      });
   }
   
}