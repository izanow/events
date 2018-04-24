const express = require('express');
const router = express.Router();
const User = require('../models/event-user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/register', function (req, res) {
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User.Users({
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                newUser.password = hash;
                newUser.save(newUser).then(user => console.log(user));
            });
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username).then(user => {
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.dataValues.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.dataValues.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id).then(user => {
        done(null, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        console.log(req.user);
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

module.exports = router;