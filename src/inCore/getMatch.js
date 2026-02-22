const getMatch = (text, regexp) => {
   if (!text) return null;
   
   const [_, data] = text.match(regexp);
   return data;
};
export default getMatch;