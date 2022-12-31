const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// @route POST api/auth
// @description create a new user account
// @access Public
router.post('/signup', (req, res) => {
    let { userName, email, password, password2, isAdmin } = req.body;
    
    User.findOne({userName: userName})
    .then(user=>{
        if (user) {
            return res.status(422).json({ errors: [{ user: "userName already exists" }] });
        }
        else if (password !== password2) {
            return res.status(422).json({ errors: [{ user: "passwords do not match" }] });
        }
        else {
            const user = new User({
                userName: userName,
                email: email,
                password: password,
                isAdmin: isAdmin
            });

            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user.save().then(response => {
                        res.status(200).json({
                        success: true,
                        result: response
                    })
                    console.log('user created!');
                })
                .catch(err => {
                    res.status(500).json({errors: [{ error: err }]});
                    });
                });
            });
        }
    });
});

module.exports = router;