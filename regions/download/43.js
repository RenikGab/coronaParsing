let needle = require('needle');
let sprintf = require('sprintf-js').sprintf
let fs = require('fs')
let path = require('path')
let moment = require('moment')

let proxy = require('../../proxy')
let cheerio = require('cheerio');

//<div id="news-headdate">13 ноября 2020 г.</div>
//<div id="news-title">За сутки в регионе с выздоровлением от COVID-19 выписано 911 пациентов</div>

//const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];  
function StringToDate(str){
  //let date = new Date(0)
  //date.setFullYear(year, [month], [date])
  //date.setMonth(month, [date])
  //setDate(str.re)
  //let stringDate = sprintf("%d %s", startDate.getDate(), months[startDate.getMonth()])
  
  moment.locale("ru")
  //console.log(moment.locale());         // ru
  let momentDate = moment(str, "LL")
  moment.locale("en")
  momentDate.add(3, "hour")
  //console.log(momentDate)
  //console.log(momentDate.toDate())
  return momentDate.toDate()
}

idents = ["Министерство здравоохранения Кировской области информирует", "По данным министерства здравоохранения Кировской области"]

exports.DownloadAllPages = function(end_page) {
  proxy.ProxyInit()

  //StringToDate("10 ноября 2020 г.")
  //StringToDate("november 21 2020 г.")  

  let URL_begin = 'http://www.medkirov.ru'
  let URL_news = "/news"
  let URL_from = "/start"
  ///news/start/101
  ///news/start/21
  ///news/start/41
  ///news/start/61

  //<div id="mainpage-news-entries">
  //<div class="title">Новости</div>
  //<div class="entry" id="293287-2020.html" onclick='window.open("/news/docid/293287-2020.html", "_self");'>...
  //
  console.log("")
  for (let ii = 1; ii <= end_page; ii+=20)
  {
    let URL = URL_begin + URL_news;
    if (ii > 1)
      URL += URL_from + "/" + ii;
    console.log(URL)
    needle.get(URL, function (err, res) {
      if (err) throw err;
      
      let $ = cheerio.load(res.body);

      let news_entries = $("#mainpage-news-entries")
      //console.log(news_entries);
      news_entries.each(function() {
        links = $(this).get(0)
        //console.log(links.children)
        for (let link of links.children) {
          //console.log("link------------------")
          //console.log(typeof link.attribs)
          if (link.attribs)
            if ("onclick" in link.attribs) {
              let str = link.attribs.onclick.split('"') //("\"")
              if (str.length > 1) {
                //console.log(URL_begin + str[1])
                needle.get(URL_begin + str[1], function (err, res) {
                  if (err) throw err;
                  let $ = cheerio.load(res.body);                
                  let news_headdate = $("#news-headdate")
                  let news_title = $("#news-title")
                  //console.log("news_title--------------" + URL_begin + str[1])
                  //console.log(news_title.text())
                  let begin_paragraph = news_title.next().text()
                  for (let ident of idents) {
                    //console.log(ident)
                    if (begin_paragraph.indexOf(ident, 0) >= 0) {
                      let date = StringToDate(news_headdate.text())
                      //console.log(news_headdate.text())
                      //console.log(StringToDate(news_headdate.text()))
                      //console.log(begin_paragraph)
                      let curr_paragraph = news_title.next()

                      let stringDate = sprintf("%02d%02d%02d", date.getFullYear()-2000, date.getMonth()+1, date.getDate())
                      let fileName = "text/43/" + stringDate + ".txt"
                      console.log(fileName)
                      fs.writeFileSync(fileName, "")
                      while (curr_paragraph.get(0).name == "p") {
                        //console.log(curr_paragraph.text())
                        fs.appendFileSync(fileName, curr_paragraph.text())
                        curr_paragraph = curr_paragraph.next()
                      }
                    }
                  }
                })
              }
            }
        }
      })
      //console.log(res.body);
    });   
  } 
}

exports.DownloadNewPages = function() {
  proxy.ProxyInit()
}
