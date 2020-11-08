let fs = require('fs')

let fieldNames = ["date", "total", "pnevmo", "corona", "hard", "middle", "O2", "IVL", "plus", "minus"]

exports.ConvertToTxtFile = function(dataArray) {
    
  let fileName = "docs/data.txt"
  
  // Write table caption
  fs.writeFileSync(fileName, "")
  for (let field of fieldNames)
    fs.appendFileSync(fileName, field + "\t")  
  fs.appendFileSync(fileName, "\n") 

  // Write table data
  for (data of dataArray) {
    for (let field of fieldNames) {
      if (data[field] == undefined)
        data[field] = ""
        
      fs.appendFileSync(fileName, data[field] + "\t")
    }   
    fs.appendFileSync(fileName, "\n")
  }
}
