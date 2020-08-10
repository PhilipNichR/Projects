//henkilostokanta.js
'use strict';

const Tietokanta = require('./tietokanta.js');

const ohjelmavirhe = () => new Error('Ohjelmavirhe');

const tietokoneenTiedot = tietokone => [
    tietokone.tunniste, tietokone.nimi, tietokone.tyyppi,
    tietokone.suoritin, tietokone.lukumaara
];

const tietokoneenTiedotpaivitykseen = tietokone => [
    tietokone.nimi, tietokone.tyyppi,
    tietokone.suoritin, tietokone.lukumaara,  tietokone.tunniste
];

//Sql-lauseet
const haeKaikkiTietokoneet='select tunniste, nimi, tyyppi, suoritin, lukumaara from tietokone';
const haeTietokone=
  'select tunniste, nimi, tyyppi, suoritin, lukumaara from tietokone where tunniste=?';
const lisaaTietokone=
  'insert into tietokone(tunniste, nimi, tyyppi, suoritin, lukumaara) values(?,?,?,?,?)';
const poistaTietokone='delete from tietokone where tunniste=?';
const paivitaTietokone=
  'update tietokone set nimi=?, tyyppi=?, suoritin=?, lukumaara=? where tunniste=?';

//tietokoneet-luokka
module.exports = class tietokonekanta{

    constructor(optiot) {
        this.varasto=new Tietokanta(optiot);
    }

    //metodit
    //palauttaa lupauksen
    haeKaikki() {
        return new Promise(async (resolve, reject) => {
            try{
                const tulos = await this.varasto.suoritaKysely(haeKaikkiTietokoneet);
                if(tulos.tulosjoukko) {
                    resolve(tulos.kyselynTulos);
                }
                else {
                    reject(ohjelmavirhe());
                }
            }
            catch(virhe) {
                console.log(virhe);
                reject(ohjelmavirhe());
            }
        });
    }

    //palauttaa lupauksen
    hae(tunniste) {
        return new Promise(async (resolve,reject)=>{
            try{
                const tulos= await this.varasto.suoritaKysely(haeTietokone,[+tunniste]);
                if(tulos.tulosjoukko){
                    if(tulos.kyselynTulos.length>0) {
                        resolve(tulos.kyselynTulos[0]);
                    }
                    else {
                        resolve({ viesti:`Tunnisteella ${tunniste} ei löytynyt tietokonetta`});
                    }
                }
                else {
                    reject(ohjelmavirhe());
                }
            }
            catch(virhe){
                console.log(virhe);
                reject(ohjelmavirhe());
            }
        });
    }
    
    //palauttaa lupauksen
    lisaa(tietokone) {
        return new Promise(async (resolve,reject)=>{
            try{
                const hakutulos= 
                    await this.varasto.suoritaKysely(haeTietokone,[tietokone.tunniste]);
                if(hakutulos.kyselynTulos.length===0) {
                    const tulos= await this.varasto.suoritaKysely(lisaaTietokone,
                        tietokoneenTiedot(tietokone));
                    if(tulos.kyselynTulos.muutetutRivitLkm === 1){
                        resolve({ viesti: `Tietokone tunnisteella ${tietokone.tunniste} lisättiin`});
                    }
                    else {
                        resolve({ viesti:'Tietokonetta ei lisätty'});
                    }
                }
                else {
                    resolve({ viesti: `tietokoneen tunniste ${tietokone.tunniste} oli jo käytössä`});
                }
            }
            catch(virhe) {
                console.log(virhe);
                reject(ohjelmavirhe());
            }
        });
    }

    //palauttaa lupauksen
    poista(tunniste) {
        return new Promise(async (resolve,reject)=>{
            try{
                const tulos= await this.varasto.suoritaKysely(poistaTietokone,
                                                              [+tunniste]);
                if(tulos.kyselynTulos.muutetutRivitLkm===0){
                    resolve({ viesti: 'Antamallasi tunnisteella ei löytynyt '+
                                      'tietokonetta. Mitään ei poistettu'});
                }
                else {
                    resolve({ viesti: `Tietokone tunnisteella ${tunniste} poistettiin`})
                }                                             
            }
            catch(virhe) {
                reject(ohjelmavirhe())
            }
        });
    }

    //palauttaa lupauksen
    paivita(tietokone) {
        return new Promise(async (resolve, reject)=>{
            try{
                console.log('heihei');
                const tulos= await this.varasto.suoritaKysely(paivitaTietokone,
                    tietokoneenTiedotpaivitykseen(tietokone));
                    console.log(tulos);
                if(tulos.kyselynTulos.muutetutRivitLkm === 0) {
                    resolve({ viesti:'Tietoja ei päivitetty'});
                }
                else {
                    resolve({ viesti: `Tietokoneen ${tietokone.tunniste} tiedot päivitettiin`});
                }
            }
            catch(virhe) {
                reject(ohjelmavirhe());
            }
        });
    }

}