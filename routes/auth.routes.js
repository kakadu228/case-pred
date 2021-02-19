const auth = require('../middleware/auth.middleware')
const {Router} = require('express')
const cript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Link = require('../models/Link')
// const jwt = require('jsonwebtoken')
const router = Router()
const mailer = require('../nodemail')
const Cryptr = require("cryptr")

const cryptr = new Cryptr('myTotalySecretKey')


function makeid() {
    var text = "";
    var possible = "0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


router.post(
    '/reg',
    [
        check('email', 'Некорректный email').isEmail().isLength({max:256}),
        check('password', 'Минимальное длина пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return (res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            }))
        }


        const {email, password, password_2, flag} = req.body

        const hashPass = await cript.hash(password, 12)

        const code_unt = makeid()

        const activ = false


        if (password !== password_2){
            return res.status(400).json({message: 'Подтвердите пароль'})
        }

        const candidate = await User.findOne({ email })

        if (candidate) {
            return res.status(400).json({message: 'Пользователь уже существует'})
        }

        const candidate_2 = await User.findOne({ password: hashPass })


        if (candidate_2){
            return res.status(400).json({message: 'Пароль такой уже существует'})
        }


        const user = new User({email, flag, activ, code_unt, password: hashPass})

        await user.save()

        const message_email = {
            from: 'DSM-11 <kontrol.vesa@bk.ru>',
            to: user.email,
            subject: "Поздравляем с регистрацией в веб-приложении Контроль веса от команды DSM-11!",
            html: `<p>Поздравляем с регистрацией в веб-приложении Контроль веса от комаднды DSM-11<br>Ваш код подтверждения: <h1>${code_unt}</h1></p>`
        
        }

        mailer(message_email)


        res.status(201).json({message: 'Подтвердите почту', code_unt})

    } catch(e){

        res.status(500).json({ message: 'Сломался :(' })
        
    }
})

router.post('/generate_code',auth, async (req, res) => {
    try {

        const chec = makeid()

        const user = await User.findById({_id: req.user.userId})

        const message_email = {
            from: 'DSM-11 <kontrol.vesa@bk.ru>',
            to: user.email,
            subject: "Поздравляем с регистрацией в веб-приложении Контроль веса от команды DSM-11!",
            html: `<p>Поздравляем с регистрацией в веб-приложении Контроль веса от комаднды DSM-11<br>Ваш код подтверждения: <h1>${chec}</h1></p>`
        
        }

        mailer(message_email)

        User.findByIdAndUpdate(user, { $set: {code_unt: chec}},
            function(err, doc){
                doc.code_unt = 'chec'
            })

        res.status(201).json({chec})


    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})

router.post('/generate_code_2', async (req, res) => {
    try {

        const chec = makeid()

        const {email} = req.body

        const user = await User.findOne({email: email})


        const message_email = {
            from: 'DSM-11 <kontrol.vesa@bk.ru>',
            to: user.email,
            subject: "Смена пароля",
            html: `<p>Ваш код подтверждения: <h1>${chec}</h1></p>`
        }

        mailer(message_email)

        User.findByIdAndUpdate(user, { $set: {code_unt: chec}},
            function(err, doc){
                doc.code_unt = 'chec'
            })

        res.status(201).json({message:'Отправлено', chec})


    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})



router.get('/flg', auth, async (req, res) => {
    try {
        const user = await User.findById({_id: req.user.userId})
        res.json(user.flag)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get('/info', auth, async (req, res) => {
    try {
        const user = await User.findById({_id: req.user.userId})
        res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/check_1', auth, async (req, res) => {
    try {
        const {coden} =req.body
        const user = await User.findById({_id: req.user.userId})
        if (user.code_unt === coden){
            User.findByIdAndUpdate(user, { $set: {activ: true}},
                function(err, doc){
                    doc.code_unt = 'chec'
                })
        }else{
            res.status(500).json({message: 'Неверный код'})
        }
        
        res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/reply',
[
    check('pass_1', 'Минимальное длина пароля 6 символов').isLength({min: 6}),
    check('pass_2', 'Минимальное длина пароля 6 символов').isLength({min: 6})
],
async (req, res) => {
    try {
        const {email, pass_1, pass_2} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return (res.status(400).json({
                errors: errors.array(),
                message: 'Длина пароля должна быть не меньше 6 символов'
            }))
        }

        const email_2 = cryptr.decrypt(email)
        const user = await User.findOne({email: email_2})

        const token = jwt.sign(
            { userId: user.id },
            config.get('secret'),
            {expiresIn: '24h'}
            )


        if (pass_1 === pass_2){
            const hashPass = await cript.hash(pass_1, 12)
            User.findByIdAndUpdate(user, { $set: {password: hashPass}},
                function(err, doc){
                    doc.password = 'hashPass'
                })
        }else{
            res.status(500).json({message: 'Пароли не совпадают'})
        }
        
        res.json({message: 'Пароль успешно восстановлен', token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/check_2', async (req, res) => {
    try {
        const {coden, email} =req.body
        
        const users = await User.findOne({email: email})
        if (users.code_unt === coden){
            const hashEmail = cryptr.encrypt(users.email);
           res.status(201).json({message:'Смена пароля', hashEmail})
        }else{
            res.json({message: 'Неверный код'})
        }
        
        // res.json(user)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').isEmail().isLength({max:256}),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})
        

        if (!user){
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        const isMatch = await cript.compare(password, user.password)

        if (!isMatch){
            return res.status(400).json({message: 'Неверный логин или пароль'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('secret'),
            {expiresIn: '24h'}
        )

        res.json({ token, userId: user.id })

    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})

router.post(
    '/rest',
    [
        check('email', 'Введите корректный email').isEmail().isLength({max:256})
    ],
    async (req, res) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email} = req.body

        const user = await User.findOne({email})
        

        if (!user){
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        // const isMatch = await cript.compare(password, user.password)

        // if (!isMatch){
        //     return res.status(400).json({message: 'Неверный логин или пароль'})
        // }

        const chec = makeid()

        User.findByIdAndUpdate(user, { $set: {code_unt: chec}},
            function(err, doc){
                doc.code_unt = 'chec'
            })

        const message_email = {
            from: 'DSM-11 <kontrol.vesa@bk.ru>',
            to: user.email,
            subject: "Смена пароля",
            html: `<p>Ваш код подтверждения: <h1>${chec}</h1></p>`
        
        }
        mailer(message_email)

        // const token = jwt.sign(
        //     { userId: user.id },
        //     config.get('secret'),
        //     {expiresIn: '900000'}
        // )

        res.json({ user, message:'Подтвердите' })

    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})




module.exports = router