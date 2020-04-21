const express = require('express');
const Task = require('../models/task')
const router = new express.Router();
const auth = require('../middleware/auth')

//Get /task?completed=true
// get /task?limit=10&skip
//Get /task?sortBy=createdAt:asc
router.get('/tasks', auth,async (req, res) => {
      const match ={}
      const sort={}
      if(req.query.completed){
        match.completed =  req.query.completed ==='true'
      }
    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1]==="desc" ? -1 : 1
    }
    try {
        await req.user.populate({
            path:'task',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //const task = await Task.find({})
        res.send(req.user.task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
       const task = await Task.findOne({_id,owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/tasks',auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(e)
    }
})
router.patch('/tasks/:id', auth,async (req, res) => {
    const update = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed'];
    const isValid = update.every((update) => allowedUpdate.includes(update))
    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid Update' })
    }
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        update.forEach((update)=>task[update]= req.body[update])
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
       // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task) {
            return res.status(400).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports =router