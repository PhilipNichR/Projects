'use strict';
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST ||'localhost';

const Tietovarasto = require('./tietokonekanta');

const optiot = {
    host:'localhost',
    port: 3306,
    user:'meeri',
    password:'j7rXpXkK',
    database:'tietokonetietokanta'
};

const tietokonekanta = new Tietovarasto(optiot);

const palvelin = http.createServer(app);

const valikkopolku = path.join(__dirname, 'sivut','valikko.html');
const kaikkipolku = path.join(__dirname, 'sivut','haeKaikki.html');
const yksipolku = path.join(__dirname, 'sivut','haku.html');
const lisaapolku = path.join(__dirname, 'sivut','lisaaUusi.html');
const poistopolku = path.join(__dirname, 'sivut','poista.html');
const paivitapolku = path.join(__dirname, 'sivut','paivita.html');

// kaikki tiedostot ja kansiot resurssit-kansiot alla "julkisia"
// näkyy selaimelle
app.use(express.static(path.join(__dirname,'resurssit')));

app.get('/', (req,res)=>res.sendFile(valikkopolku));
app.get('/haeKaikki', (req,res)=>res.sendFile(kaikkipolku));
app.get('/haeyksi', (req,res)=>res.sendFile(yksipolku));
app.get('/lisaa', (req,res)=>res.sendFile(lisaapolku))
app.get('/poista', (req,res)=>res.sendFile(poistopolku));
app.get('/paivita', (req,res)=>res.sendFile(paivitapolku));

app.get('/kaikki', async (req,res)=>{
    const tulos = await tietokonekanta.haeKaikki();
    //console.log(tulos);
    res.json(tulos);
});

app.post('/yksi', express.json(), async (req,res)=>{
    try{
        const tunniste = req.body.tunniste;
        const tulos = await tietokonekanta.hae(tunniste);
        res.json(tulos);
    }
    catch(virhe) {
        console.log(virhe);
        res.end();
    }
});

app.post('/poista', express.json(), async(req,res)=>{
    try{
        const tunniste = req.body.tunniste;
        const tulos = await tietokonekanta.poista(tunniste);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
})

app.post('/lisaa', express.json(), async (req,res)=>{
    try{
        const tietokone = req.body;
        const tulos = await tietokonekanta.lisaa(tietokone);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
})

app.post('/paivita', express.json(), async (req,res)=>{
    try{
        const tietokone = req.body;
        const tulos = await tietokonekanta.paivita(tietokone);
        res.json(tulos);
    }
    catch(virhe){
        console.log(virhe.message);
        res.end();
    }
})


palvelin.listen(port, host, ()=> console.log(`Palvelin ${host} portissa ${port}.`));