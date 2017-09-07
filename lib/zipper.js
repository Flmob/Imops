var fs = require('fs');

var archiver = require('archiver');

var count = 0;

function zipImgs(files, clb) {
    console.log('\n***Zipping***');

    var output = fs.createWriteStream(__dirname + `/../uploads/zips/Imops_${count}.zip`);
    count++;
    var zip = archiver('zip');

    // good practice to catch warnings (ie stat failures and other non-blocking errors) 
    zip.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning 
            console.log('Warning!');
            console.log(err);
        } else {
            clb(err);
            //zip.fin();
            //delete output;
            return;
        }
    });

    // good practice to catch this error explicitly 
    zip.on('error', function(err) {
        clb(err);
        zip.finalize();
    });

    zip.pipe(output);

    for (let key in files) {
        console.log(key, files[key]);
        zip.file(files[key], { name: key });
    }

    zip.finalize();
    clb(undefined, output.path);
}

exports.zipImgs = zipImgs;