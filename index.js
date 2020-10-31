/*
let globalTunnel = require('global-tunnel-ng');
globalTunnel.initialize({
  host: 'proxy.fc.chromatec.ru',
  port: 3129,
});

let request = require('request');
let sprintf = require('sprintf-js').sprintf
let fs = require('fs')

let date = new Date("2020-10-21")
let endDate = new Date()
let today = new Date()
let URL_start = 'http://mari-el.gov.ru/minzdrav/Pages/';
let URL_finish = '_1.aspx';
for ( ; date < endDate; date.setDate(date.getDate() + 1)) {
  let stringDate = sprintf("%02d%02d%02d", date.getFullYear()-2000, date.getMonth()+1, date.getDate())
  let URL = URL_start + stringDate + URL_finish;
  console.log(URL)
  request(URL, function (err, res, body) {
    if (err) throw err;
    //console.log(body);
    fs.writeFileSync("pages/" + stringDate + ".html", body)
    console.log(stringDate + " " + res.statusCode);
  });  
}*/

/*
let fs = require('fs')
let path = require('path')
let pagesDir = "pages/"
let textDir = "text/"
let pages = fs.readdirSync(pagesDir);
for(let page of pages) {
  let file = pagesDir + page
  if (fs.statSync(file).isFile()) {
    let body = fs.readFileSync(file)   
    let cheerio = require('cheerio');
    let $ = cheerio.load(body);
    let news = $('.news_text')    
    let outputFileName = textDir + path.basename(file, path.extname(file)) + ".txt"
    fs.writeFileSync(outputFileName, "")
    news.each(function() {
      fs.appendFileSync(outputFileName, $(this).text())
    })
  }
}*/

/*let onj = {
  "date", total, pnevmo, acquire, hard, middle, light, O2, IVL
}*/



let dataArray = []

let arrStringNames = [["стационарах республики"],
                    ["с пневмонией"],
                    ["с подтвержденной коронавирусной инфекцией"],
                    ["тяжелом состоянии"],
                    ["в состоянии средней степени тяжести"],
                    ["легкой степени тяжести"],
                    ["кислородной поддержке"],
                    ["искусственной вентиляции легких"]]

let arrStringNames2 = ["стационаров республики выписан", "оспитализирован", "а период"]

let paramNames = ["total", "pnevmo", "corona", "hard", "middle", "light", "O2", "IVL"]  
let plusMinusNames = ["minus", "plus"]

function findStartCommonStatPos(arrStringNames, strings) {
  for (let common of arrStringNames) {
    for (let ii = 0; ii < strings.length; ii++) {
      if (strings[ii].indexOf(common, 0) > 0) {
        //console.log(common + " " + strings[ii].match(regexp).toString());
        //console.log(strings[ii].match(regexp));
        return ii
      }
    }
  }
  return -1;
}

function parseStat(arrStringNames, strings, startPos, newObject) {
  for (let jj = 1; jj < arrStringNames.length; jj++) {
    toNextString:
    for (let common of arrStringNames[jj]) {
      for (let ii = startPos; ii < strings.length; ii++) {
        if (strings[ii].indexOf(common, 0) > 0) {
          let count = strings[ii].toString().match(/\d+/)
          if (count != null)
            //console.log(common + " " + count.toString());
            newObject[paramNames[jj]] = count.toString();
          break toNextString
        }
      }
    }
  }
}      

function parsePlusMinus(strings, newObject) {
  for (let ii = 0; ii < strings.length; ii++) {
    let index = strings[ii].indexOf(arrStringNames2[0], 0)
    if (index > 0) {
      if (strings[ii].indexOf(arrStringNames2[2], 0) == -1)
      {
        let subString = strings[ii].slice(index)
        let numbArr = subString.toString().match(/\d+/g)
        if (numbArr)
          if (numbArr.length > 0) 
            newObject[plusMinusNames[0]] = numbArr[0].toString();

        let index2 = subString.indexOf(arrStringNames2[1], 0)
        numbArr = subString.slice(index2).toString().match(/\d+/g)
        if (numbArr)
          if (numbArr.length > 0) 
            newObject[plusMinusNames[1]] = numbArr[0].toString();
      }
    }
  }
}

