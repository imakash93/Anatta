var https = require('https')
var http = require('http')
var validUrl = require('valid-url');
var protocol = null;
var url, words, protocol;
if (process.argv.length >= 4 && validUrl.isUri(process.argv[2].split('=')[1])) {

    console.log('Getting Results...')
    url = process.argv[2].split('=')[1];
    argProtocol = url.split(':')[0];
    words = process.argv[3].split('=')[1];
    protocol = argProtocol == 'http' ? http : https
    protocol.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            const sourceStr = body;
            var wordCounts = {};
            if (words.length) {
                words.split(',').forEach(word => {
                    let indexes = [...sourceStr.matchAll(new RegExp(word, 'gi'))].map(a => a.index);
                    wordCounts[word + ': '] = indexes.length > 0 ? indexes.length + 1 : indexes.length;
                });
                console.log(wordCounts);
            } else {
                console.log('No result found!')
            }
        });
    }).on('error', function (e) {
        console.log("URL not found.");
    });
} else {
    console.log('Please provide valid argumets only. --url=https://abc.com --words=Sustainable,..... ');
}
