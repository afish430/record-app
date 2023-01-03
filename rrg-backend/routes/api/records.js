const express = require('express');
const router = express.Router();

const Record = require('../../models/Record');

// @route GET api/records
// @description Get all records
// @access Public
router.get('/', (req, res) => {
    let userId = req.query.userId;
    Record.find({userId: userId})
        .then(records => res.json(records))
        .catch(err => 
            res.status(404).json({ error: 'No records found' })
        );
});

// @route GET api/records/:id
// @description Get single record by id
// @access Public
router.get('/:id', (req, res) => {
    Record.findById(req.params.id)
        .then(record => res.json(record))
        .catch(err => 
            res.status(404).json({ error: 'No record found' })
        );
});

// @route POST api/records
// @description add/save record
// @access Public
router.post('/', (req, res) => {

    // Record.updateMany({}, {$set:{"userId": "63b09828d6c1868ba5a531c7"}}).then(record => {
    //     console.log("updated records!");
    // })
    // .catch(err => 
    //     console.log(err)
    // );
    
    Record.create(req.body)
        .then(record => res.json(record))
        .catch(err => 
            res.status(400).json({ error: 'Unable to add this record' })
        );
});

// @route PUT api/records/:id
// @description Update record
// @access Public
router.put('/:id', (req, res) => {
    Record.findByIdAndUpdate(req.params.id, req.body)
        .then(record => res.json(record))
        .catch(err =>
            res.status(400).json({ error: 'Unable to update this record' })
        );
});

// @route DELETE api/records/:id
// @description Delete record by id
// @access Public
router.delete('/:id', (req, res) => {
    Record.findByIdAndRemove(req.params.id, req.body)
        .then(record => res.json({ mgs: 'Record deleted successfully' }))
        .catch(err => 
            res.status(404).json({ error: 'No such a record' })
        );
});

module.exports = router;