const express = require('express')
const breads = express.Router()
const Bread = require('../models/bread.js')
const Baker = require('../models/baker.js')
// INDEX
breads.get('/', async (req, res) => {
    const foundBakers = await Baker.find().lean()
    const foundBreads = await Bread.find().limit(25).lean()
    res.render('Index', {
        breads: foundBreads,
        bakers:foundBakers,
        title: 'Index Page'
    })
               
       
})


// CREATE
breads.post('/', (req, res) => {
    if (!req.body.image) {
        req.body.image = undefined
    }
    if (req.body.hasGluten === 'on') {
        req.body.hasGluten = true
    } else {
        req.body.hasGluten = false
    }
    Bread.create(req.body)
    res.redirect('/breads')
})




// NEW
breads.get('/new', (req, res) => {
    Baker.find()
        .then(foundBakers => {
            res.render('new', {
                bakers: foundBakers
            })
        })
})




// EDIT
breads.get('/:indexArray/edit', (req, res) => {
    Baker.find()
        .then(foundBakers => {
            Bread.findById(req.params.indexArray)
                .then(foundBread => {
                    res.render('edit', {
                        bread: foundBread,
                        bakers: foundBakers
                    })
                })
        })
})


// SHOW
breads.get('/:arrayIndex', (req, res) => {
    Bread.findById(req.params.arrayIndex)
        .populate('baker')
        .then(foundBread => {
            const bakedBy = foundBread.getBakedBy()
            console.log(bakedBy)
            res.render('show', {
                bread: foundBread
            })
        })
        .catch(err => {
            res.send('404')
        })
})


// UPDATE
breads.put('/:arrayIndex', (req, res) => {
    if (req.body.hasGluten === 'on') {
        req.body.hasGluten = true
    } else {
        req.body.hasGluten = false
    }

    Bread.findByIdAndUpdate(req.params.arrayIndex, req.body, { new: true })
        .then(updatedBread => {
            console.log(updatedBread)
            res.redirect(`/breads/${req.params.arrayIndex}`)
        })


    //Bread[req.params.arrayIndex] = req.body
    //res.redirect(`/breads/${req.params.arrayIndex}`)
})


// DELETE
breads.delete('/:indexArray', (req, res) => {
    Bread.findByIdAndDelete(req.params.indexArray)
        .then(deletedBread => {
            res.status(303).redirect('/breads')
        })


    //Bread.splice(req.params.indexArray, 1)
    //res.status(303).redirect('/breads')
})



module.exports = breads
