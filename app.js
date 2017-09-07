var express = require('express');
var bodyParser = require('body-parser');

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

var fs = require('fs');

var inpCheck = require('./lib/inpCheck');
var eSender = require('./lib/eSender');
var zipper = require('./lib/zipper');
var imgWork = require('./lib/imgWork');
var fncts = require('./lib/functions');

fncts.deleteFile('./uploads/test.txt', function(err, res) {
    if (err) console.log(err);
    else console.log(res);
});

var app = express();

app.use(function(req, res, next) {
    console.log(req.path);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.get("/", function(req, res) {
    res.sendFile('index.html');
});

app.post('/upload', function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var checkRes = inpCheck.fileCheck(files);

        console.log(checkRes);
        if (!checkRes.res) {
            res.status(400);
            res.end(checkRes.msg);
            return;
        }

        files = Array.from(files.images);
        files.forEach(imgWork.saveImg);

        imgWork.optImg(files, function(err, optFiles) {
            if (err) {
                console.log(err);
                res.status(500);
                res.end(err.code);
                return;
            }

            var nms = {},
                fSizes = {};

            optFiles.forEach(function(it, i) {
                console.log(it.path);
                nms[fncts.getName(it.path)] = it.path;
                fSizes[files[i].originalFilename] = {
                    oSize: fncts.getFilesizeInBytes(files[i].path),
                    nSize: fncts.getFilesizeInBytes(it.path)
                };
            });

            var jRes = {
                fPaths: nms,
                fSizes: fSizes
            };

            res.end(JSON.stringify(jRes));
        });
    });
});

app.post('/download', function(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
        console.log(fields);

        var checkRes = inpCheck.mailCheck(fields.email[0]);
        //checkRes

        console.log(checkRes);
        if (!checkRes.res) {
            res.status(400);
            res.end(checkRes.msg);
            return;
        }

        zipper.zipImgs(JSON.parse(fields.paths[0]), function(err, zPath) {
            if (err) {
                res.status(500);
                res.end(err.code);
                console.log('\n***Zipping UNsuccesfull***');
                return;
            }

            var options = {
                to: fields.email[0],
                attachments: [{
                    filename: 'Imops.zip',
                    path: zPath
                }]
            };

            eSender.sendE(options, function(err, info) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.end('Sorry, but mail has not been sent');
                    console.log('\n***Sending UNsuccesfull***');
                    return;
                }
                res.end('Mail has been sent!');
                console.log('\n***Sending succesfull***');
            });
        });
    });
});

app.use(function(req, res, next) {
    res.status(404).sendFile(__dirname + '/views/404.html');
});

app.listen(3000, function() {
    console.log('Server on. Port 3000');
});