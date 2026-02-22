const findRadios = ([r0, r1, r2, r3], { radio0 = [], radio1 =[], radio2 = [], radio3 = [] }) => {
   const radiosSet = {};
   const radiosSave = {
      "radio0": radio0.find((v, index) => v.title === r0 || v.id === r0 || index === r0),
      "radio1": radio1.find((v, index) => v.title === r1 || v.id === r1 || index === r1),
      "radio2": radio2.find((v, index) => v.title === r2 || v.id === r2 || index === r2),
      "radio3": radio3.find((v, index) => v.title === r3 || v.id === r3 || index === r3)
   };
   for (const tag of ["radio0", "radio1", "radio2", "radio3"]) {
      if (radiosSave[tag]) radiosSet[tag] = radiosSave[tag].value;
   }
   return radiosSet;
};
const radios = ($, data) => {
   const radio0 = [], radio1 = [], radio2 = [], radio3 = [];
   data.map((_, elem) => {
      let value = $(elem).find('input').val();
      let id = $(elem).find('input').attr('id');
      let y = Number($(elem).find('input').attr('data-y'));
      let title = $(elem).find('input').attr('data-title');
      const config = { title, id: y, value };
      if (!id) id = $(elem).attr('for');
      if (/radio0/.test(id)) radio0.push(config);
      if (/radio1/.test(id)) radio1.push(config);
      if (/radio2/.test(id)) radio2.push(config);
      if (/radio3/.test(id)) radio3.push(config);
   });
   return { radio0, radio1, radio2, radio3 };
};
export { radios, findRadios };