const express = require ('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) =>{
    res.render('corte/addc')
});

router.post('/add', isLoggedIn, async(req, res) =>{
    const {prenda, materiales, imagen} = req.body;
    const newCorte = {
        prenda,
        materiales,
        imagen,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO corte SET ?', [newCorte]);
    req.flash('success', 'Datos Guardados');
    res.redirect('/corte/');
});

router.get('/', isLoggedIn, async(req, res)=>{
    const cortes = await pool.query('SELECT * FROM corte WHERE user_id = ?', [req.user.id]);
    res.render('corte/listc', {cortes});
});

router.get('/delete/:id', isLoggedIn, async (req,res)=>{
    const{id} =req.params;
    await pool.query('DELETE FROM corte WHERE id = ?', [id]);
    req.flash('danger', 'Datos Borrados')
    res.redirect('/corte/');
});

router.get('/edit/:id', isLoggedIn, async (req, res)=>{
    const{id}= req.params;
    const cortes = await pool.query('SELECT * FROM corte WHERE id = ?', [id]);
    res.render('corte/editc', {corte:cortes[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    const {id} = req.params;
    const {prenda, materiales, imagen} = req.body;
    const newCorte = {
        prenda,
        materiales,
        imagen
    };
    await pool.query('UPDATE corte SET ? WHERE id = ?', [newCorte, id]);
    req.flash('info', 'Datos Editados')
    res.redirect('/corte');
});

module.exports = router;