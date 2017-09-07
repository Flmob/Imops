//form1
var uploadF = document.getElementById("uploadF");
var upForm = document.forms.namedItem("upForm");
var fInput = document.getElementById("formfiles");
var btn = document.getElementById("sendFiles");
var fInfo = document.getElementById('fInfo');

//form2
var downloadF = document.getElementById("downloadF");
var downloadB = document.getElementById("downloadB");
var table = document.getElementById("optInfo");

//form3
var eForm = document.getElementById("eForm");
var send = document.getElementById("send");
var eInfo = document.getElementById('eInfo');
var eInput = document.getElementById("mail");

var paths = {},
    sizes = {};

var pop = document.querySelector('.popUp');
pop.onclick = toUnpop;

function toPop(msg = 'Mail has been sent!', err = false) {
    if (err) pop.style.backgroundColor = "red";
    console.log(`${err?'err: ':''}${msg}`);
    pop.innerText = msg;
    classWork(pop, "hide", true);
    classWork(pop, "show");

    setTimeout(toUnpop, 12000);
}

function toUnpop() {
    pop.innerText = '';
    pop.style.backgroundColor = "#555";
    classWork(pop, "hide");
    classWork(pop, "show", true);
}

upForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!check1()) return;

    classWork(uploadF, 'hide');
    classWork(downloadF, 'hide', true);
    toUnpop();

    var oData = new FormData(upForm);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log('Try again', xhr.readyState, xhr);

            classWork(uploadF, 'hide', true);
            classWork(downloadF, 'hide');

            fInfo.innerText = xhr.responseText;
            classWork(fInput, 'wrong');

            return;
        }

        downloadB.innerText = 'Get results';
        downloadB.disabled = false;

        var res = JSON.parse(xhr.responseText);
        paths = res.fPaths;
        sizes = res.fSizes;
        persentsWork(sizes);
    };

    xhr.send(oData);
});

downloadB.addEventListener('click', function() {
    classWork(downloadF, 'hide');
    classWork(send, 'hide', true);
});

eForm.addEventListener('submit', function(e) {
    console.log('eForm submitting');
    e.preventDefault();

    if (!check2()) return;

    var j = document.getElementById('hidJSON');

    j.value = JSON.stringify(paths);

    var eData = new FormData(eForm);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/download", true);

    toPop('Sending email...');
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log('Try again', xhr.readyState, xhr);

            if (xhr.status == 400) {
                classWork(send, 'hide', true);
                classWork(uploadF, 'hide');

                eInfo.innerHTML = xhr.responseText;
                classWork(eInput, 'wrong');
            }

            if (xhr.status == 500) {
                resetForms();
                toPop(xhr.responseText, true);

                return;
            }

            return;
        }

        toUnpop();
        setTimeout(() => {
            toPop(xhr.responseText);
        }, 0);

        var res = xhr.responseText;
        console.log(res);
    };

    classWork(send, 'hide');
    classWork(uploadF, 'hide', true);
    resetForms();

    xhr.send(eData);
});

function classWork(elem, clss, remove = false) {
    var exp = new RegExp(`${clss}`);
    if (remove) {
        elem.className = elem.className.replace(exp, '');
        return;
    }
    if (elem.className.match(exp)) {
        return;
    }
    elem.className += ` ${clss}`;
    elem.className = elem.className.replace(/  /g, ' ');
}

function check1() {
    console.log('Checking form 1...');

    if ('files' in fInput) {
        if (fInput.files.length === 0 || fInput.files.length > 3) {
            fInfo.innerText = "Select from 1 to 3 files.";
            classWork(fInput, 'wrong');
            return false;
        } else {
            for (let file of fInput.files) {
                if (!file.name) {
                    fInfo.innerText = 'At least one file is not named!';
                    classWork(fInput, 'wrong');
                    return false;
                }
                txt = file.name;
                if (!file.size) {
                    fInfo.innerText = file.name + ': is empty!';
                    classWork(fInput, 'wrong');
                    return false;
                }
                if (file.type != 'image/png' && file.type != 'image/jpeg') {
                    fInfo.innerText = file.name + ': wrong format! ' + file.type;
                    classWork(fInput, 'wrong');
                    return false;
                }
            }
        }
    }

    return true;
}

function check2() {
    console.log('Checking form 2...');

    console.log(eInput.value);

    if (eInput.value == '') {
        eInfo.innerHTML = 'Insert your email!';
        classWork(eInput, 'wrong');
        return false;
    }
    if (!(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(eInput.value))) {
        eInfo.innerHTML = 'Incorrect email!';
        classWork(eInput, 'wrong');
        return false;
    }
    return true;
}

function persentsWork(sObj) {
    var findPersent = (oP, nP) => (100 - (nP / oP * 100)).toFixed(2);

    var i = 0,
        oSum = 0,
        nSum = 0,
        row, cell1, cell2, cell3, cell4;

    for (let key in sObj) {
        row = table.insertRow(i++);

        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);

        cell1.innerHTML = key;
        cell2.innerHTML = sObj[key].oSize + 'B';
        cell3.innerHTML = sObj[key].nSize + 'B';
        cell4.innerHTML = '- ' + findPersent(sObj[key].oSize, sObj[key].nSize) + '%';

        oSum += sObj[key].oSize;
        nSum += sObj[key].nSize;
    }

    row = table.insertRow(i);
    row.id = 'perSum';

    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);

    cell1.innerHTML = 'Total';
    cell2.innerHTML = oSum + 'B';
    cell3.innerHTML = nSum + 'B';
    cell4.innerHTML = '- ' + findPersent(oSum, nSum) + '%';

    var header = table.createTHead();

    row = header.insertRow(0);

    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);

    cell1.innerHTML = 'FIle name';
    cell2.innerHTML = 'Original size';
    cell3.innerHTML = 'Optimized size';
    cell4.innerHTML = 'Optimized %';
}

function resetForms() {
    upForm.reset();
    eForm.reset();

    table.innerHTML = '';

    downloadB.innerText = 'Loading...';
    downloadB.disabled = true;

    classWork(fInput, 'wrong', true);
    fInfo.innerText = '';
    classWork(eInput, 'wrong', true);
    eInfo.innerText = '';
}