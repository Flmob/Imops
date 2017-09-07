var fncts = require('./functions');

function check1(fInput) {
    console.log('Checking form 1...');

    var res = {
        res: true,
        msg: 'Correct'
    };

    if ('images' in fInput) {
        if (fInput.images.length == 0 || fInput.images.length > 3) {
            res.msg = "Select from 1 to 3 files.";
            res.res = false;
            return res;
        } else {
            for (let file of fInput.images) {
                if (!file.path || !file.fieldName || !file.originalFilename) {
                    res.msg = 'At least one file is not exist!';
                    res.res = false;
                    return res;
                }
                res.msg = file.originalFilename;
                if (!file.size) {
                    res.msg += ': is empty!';
                    res.res = false;
                    return res;
                }
                var t = fncts.getType(file.path);
                if (!/^(jpeg|jpg|png)$/gi.test(t)) {
                    res.msg += ': wrong format! ' + t;
                    res.res = false;
                    return res;
                }
            }
        }
    } else {
        res.msg = "There is no images!";
        res.res = false;
        return res;
    }

    return {
        res: true,
        msg: 'Correct'
    };
}

function check2(eInput) {
    console.log(eInput);
    console.log('Checking form 2...');

    var res = {
        res: true,
        msg: 'Correct'
    };

    if (eInput == '') {
        res.msg = 'Insert your email!';
        res.res = false;
    } else if (!(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(eInput))) {
        res.msg = 'Incorrect email!';
        res.res = false;
    }

    return res;
}

exports.fileCheck = check1;
exports.mailCheck = check2;