let fs = require('fs')
let path = require('path')

let textDir = "text/"
let texts = fs.readdirSync(textDir);
for(let txt of texts) {
  let file = textDir + txt
  if (fs.statSync(file).isFile()) {
    console.log(file);
    let body = fs.readFileSync(file)
    //let body = fs.readFileSync("text/" + "200601" + ".txt")
    //let body = fs.readFileSync("text/" + "201018" + ".txt")
    //let body = fs.readFileSync("text/" + "201020" + ".txt")
    let strings = body.toString().split('\n');     
    let startPos = findStartCommonStatPos(arrStringNames[0], strings, /\d+/)

    //console.log(startPos + " " + strings.length);
    if (startPos > 0) {
      let subStrings = strings.slice(startPos)
      // Если в строке содержится много чисел - разделяем строку
      if (strings[startPos].match(/\d+/g).length > 2)
        subStrings = strings[startPos].split(/\.|,/)

      startPos = 0
      //console.log(subStrings);

      let newObject = {}
      newObject.date = path.basename(file, path.extname(file))

      const firstNumber = subStrings[startPos].match(/\d+/)
      if (firstNumber.index > subStrings[startPos].indexOf(arrStringNames[0][0])) {
        console.log(arrStringNames[0][0] + "1 " + firstNumber);
        newObject[paramNames[0]] = firstNumber.toString();
      }
      else {    
        const numbArr = subStrings[startPos].match(/\d+/g)
        if (numbArr.length > 1) {
          console.log(arrStringNames[0][0] + "2 " + numbArr[1]);          
          newObject[paramNames[0]] = numbArr[1].toString();
        }
        else {
          console.log(arrStringNames[0][0] + "3 " + numbArr[0]);
          newObject[paramNames[0]] = numbArr[0].toString();
        }
      }  
      parseStat(arrStringNames, subStrings, startPos, newObject)
      parsePlusMinus(strings, newObject)

      dataArray.push(newObject)
    }
  }
}

//console.log(dataArray)
fs.writeFileSync("output/data.js", "let dataArray = ")
fs.appendFileSync("output/data.js", JSON.stringify(dataArray, 1, 1))

/*
fs.writeFileSync("output/data.txt", "date\ttotal\tpnevmo\tcorona\thard\tmiddle\tO2\tIVL\tplus\tminus\n")
for (data of dataArray) {
  fs.appendFileSync("output/data.txt", data.date + "\t")
  if (data.total == undefined)
    data.total = ""
  if (data.pnevmo == undefined)
    data.pnevmo = ""
  if (data.corona == undefined)
    data.corona = ""
  if (data.hard == undefined)
    data.hard = ""
  if (data.middle == undefined)
    data.middle = ""
  if (data.O2 == undefined)
    data.O2 = ""
  if (data.IVL == undefined)
    data.IVL = ""
  if (data.plus == undefined)
    data.plus = ""
  if (data.minus == undefined)
    data.minus = ""

  fs.appendFileSync("output/data.txt", data.total + "\t")
  fs.appendFileSync("output/data.txt", data.pnevmo + "\t")
  fs.appendFileSync("output/data.txt", data.corona + "\t")
  fs.appendFileSync("output/data.txt", data.hard + "\t")
  fs.appendFileSync("output/data.txt", data.middle + "\t")
  fs.appendFileSync("output/data.txt", data.O2 + "\t")
  fs.appendFileSync("output/data.txt", data.IVL + "\t")
  fs.appendFileSync("output/data.txt", data.plus + "\t")      
  fs.appendFileSync("output/data.txt", data.minus + "\t")        
  fs.appendFileSync("output/data.txt", "\n")
}
*/
