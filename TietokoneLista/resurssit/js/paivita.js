//paivita.js
'use strict';

(function (){
    let tietokoneIdkentta;
    let nimikentta;
    let tyyppikentta;
    let suoritinkentta;
    let lukumaarakentta;
    let viestialue;

    let hakutila = true;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta() {
        tietokoneIdkentta= document.getElementById('tietokoneid');
        nimikentta = document.getElementById('nimi');
        tyyppikentta = document.getElementById('tyyppi');
        suoritinkentta = document.getElementById('suoritin');
        lukumaarakentta = document.getElementById('lukumaara');

        viestialue = document.getElementById('viestialue');

        vaihdaLukutila(hakutila);

        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta() {
       viestialue.textContent='';
       try{
           if(hakutila) {
               const tunniste = tietokoneIdkentta.value;
               const optiot = {
                   method: 'POST',
                   body: JSON.stringify({tunniste:tunniste}),
                   headers:{'Content-Type':'application/json'}
               };
               const data = await fetch('/yksi', optiot);
               const tulos=await data.json();
               if(tulos.viesti) {
                   viestialue.textContent= tulos.viesti;
               }
               else {
                   paivitaKentat(tulos);
               }
           }
           else {
                //hakutila oli false eli päivitetään
                const tunniste = tietokoneIdkentta.value;
                const nimi = nimikentta.value;
                const tyyppi = tyyppikentta.value;
                const suoritin = suoritinkentta.value;
                const lukumaara = lukumaarakentta.value;

                const optiot = {
                    method: 'POST',
                    body: JSON.stringify({
                        tunniste,
                        nimi,
                        tyyppi,
                        suoritin,
                        lukumaara
                    }),
                    headers: {'Content-Type':'application/json'}
                };
                const data = await fetch('/paivita', optiot);
                const tulos = await data.json();
                if(tulos.viesti) {
                    viestialue.textContent = tulos.viesti;
                }
                hakutila = true;
                vaihdaLukutila(hakutila);
           }
       }
       catch(virhe) {
           console.log(virhe.message);
       }
        
    }

    function vaihdaLukutila(tila) {
        if(tila) {
            tietokoneIdkentta.removeAttribute('readonly');
            nimikentta.setAttribute('readonly', true);
            tyyppikentta.setAttribute('readonly',true);
            suoritinkentta.setAttribute('readonly',true);
            lukumaarakentta.setAttribute('readonly', true);
        }
        else {
            tietokoneIdkentta.setAttribute('readonly', true);
            nimikentta.removeAttribute('readonly');
            tyyppikentta.removeAttribute('readonly');
            suoritinkentta.removeAttribute('readonly');
            lukumaarakentta.removeAttribute('readonly');
        }
    }

    function paivitaKentat(tietokone) {
        tietokoneIdkentta.value = tietokone.tunniste;
        nimikentta.value = tietokone.nimi;
        tyyppikentta.value = tietokone.tyyppi;
        suoritinkentta.value = tietokone.suoritin;
        lukumaarakentta.value = tietokone.lukumaara;
        hakutila=false;
        vaihdaLukutila(hakutila);
    }
})();