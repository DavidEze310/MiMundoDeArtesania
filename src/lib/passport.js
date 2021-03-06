const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require ('./helpers')

passport.use('local-login', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
    const fila = await pool.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
    if(fila.length > 0){
        const user = fila[0];
        const validacion = await helpers.comparador(contraseña, user.contraseña);
        if(validacion){
            done(null, user, req.flash('success', 'Bienvenido ' + user.usuario));
        } else {
            done(null, false, req.flash ( 'danger', 'Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('danger', 'El Usuario No Existe'));
    }
}));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async(req, usuario, contraseña, done) => {
    const { nombre } = req.body;
    const NewUser = {
        usuario,
        contraseña,
        nombre
    };
    NewUser.contraseña = await helpers.encriptado(contraseña); 
    const result = await pool.query('INSERT INTO users SET ?', [NewUser]);
    NewUser.id = result.insertId;
    return done(null, NewUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0])
})