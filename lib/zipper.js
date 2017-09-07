var fs = require('fs');
var archiver = require('archiver');

var fncts = require('./functions');

var count = 0;

function zipImgs(files, clb) {
    var cont = true,
        myErr;
    console.log('\n***Zipping***');

    var output = fs.createWriteStream(__dirname + `/../uploads/zips/Imops_${count}.zip`);
    count++;
    var zip = archiver('zip');
    zip.pipe(output);

    // good practice to catch warnings (ie stat failures and other non-blocking errors) 
    zip.on('warning', function(err) {
        myErr = err;
        cont = false;
        console.log('warn ', cont);
    });

    // good practice to catch this error explicitly 
    zip.on('error', function(err) {
        myErr = err;
        cont = false;
        console.log('err ', cont);
    });

    // zip.on('end', function() {
    //     console.log('**********');
    //     console.log(cont);
    //     if (cont) {
    //         clb(undefined, output.path);
    //     } else {
    //         clb(myErr);
    //         console.log(output.path);
    //         fncts.deleteFile(output.path, function(err) {
    //             if (err) console.log(err);
    //         });
    //         return false;
    //     }
    // });

    function resolve(res) {
        console.log('**********');
        console.log(cont);
        if (cont) {
            clb(undefined, output.path);
        } else {
            clb(myErr);
            console.log(output.path);
            fncts.deleteFile(output.path, function(err) {
                if (err) console.log(err);
            });
            return false;
        }
    }

    for (let key in files) {
        console.log(key, files[key]);
        zip.file(files[key], { name: key });
    }

    zip.finalize().then(
        resolve,
        reject => {
            console.log('rej ', reject);
        }
    );
}

exports.zipImgs = zipImgs;