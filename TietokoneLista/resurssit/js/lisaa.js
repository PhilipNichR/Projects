'use script';
        (function(){
            let tietokoneIdkentta;
            let nimikentta;
            let tyyppikentta;
            let suoritinkentta;
            let lukumaarakentta;
            let viestialue;

            document.addEventListener('DOMContentLoaded', alusta);

            function alusta() {
                tietokoneIdkentta = document.getElementById('tietokoneid');
                nimikentta = document.getElementById('nimi');
                tyyppikentta = document.getElementById('tyyppi');
                suoritinkentta = document.getElementById('suoritin');
                lukumaarakentta = document.getElementById('lukumaara');

                viestialue = document.getElementById('viestialue');
                document.getElementById('laheta').addEventListener('click',laheta);
            }

            async function laheta() {
                const tunniste = tietokoneIdkentta.value;
                const nimi = nimikentta.value;
                const tyyppi = tyyppikentta.value;
                const suoritin = suoritinkentta.value;
                const lukumaara = lukumaarakentta.value;
                try{
                    const optiot = {
                        method: 'POST',
                        body: JSON.stringify({
                            tunniste,
                            nimi,
                            tyyppi,
                            suoritin,
                            lukumaara
                        }),
                        headers:{
                            'Content-Type':'application/json'
                        }
                    };
                    const data = await fetch('/lisaa', optiot);
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