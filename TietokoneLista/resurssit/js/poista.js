'use strict';
(function(){

    let viestialue;
    let syote;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        viestialue = document.getElementById('viestialue');
        tietokoneid = document.getElementById('tietokoneid');
        
        document.getElementById('laheta').addEventListener('click', laheta);
    }

    async function laheta(){
        const id = tietokoneid.value;
        try{
            const optiot = {
                method: 'POST',
                body: JSON.stringify({tunniste:id}),
                headers: {
                    'Content-Type':'application/json'
                }
            };

            const data = await fetch('/poista', optiot);
            const tulos = await data.json();
            if(tulos.viesti) {
                viestialue.textContent = tulos.viesti;
            }
        }
        catch(virhe){
            console.log(virhe.message);
        }
    }

})();