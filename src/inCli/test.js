#!/usr/bin/env node
import readline from "readline";
import { Ephoto360, TextPro, Photooxy, General } from "./index.js";
const pross = process.stdout;
const clearLastLines = (count) => {
   process.stdout.moveCursor(0, - count);
   process.stdout.clearScreenDown();
};
function sleep(delay) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve("ok");
      }, delay * 1000);
   }); 
}
function readConsole(text) {
   let space = 0;
   const rl = readline.createInterface({ input: process.stdin, output: pross });
   const question = (q) => new Promise((resolve, reject) => {
      rl.question((q || ""), resolve, reject);
   }); 
   return {
      response: async (q) => {
         pross.clearLine();
         pross.cursorTo(0);
         pross.write(q.toString());
         await sleep(4);
         pross.clearLine();
         pross.cursorTo(0);
         const sexo = q.replaceAll("\n", "§").trim().split("§");
         clearLastLines(sexo.length+space);
      },
      question: async (q) => {
         q = (q || text);
         const sexo = q.replaceAll("\n", "§").trim().split("§");
         const response = await question(q);
         space = (!response.length ? 1 : 0);
         clearLastLines(sexo.length+space);
         return response;
      },
      exit: () => rl.close()
   };
}
(async () => {
   const config = ({ pass: false, arrayText: [], tag: "", url: false });
   const rl = readConsole();
   while (!config.pass) {
      let res = await rl.question("× Url adicionado? "+(config.url ? "Está" : "Não está")+"!\n× Quantos textos adicionados? "+config.arrayText.length+" textos\n× Se não tiver nada adicionado/alterado, não será continuado, então digite primeiro a url logo depois os textos...\n× Url/Texto: ");
      if (!res && config.url && config.arrayText.length) {
         config.pass = true;
      } else {
         if (/https:\/\//.test(res)) {
            await rl.response(config.url ? "× Foi alterado a url..." : "Foi adicionado a url...");
            config.url = res;
         }
         if (config.url && res && !/https:\/\//.test(res)) {
            config.arrayText.push(res);
            await rl.response("× Foi adicionado um texto...");
         }
         if (config.arrayText.length) {
            res = await rl.question("× Gostaria de adicionar(texto) ou alterar(url)?\n× Se caso sim, pode digitar algo em seguida ou simplesmente não quer alterar/adicionar nada, não digite nada, isso já passa para o resultado.\n× Url/Texto: ");
            if (/https:\/\//.test(res)) {
               config.url = res;
               await rl.response("× Foi alterado a url...");
            } else if (res) {
               config.arrayText.push(res);
               await rl.response("× Foi adicionado +1 texto...");
            } else {
               config.pass = (!res || res === "n");
            }
         }
      }
   }
   
   const ep = General(config.arrayText, config.url);
   await ep.getRadios().then((res) => {
      console.log("General:", res);
   });
   process.exit();
   rl.exit();
})();