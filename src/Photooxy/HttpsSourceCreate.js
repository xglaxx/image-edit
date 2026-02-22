import formData from "form-data";
import HttpsSourceToken from "./HttpsSourceToken.js";
export default class HttpSourceCreate extends HttpsSourceToken {
   constructor(data) {
      super(data);
      this.tag = "photooxy";
   }
   
   async createImage() {
      this.emit("image.creating", { url: this.url, tag: this.tag });
      const form = new formData();
      const { token, id } = await this.renderToken();
      form.append("id", id);
      for (const txt of this.arrayText) {
         form.append("text[]", txt);
      }
      for (const radio in this.radios) {
         form.append(radio+"[radio]", this.radios[radio]);
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
         data.server = "photooxy.com";
         if (!data.success) {
            this.emit("image.error", data);
            return Promise.reject(data);
         }
         
         data.url = this.server+data.image;
         this.client = this.server = this.id = this.radios = this.radiosList = null;
         this.emit("image.complete", data);
         return Promise.resolve(data);
      }).catch((error) => {
         this.emit("image.error", { url: this.url, tag: this.tag, error });
         return Promise.reject(error);
      });
   }
   
}