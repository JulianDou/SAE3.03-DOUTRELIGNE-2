import { Candidats } from "./data-candidats.js";

let data = await fetch("./src/data/json/lycees.json");
data = await data.json();

let Lycees = {}

// La fonction getAll rajoute une propriété candidats à chaque lycée
// concerné. Ceux qui n'ont pas de candidats n'ont pas cette propriété.
Lycees.getAll = function(){  
    let candidats = Candidats.getAll();

    for (let cand of candidats){

        let UAI;
        for (let annee of cand.Scolarite){
            if (annee.UAIEtablissementorigine){
                UAI = annee.UAIEtablissementorigine;
                break;
            }
        }

        let lycee = data.find(lycee => lycee.numero_uai == UAI);
        if (lycee){
            if (!lycee.candidats){
                lycee.candidats = [];
            }
            lycee.candidats.push(cand);
        }
    }

    return data;
}

export { Lycees };