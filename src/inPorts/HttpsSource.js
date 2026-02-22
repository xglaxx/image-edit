export default class HttpsSource {
   constructor(data) {
      if (typeof data !== "object") throw data;
      this._configSource(data);
   }
   
   _configSource(data) {
      if (!/textpro\.me|(photooxy|ephoto360)\.com/.test(data.url)) throw data;
      if (!Array.isArray(data.selectRadios)) throw data;
      if (!(Array.isArray(data.arrayText) && data.arrayText.length)) throw data;
      
      this.ev = data.ev;
      this.url = data.url;
      this.arrayText = (data.arrayText || []);
      this.selectRadios = (data.selectRadios || []);
      this.client = this.server = this.id = this.radios = null;
      this.getMatch = data.getMatch;
      this.ArrayRadios = data.ArrayRadios;
      return this;
   }
}