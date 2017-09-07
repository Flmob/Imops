var fs = require('fs');

function getName(path) {
    var name = path.split(/\/|\\/);
    return name[name.length - 1];
}

function getType(path) {
    var type = path.split('.');
    return type[type.length - 1];
}

function getFilesizeInBytes(filename) {
    return fs.statSync(filename).size;
}

function deleteFile(path, clb) {
    fs.exists(path, function(exist) {
        if (exist) {
            console.log(path, '\nFile exists. Deleting now...');
            fs.unlink(path, clb);
        } else {
            console.log(path, '\nFile not found! Nothing to delete...');
            clb(Error('File not found!'));
        }
    });
}

exports.getName = getName;
exports.getType = getType;
exports.getFilesizeInBytes = getFilesizeInBytes;
exports.deleteFile = deleteFile;