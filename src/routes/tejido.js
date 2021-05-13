const express = require ('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('tejido/addt')
});

router.post('/add', isLoggedIn, async(req, res) =>{
    const {tipo, numero, lana, prenda, punto, imagen} = req.body;
    const newTejido = {
        tipo,
        numero,
        lana,
        prenda,
        punto,
        imagen,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO tejido SET ?', [newTejido]);
    req.flash('success', 'Datos Guardados');
    res.redirect('/tejido/');
});

router.get('/', isLoggedIn, async(req, res)=>{
    const tejidos = await pool.query('SELECT * FROM tejido WHERE user_id = ?', [req.user.id]);
    res.render('tejido/listt', {tejidos});
    
});

router.get('/delete/:id', isLoggedIn, async (req,res)=>{
    const{id} =req.params;
    await pool.query('DELETE FROM tejido WHERE id = ?', [id]);
    req.flash('danger', 'Datos Borrados')
    res.redirect('/tejido/');
});

router.get('/edit/:id', isLoggedIn, async (req,res) => {
    const {id} = req.params;
    const tejidos = await pool.query('SELECT * FROM tejido WHERE ID = ?', [id]);
    res.render('tejido/editt', { tejido:tejidos[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const {id} = req.params;
    const {tipo, numero, lana, prenda, punto, imagen} = req.body;
    const newTejido = {
        tipo,
        numero,
        lana,
        prenda,
        punto,
        imagen
    };
    await pool.query('UPDATE tejido SET ? WHERE id = ?', [newTejido, id]);
    req.flash('info', 'Datos Editados')
    res.redirect('/tejido');
});

module.exports = router;