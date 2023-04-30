const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken")
jwtSecret = process.env.jwtSecret;

// @route POST api/auth/signup
// @description create a new user account
// @access Public
router.post('/signup', (req, res) => {
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
                        console.log('New user created! ' + userName);
                        res.status(200).json({
                        success: true,
                        result: response
                    })
                })
                .catch(err => {
                    console.log('A sign-up error occurred on the server');
                    console.log(err);
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
    console.log("Login request for " + req.body.userName);
    let { userName, password } = req.body;

    User.findOne({userName: userName})
    .then(user => {
        if (!user) {
            return res.status(400).json({error: 'Incorrect user name or password'});
        }
        else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({ error: 'Incorrect user name or password'});
                }
                console.log('Login successful!');
                return res.status(200).json({
                    success: true,
                    result: user,
                    token: jwt.sign({ userName: user.userName, _id: user._id, email: user.email, isAdmin: user.isAdmin, issuedAt: new Date() },
                        jwtSecret,
                        {expiresIn: '1h'}
                    )
                });
            });
        }
    }).catch(err => {
        console.log('A login error occurred on the server');
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.get('/loggedInUser', (req, res) => {
    console.log('Checking if user is logged in...');
    if (!req.headers.token) {
        console.log('No token, returning 401');
        res.status(401).json({ error: 'Not Authorized' });
    }
    jwt.verify(req.headers.token, jwtSecret, function (err, decoded) {
        if (err) {
            console.log('jwt.verify error, returning 401');
            res.status(401).json({ error: 'Not Authorized' });
        } else {
            let newToken = null;
            let expiryTime = new Date(decoded.issuedAt).getTime() + 3600000; // issued time plus 1 hour
            let currentTime = new Date().getTime();
            if (currentTime > expiryTime - 600000) { // if within 10 mins of expiry, send new jwt
                console.log('renewing jwt...');
                newToken = jwt.sign({ userName: decoded.userName, _id: decoded._id, email: decoded.email, isAdmin: decoded.isAdmin, issuedAt: new Date() },
                    jwtSecret,
                    {expiresIn: '1h'}
                );
            }
            console.log('jwt.verify succeeded, returning 200 for user ' + decoded.userName);
            return res.status(200).json({
                success: true,
                user: decoded,
                newToken: newToken
            });
        }
    });
});

module.exports = router;