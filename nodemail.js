const nodemailer = require('nodemailer')

const trasporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,   // true for 465, false for other ports
    auth: {
        user: 'kontrol.vesa@bk.ru',
        pass: 'Creak031016'
    }
})

const mailer = message => {
    trasporter.sendMail(message, (err, info) => {
        if (err) return console.log(err)
        console.log(info)
    })
}

module.exports = mailer