
let reg12 = require('./regions/12')
let down43 = require('./regions/download/43')
let parse43 = require('./regions/parse/43')

//let startDate = new Date("2020-11-03")
//date.toDateString('ru', { month: 'long' })
//console.log(date.toLocaleDateString('ru', { month: 'long' }))

let startDate = reg12.GetLastSavedFileDate("pages/12/")
console.log("startDate pages " + startDate)

console.log("DownloadPage start")
reg12.DownloadPage(startDate)
console.log("DownloadPage middle")

console.log("DownloadPage end ------------------------------------------------------------------------------------------")
//startDate = GetLastSavedFileDate("text/12/")
//console.log("startDate text " + startDate)
reg12.ConvertPagesToTxt(startDate)
console.log("ConvertPagesToTxt end ------------------------------------------------------------------------------------------")

// Parse data
let dataArray = []

let parse = require('./parse')
parse.Parse(dataArray)
console.log("Parse end ------------------------------------------------------------------------------------------")

let text = require('./text')
text.ConvertToTxtFile(dataArray)

//down43.DownloadAllPages(501)
//down43.DownloadNewPages()
//down43.DownloadAllPages(21)
/*
console.log("down43.DownloadAllPages() start ------------------------------------------------------------------------------------------")
down43.DownloadAllPages()
console.log("down43.DownloadAllPages() end ------------------------------------------------------------------------------------------")
parse43.ParseAllPages()
console.log("parse43.ParseAllPages() end ------------------------------------------------------------------------------------------")
*/
/*
async function f() {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("готово!"), 1000)
  });

  let result = await promise; // будет ждать, пока промис не выполнится (*)

  console.log(result); // "готово!"
}
console.log("start");
f();
console.log("end");
*/

/*
let needle = require('needle');

let needlePromise = function(src) {
  return new Promise((resolve, reject) => {
    let URL = 'http://www.medkirov.ru/news'
    needle.get(URL, (err, res) => {
      if (err) reject(err)
      else resolve(res);
    });
  })
}

let test2 = async function() {
  console.log("test() start")
  let res = await needlePromise()
  //console.log(res)

  //needle("get", URL)
  //.then(function(resp) {
  //  console.log("resp")
  //})
  //.catch(function(err) {
//    console.log("err")
  //});
  console.log("test() end")
}
let test = async function() {
  await test2()
}
console.log("test() call")
test()
console.log("test() call end")
*/

/*
let request = require('request');
test = async function() {
  console.log("test() start")
  let URL = 'http://www.medkirov.ru/news'
  let options = {
    url: URL,
    method: "GET",
    //json: true
  }
  let result = await request(options)
  //console.log(options) 
  //console.log(result) 
  console.log("test() end")
}
console.log("test() call req")
test()
console.log("test() call end req")
*/

