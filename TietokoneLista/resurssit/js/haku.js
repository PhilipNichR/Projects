'use strict';

(function(){
    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta() {
        const id=document.getElementById('tietokoneid').value;

        try{
            const optiot={
                method: 'POST',
                body:JSON.stringify({tunniste:id}),
                headers:{
                    'Content-Type':'application/json'
                }
            }

            const data = await fetch('/yksi', optiot);
            const tulos = await data.json();
            paivita(tulos);
        }
        catch{
            console.log(virhe.message);
        }
    }

    function paivita(tietokone) {
        const tulosalue = document.getElementById('tulosalue');
        if(tietokone.viesti){
            tulosalue.textContent = tietokone.viesti;
        }
        else{
            tulosalue.textContent = `
            Tunniste:${tietokone.tunniste}
            Nimi: ${tietokone.nimi}
            Tyyppi:${tietokone.tyyppi}
            Suoritin:${tietokone.suoritin}
            Lukumaara:${tietokone.lukumaara}
            `;
        }
    }
})();
