const express = require ('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/inicio',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/login', isNotLoggedIn, (req, res) =>{
    res.render('auth/login');
});

router.post('/login', isNotLoggedIn, (req, res, next) =>{
    passport.authenticate('local-login',{
        successRedirect: '/inicio',
        failureRedirect: '/login',
        failureFlash:true
    })(req, res, next);
});

router.get('/inicio', isLoggedIn, (req, res) =>{
    res.render('inicio');
});

router.get('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/')
})

module.exports = router;