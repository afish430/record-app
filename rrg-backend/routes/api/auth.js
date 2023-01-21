const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const bcrypt = require('bcrypt');

// @route POST api/auth/signup
// @description create a new user account
// @access Public
router.post('/signup', (req, res) => {
    console.log('Creating new user...');
    let { userName, email, password, password2, isAdmin } = req.body;
    
    User.findOne({userName: userName})
    .then(user => {
        if (user) {
            return res.status(422).json({ error: 'UserName already exists'});
        }
        else if (password !== password2) {
            return res.status(422).json({ error:'Passwords do not match'});
        }
        else if (password.length < 8) {
            return res.status(422).json({ error: 'Password must be at least 8 characters'});
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
                    console.log('User created!');
                })
                .catch(err => {
                    res.status(500).json({error: 'An error occurred on the server'});
                    });
                });
            });
        }
    });
});

// @route POST api/auth/login
// @description logs a user in
// @access Public
router.post('/login', (req, res) => {
    console.log('Logging in user...');
    let { userName, password } = req.body;

    User.findOne({userName: userName})
    .then(user => {
        if (!user) {
            console.log('User not found...');
            return res.status(400).json({error: 'Incorrect user name or password'});
        }
        else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    console.log('Passwords do not match...');
                    return res.status(400).json({ error: 'Incorrect user name or password'});
                }
                console.log('Login successful!');
                return res.status(200).json({
                    success: true,
                    result: user
                });
            });
        }
    }).catch(err => {
        console.log('An error occurred on the server');
        res.status(500).json({ error: err });
    });
});

module.exports = router;