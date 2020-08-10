'use strict';

const Tietovarasto = require('./tietokonekanta');
const lue = require('./syoteKirjasto');

const optiot={
    host:'localhost',
    port:3306,
    user:'meeri',
    password:'j7rXpXkK',
    database:'tietokonetietokanta'
};

const tietokonekanta = new Tietovarasto(optiot);
const valikkoTeksti=`
Valitse
1: hae kaikki tietokoneet
2: hae tietokone
3: lisää tietokone
4: poista tietokone
5: muuta tietokoneen tietoja
6: lopeta

Anna valintasi(1-6): `;

//käynnistetään ohjelma
valikko();

//funktiot
async function valikko(){
    let onLoppu = false;
    do{
        const valinta=await lue(valikkoTeksti);
        switch(+valinta) {
            case 1:
                await haeKaikkiTietokoneet();
                break;
            case 2:
                const tunniste= await lue('Anna tietokoneen tunniste: ');
                await haeTietokone(+tunniste);
                break;
            case 3:
                const  tietokone= await lueTietokone();
                await lisaaTietokone(tietokone);
                break;
            case 4: 
                const poistettavaNumero=await lue('Anna poistettavan tietokoneen tunniste: ');
                await poistaTietokone(+poistettavaNumero);
                break;
            case 5:
                console.log('Anna päivitettävän tietokoneen uudet tiedot: ');
                const muutettuTietokone=await lueTietokone();
                console.log(muutettuTietokone);
                await paivitaTietokone(muutettuTietokone);
                break;
            case 6:
                console.log('Moikka Moikka');
                onLoppu=true;
                break;
            default:
                console.log('Anna vain yksi numero 1-6 väliltä');
        }
    }while(!onLoppu);
} //valikko() -loppu

async function haeKaikkiTietokoneet(){
    console.log(await tietokonekanta.haeKaikki());
}

async function haeTietokone(tunniste){
    console.log(await tietokonekanta.hae(tunniste));
}

async function lisaaTietokone(uusiTietokone){
    console.log(await tietokonekanta.lisaa(uusiTietokone));
}

async function poistaTietokone(tunniste){
    console.log(await tietokonekanta.poista(tunniste));
}

async function paivitaTietokone(tietokone){
    console.log(await tietokonekanta.paivita(tietokone));
}

//henkilo-olion muodostaminen
async function lueTietokone(){
    const tunniste=+await lue('Anna tietokoneen tunniste: ');
    const nimi=await lue('Anna tietokoneen nimi: ');
    const tyyppi=await lue('Anna tietokoneen tyyppi: ');
    const suoritin=await lue('Anna tietokoneen suoritin: ');
    const lukumaara=+await lue('Anaa lukumäärä: ');

    return {
        tunniste,
        nimi,
        tyyppi,
        suoritin,
        lukumaara
    }
}