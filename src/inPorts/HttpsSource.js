import EventEmitter from "EventEmitter";
export default class HttpsSource extends EventEmitter {
   constructor(data) {
      if (typeof data !== "object") throw data;
      
      super();
      this._configSource(data);
   }
   
   _configSource(data) {
      if (!/textpro\.me|(photooxy|ephoto360)\.com/.test(data.url)) throw data;
      if (!Array.isArray(data.selectRadios)) throw data;
      if (!(Array.isArray(data.arrayText) && data.arrayText.length)) throw data;
      
      this.url = data.url;
      this.arrayText = (data.arrayText || []);
      this.selectRadios = (data.selectRadios || []);
      this.client = this.server = this.id = this.radios = null;
      this.getMatch = data.getMatch;
      this.ArrayRadios = data.ArrayRadios;
      return this;
   }
}