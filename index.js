
let reg12 = require('./regions/12')
let reg43 = require('./regions/43')

//let startDate = new Date("2020-11-03")
//date.toDateString('ru', { month: 'long' })
//console.log(date.toLocaleDateString('ru', { month: 'long' }))

let startDate = reg12.GetLastSavedFileDate("pages/12/")
console.log("startDate pages " + startDate)
reg12.DownloadPage(startDate)
//startDate = GetLastSavedFileDate("text/12/")
//console.log("startDate text " + startDate)
reg12.ConvertPagesToTxt(startDate)


// Parse data
/*let dataArray = []

let parse = require('./parse')
parse.Parse(dataArray)

let text = require('./text')
text.ConvertToTxtFile(dataArray)*/

reg43.DownloadAllPages()
