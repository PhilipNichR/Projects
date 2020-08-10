//luoTietokanta.js
'use strict';

const Tietokanta=require('./tietokanta.js');

let luontilausetiedosto='./luontilauseet.json'; //oletus

if(process.argv.length>2) {
    luontilausetiedosto=`./${process.argv[2]}`;
}

try{
    luoKanta(require(luontilausetiedosto));
}
catch(virhe) {
    console.log(`Virhe: ${virhe.message}`);
}

async function luoKanta(luontilauseet) {
    //console.log(luontilauseet);
    const optiot={
        host: luontilauseet.palvelin,
        port: luontilauseet.portti,
        user: luontilauseet.paakayttaja,
        password: luontilauseet.paakayttajanSalasana
    };
    const DEBUG=luontilauseet.debugKaytossa;
    const db=new Tietokanta(optiot);
                                      // 'saku'@'localhost'
    const kayttaja=`'${luontilauseet.kayttaja}'@'${luontilauseet.palvelin}'`;

    const dropDatabaseSql=`drop database if exists ${luontilauseet.tietokanta}`;
    const createDatabaseSql=`create database ${luontilauseet.tietokanta}`;
    const dropUserSql=`drop user if exists ${kayttaja}`;
    const createUserSql=`create user if not exists ${kayttaja} `+
                        `identified by '${luontilauseet.kayttajanSalasana}'`;
    const grantPrivilegesSql=
        `grant all privileges on ${luontilauseet.tietokanta}.* to ${kayttaja}`;

    try{
        await db.suoritaKysely(dropDatabaseSql);
        if(DEBUG) console.log(dropDatabaseSql);
        await db.suoritaKysely(createDatabaseSql);
        if(DEBUG) console.log(createDatabaseSql);
        if(luontilauseet.poistaKayttaja) {
            await db.suoritaKysely(dropUserSql);
            if(DEBUG) console.log(dropUserSql);
        }
        await db.suoritaKysely(createUserSql);
        if(DEBUG) console.log(createUserSql);
        await db.suoritaKysely(grantPrivilegesSql);
        if(DEBUG) console.log(grantPrivilegesSql);
        
        for(let taulu of luontilauseet.taulut) {
            if(taulu.sarakkeet.length>0) {  //lisättiin
                const createTableSql=
                `create table ${luontilauseet.tietokanta}.${taulu.taulunNimi}(
                    ${taulu.sarakkeet.join(',\n\t')}
                )`;

                await db.suoritaKysely(createTableSql);
                if(DEBUG) console.log(createTableSql);

                if(taulu.tiedot.length>0) {
                    const rivit = [];
                    for (let tieto of taulu.tiedot) {
                        const insertRowSql =
                            `insert into ${luontilauseet.tietokanta}.${taulu.taulunNimi} ` +
                            `values(${Array(tieto.length).fill('?').join(',')})`;
                        rivit.push(db.suoritaKysely(insertRowSql, tieto));
                    }
                    await Promise.all(rivit);
                    if (DEBUG) console.log('tiedot lisätty');
                }
                else {
                    if(DEBUG) console.log('Lisättäviä tietoja ei ollut!');
                } 
            }
            else {
                if(DEBUG) console.log('Taulun sarakkeet puuttuivat.Taulua ei tehty');
            }
        }

    }
    catch(virhe){
        console.log(virhe.message);
    }
}
