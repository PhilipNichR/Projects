'use strict';

(function(){
    document.addEventListener('DOMContentLoaded',alusta);

    async function alusta(){
        try{
            const data = await fetch('/kaikki');
            const tietokoneet = await data.json();
            const taulukko = document.getElementById('tulostaulukko');
            for(let tietokone of tietokoneet){
                const tr = document.createElement('tr');
                tr.appendChild(doElemente(tietokone.tunniste));
                tr.appendChild(doElemente(tietokone.nimi));
                tr.appendChild(doElemente(tietokone.tyyppi));
                tr.appendChild(doElemente(tietokone.suoritin));
                tr.appendChild(doElemente(tietokone.lukumaara));
                taulukko.appendChild(tr);

            }
        }
            catch(virhe){
                console.log(virhe.message);
            }
    }

    function doElemente(data) {
        const td = document.createElement('td');
        td.textContent = data;
        return td;
    }
})();