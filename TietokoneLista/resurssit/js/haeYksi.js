'use strict';

(function(){
    let tietokoneid;
    let tulosalue;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta() {
        tulosalue = document.getElementById('tulosalue');
        tietokoneid = document.getElementById('tietokoneid');


    }

    function paivitaTietokone(){
        if(tietokoneid.viesti) {
            muodostaViesti(tietokone.viesti);
        }
        else{
            muodostaTietokone(tietokone);
        }
    }

    function muodostaViesti(viesti) {
        tulosalue.innerHTML=`<p class="eiloydy">${viesti}</p>`;
    }

    function muodostaTietokone(tietokone) {
        tulosalue.innerHTML=`
            <p><span class="selite">Tunniste:</span> ${tietokone.tunniste}</p>
            <p><span class="selite">Nimi:</span> ${tietokone.nimi}</p>
            <p><span class="selite">Tyyppi:</span> ${tietokone.tyyppi}</p>
            <p><span class="selite">Suoritin:</span> ${tietokone.suoritin}</p>
            <p><span class="selite">lukumaara:</span> ${tietokone.lukumaara}</p>
        `
    }

})();