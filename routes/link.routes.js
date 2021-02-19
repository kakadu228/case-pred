const {Router} = require('express')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const router = Router()
const moment = require('moment')

const dat = moment().format('L')
router.post('/generate', [
    check('fut', 'Введите число').isFloat()
], auth, async (req, res) =>{
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return (res.status(400).json({
                errors: errors.array(),
                message: 'Введите число'
            }))
        }

        const {date, fut} = req.body
       
        const exit = await Link.findOne({date: date, owner: req.user.userId})
        
        if (exit){
            return res.json({
                message: 'Вы уже вводили сегодня данные'
            })
        }
        const link = new Link({
            fut, date, owner: req.user.userId
        })
        
        await link.save()
        res.status(201).json({message:'Добавлено'})
    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})

router.get('/links/:id', auth, async(req,res) => {
    const link = await Link.find({date: req.params.id.replace(/[\.\/]/g,'/'), owner: req.user.userId})
    if (link){
        await Link.deleteOne({date: req.params.id.replace(/[\.\/]/g,'/')})
    }
    res.json({message: 'Удалено'})

})

router.get('/', auth, async(req,res) => {
    try {
        const links = await Link.find( {owner: req.user.userId} ) //????
        res.json(links)
    } catch(e){
        res.status(500).json({ message: 'Сломался :(' })
    }
})

router.get('/del', auth, async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId})
        res.json(links)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router