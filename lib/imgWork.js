var fs = require('fs');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

function saveImg(obj) {
    console.log("\n***Uploading***");

    console.log(obj.originalFilename);
    fs.readFile(obj.path, function(err, data) {
        var imageName = obj.originalFilename;

        if (!imageName) {
            console.log("There was an error");
            return false;
        } else {
            newPath = __dirname + "/../uploads/fullsize/" + imageName;
            fs.writeFile(newPath, data, function(err) {
                console.log(imageName + ' is uploaded');
            });
        }
    });
}

function optImg(imgs, clb) {
    console.log('\n***Optimization***');

    var paths = imgs.map(it => it.path);

    imagemin(paths, 'uploads/optimized', {
        plugins: [
            imageminJpegtran({ quality: '40-50' }),
            imageminPngquant({ quality: '40-50' })
        ]
    }).then(files => {
        console.log('\n***Optimization successfull***');
        clb(null, files);
    }, error => {
        console.log('\n***Optimization UNsuccessfull***');
        clb(error);
    });
}

exports.saveImg = saveImg;
exports.optImg = optImg;