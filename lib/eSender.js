var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'flashmob986@gmail.com',
        pass: '********'
    }
});

var mailOptions = {
    from: 'imopssender@mail.ru',
    to: 'flashqwerty@mail.ru',
    subject: 'Imops',
    text: "Thank you for using Imops",
    attachments: [{
        filename: 'Imops.zip',
        path: __dirname + '/../uploads/zips/Imops_0.zip'
    }]
};

exports.sendE = function(options, clb) {
    console.log('\n***Sending email***');
    for (let key in mailOptions) {
        options[key] = options[key] || mailOptions[key];
    }
    console.log(options);

    transporter.sendMail(options, clb);
};