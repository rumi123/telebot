const data = require('./data')


data.forEach(element => {
    console.log(new Array({text:element.name,callBack:element.itemCode}));
});

text1 = "AF"
text2 = "AF 01"

console.log(text1.length);
console.log(text2.length);
console.log(text2.split(" "));