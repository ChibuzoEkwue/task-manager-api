const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const multer = require('multer');
const sharp = require('sharp')
const { sendWelcome, exitMail} = require('../email/account')
const uploads = multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(! file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload pictures'))
        }
        cb(undefined,true)
    }
})
const auth = require('../middleware/auth')
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcome(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token =await user.generateAuthToken()

        res.send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth, async (req,res)=>{
    try {
        // the 
        req.user.tokens = req.user.tokens.filter((token)=>{
               return token.token !== req.token
       })
       await req.user.save()
       res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/users/me',auth, async (req, res) => {
          res.send(req.user)
})



router.patch('/users/me',auth, async (req, res) => {
    const update = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age'];
    const isValid = update.every((update) => allowedUpdate.includes(update))
    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid Update' })
    }
    try {
        //const user = await User.findOne(req.user)
        update.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth,async (req, res) => {
    try {
        
        await req.user.remove()
        exitMail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/avatar',auth,uploads.single('avatar'),async(req,res)=>{
   
   const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
   req.user.avatar= buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
   res.status(400).send({
       error:error.message
   })
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
     await req.user.save()
     res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
           throw new Error()
        }

       res.set('Content-Type','image/png')
       res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
module.exports =router