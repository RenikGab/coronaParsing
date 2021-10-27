let request = require('request');
let sprintf = require('sprintf-js').sprintf
let fs = require('fs')
let path = require('path')
let moment = require('moment')
let Sync = require('sync');
var syncRequest = require('sync-request');

let proxy = require('../proxy')


exports.DownloadAllPages = function() {
  proxy.ProxyInit()

  let date = new Date("2020-10-24")
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
      fs.writeFileSync("pages/12/" + stringDate + ".html", body)
      console.log(stringDate + " " + res.statusCode);
    });  
  }
}

// Convert to text
/*function ConvertAllPagesToText() {
  let pagesDir = "pages/12/"
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
  }
}*/


exports.DownloadPage = async function(startDate) {
  proxy.ProxyInit()
  
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];  
  let stringDate = sprintf("%d %s", startDate.getDate(), months[startDate.getMonth()])
  let stringStart = "Коронавирус: ситуация на "   
  console.log(stringStart + stringDate)

  let URL = 'http://mari-el.gov.ru/minzdrav/Pages/main.aspx';
  //let URL = 'http://mari-el.gov.ru/minzdrav/Pages/allnews.aspx';
  //https://yandex.ru/search/?text=Коронавирус%3A+ситуация+на+23+октября

  //Sync(function(){
 
    //request(URL, function (err, res, body) {
      /*if (err) { 
        throw err
      }*/

      let res = syncRequest("GET", URL)
      console.log("request callback")    
      let body = res.getBody()

      
      let cheerio = require('cheerio');
      let $ = cheerio.load(body);
      //let news = $('a:contains("Коронавирус: ситуация на")')
      let ss = 'a:contains(' + stringStart + stringDate + ')'
      let news = $(ss)
      let prob_link = null
      let link = null
      news.each(function() {
        prob_link = $(this).get(0).attribs.href
        base = path.basename(prob_link, path.extname(prob_link)).slice(0,-2)
        let momentDate = moment(base, "YYMMDD")
        let date = momentDate.toDate()
        console.log("date " + date)
        console.log("year " + date.getFullYear() + " " + startDate.getFullYear())
        console.log(prob_link)
        if (date.getFullYear() === startDate.getFullYear())
          link = prob_link
      })
      if (link)
      {      
        //request(link, function (err, res, body) {
          //if (err) throw err;
          let res = syncRequest("GET", link)
          console.log("request link callback", link)
          let body = res.getBody()
    
          //console.log(body);      
          let stringDate = sprintf("%02d%02d%02d", startDate.getFullYear()-2000, startDate.getMonth()+1, startDate.getDate())
          fs.writeFileSync("pages/12/" + stringDate + ".html", body)
        //}); 
      }
    //});
}


exports.GetLastSavedFileDate = function(Dir) {
  let pages = fs.readdirSync(Dir);
  let currDate = new Date(0)
  //console.log("currDate")
  //console.log(currDate)
  for(let page of pages) {
    let base = path.basename(page, path.extname(page))
    let momentDate = moment(base, "YYMMDD")
    let date = momentDate.toDate()
    if (date > currDate)
      currDate = date
  }
  
  currDate.setDate(currDate.getDate() + 1)
  return currDate
}

// Convert to text
exports.ConvertPagesToTxt = function(startDate) {
  let pagesDir = "pages/12/"
  let textDir = "text/12/"
  let pages = fs.readdirSync(pagesDir);
  let texts = fs.readdirSync(textDir);
  for(let page of pages) {
    let file = pagesDir + page
    if (fs.statSync(file).isFile()) {
      let textName = path.basename(file, path.extname(file)) + ".txt"  
      if (!texts.includes(textName, 0)) {

        let body = fs.readFileSync(file)   
        let cheerio = require('cheerio');
        let $ = cheerio.load(body);
        let news = $('.news_text')    
        let outputFileName = textDir + textName
        fs.writeFileSync(outputFileName, "")
        news.each(function() {
          fs.appendFileSync(outputFileName, $(this).text())
        })
      }
    }
  }
}