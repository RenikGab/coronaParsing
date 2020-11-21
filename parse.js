let fs = require('fs')
let path = require('path')

let arrStringNames = [["стационарах республики"],
                    ["с пневмонией"],
                    ["с подтвержденной коронавирусной инфекцией", "с лабораторно подтвержденной коронавирусной инфекцией"],
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

exports.Parse = function(dataArray) {

  let textDir = "text/12/"
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
  //fs.writeFileSync("docs/data.js", "let dataArray = ")
  //fs.appendFileSync("docs/data.js", JSON.stringify(dataArray, 1, 1))
  fs.writeFileSync("docs/data/12/data.json", JSON.stringify(dataArray, 1, 1))
}
