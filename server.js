const express = require('express');
const app = express();
const cheerio = require('cheerio');
var request = require('request');

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const urlbase = 'https://www.signingsavvy.com/'
const server = app.listen(5000);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const scrapeForVideo = (url, res, word) => {
    console.log(urlbase + url)
    request(urlbase + url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html)
            const video = $('video').children().attr('src')
            const videourl = urlbase + video
            res.send(videourl)
        } else {
            res.send('Error')
        }
    })
}

app.get('/word/:word', (req, res) => {
    request(urlbase + 'search/' + req.params.word, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html)
            $('.search_results li').each(function(i, elm) {
                if ($(this).text().toLowerCase() === req.params.word.toLowerCase()) {
                    var url = $(this).children().attr('href')
                    return scrapeForVideo(url, res)
                }
            });
        } else {
            res.send('Error')
        }

        
    });
})