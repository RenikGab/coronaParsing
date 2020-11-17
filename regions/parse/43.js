let fs = require('fs')
let path = require('path')

let commonStringName = ["В настоящее время на стационарном лечении находятся", 
                        "В настоящее время на стационарном лечении находится"]
let commonStringName_v1 = ["На сегодняшний день в инфекционных госпиталях"]                        

let addStringName = ["На сегодняшний день в отделении реанимации и интенсивной терапии"]
let addStringName_v1 = ["В отделении реанимации и интенсивной терапии"]
//let covidStringName = ["с covid-19"];

let paramNames = ["total", "corona", "pnevmo", "diag", "hard", "IVL"]

exports.ParseAllPages = function() {

  let dataArray = []
  let textDir = "text/43/"
  let texts = fs.readdirSync(textDir);
  for(let txt of texts) 
  {
    //let txt = "201027.txt"
    let file = textDir + txt

    if (fs.statSync(file).isFile()) {

      let body = fs.readFileSync(file)
      let strings = body.toString().split('\n');     
      //console.log(strings)

      let newObject = {}
      newObject.date = path.basename(file, path.extname(file))

      for (let ii = 0; ii < strings.length; ii++) {
        for (ident of commonStringName) {
          let pos = strings[ii].indexOf(ident, 0)
          if (pos >= 0) {      
            let info = strings[ii].slice(pos).replace(/(\d)(?= \d) /g, '$1').match(/\s\d+\s/g)
            //console.log(info);
            for(let ii = 0; (ii < 4) && (ii < info.length); ii++)
              newObject[paramNames[ii]] = info[ii].trim();
            break;
          }
        }

        let pos = strings[ii].indexOf(commonStringName_v1[0], 0)
        if (pos >= 0) {      
          //let info = strings[ii].slice(pos).replace(/(\d)(?= \d) /g, '$1').match(/\s\d+\s/g)
          let new_str = strings[ii].slice(pos)
          new_str = new_str.slice(0, new_str.indexOf('.'))
          //console.log("new_str " + new_str)
          let info = new_str.replace(/(\d)(?= \d) /g, '$1').match(/\s\d+\s/g)
          //console.log(info)
          for(let ii = 0; (ii < 2) && (ii < info.length); ii++)
            newObject[paramNames[ii]] = info[ii].trim();
        }

        pos = strings[ii].indexOf(addStringName[0], 0)
        if (pos >= 0) {      
          let info = strings[ii].slice(pos).replace(/(\d)(?= \d) /g, '$1').match(/\d+\s/g)          
          if (info.length > 3)
          {
            newObject[paramNames[4]] = String(Number(info[0]) + Number(info[2]));
            newObject[paramNames[5]] = String(Number(info[1]) + Number(info[3]));
          }
        }

        pos = strings[ii].indexOf(addStringName_v1[0], 0)
        if (pos >= 0) {      
          let info = strings[ii].slice(pos).replace(/(\d)(?= \d) /g, '$1').match(/\d+/g)          
          if (info.length > 1)
          {
            newObject[paramNames[4]] = info[0]
            newObject[paramNames[5]] = info[1]
          }
        }
      }
      dataArray.push(newObject)
      //console.log(newObject);
    }
  }

  //console.log(dataArray);
  fs.writeFileSync("docs/data/43/data.json", JSON.stringify(dataArray, 1, 1))


/*
  let textDir = "text/43/"
  let texts = fs.readdirSync(textDir);
  for(let txt of texts) {
    let file = textDir + txt
    if (fs.statSync(file).isFile()) {
      console.log(file);
      let body = fs.readFileSync(file)
      let strings = body.toString().split('\n');     
      let startPos = findStartCommonStatPos(arrStringNames[0], strings, /\d+/)


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

  fs.writeFileSync("docs/data/12/data.json", JSON.stringify(dataArray, 1, 1))
  */
}