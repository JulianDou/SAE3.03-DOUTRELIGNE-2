import { Candidats } from "./data-candidats.js";

let data = await fetch("./src/data/json/lycees.json");
data = await data.json();

let Lycees = {}

Lycees.binarySearch = function(UAI){
    let min = 0;
    let max = data.length - 1;

    while (min <= max){
        let mid = Math.floor((min + max) / 2);
        if (data[mid].numero_uai == UAI){
            return data[mid];
        }
        else if (data[mid].numero_uai < UAI){
            min = mid + 1;
        }
        else{
            max = mid - 1;
        }
    }

    return null;
}

// La fonction getAll rajoute une propriété candidats à chaque lycée
// concerné. Ceux qui n'ont pas de candidats n'ont pas cette propriété.
Lycees.getAll = function(){  
    let candidats = Candidats.getAll();

    data.shift();

    let compare = function(a, b){
        if (a.numero_uai < b.numero_uai){
            return -1;
        }
        if (a.numero_uai > b.numero_uai){
            return 1;
        }
    }
    data.sort(compare);

    for (let cand of candidats){

        let UAI;
        let nbAnneesCesure = 0;
        for (let annee of cand.Scolarite){
            if (annee.UAIEtablissementorigine){
                UAI = annee.UAIEtablissementorigine;
                break;
            }
            nbAnneesCesure++;
        }

        cand.nbAnneesCesure = nbAnneesCesure;

        let lycee = Lycees.binarySearch(UAI);
        if (lycee){
            if (!lycee.candidats){
                lycee.candidats = [];
            }
            lycee.candidats.push(cand);
        }
    }

    let filtered_data = data.filter(lycee => lycee.candidats && lycee.candidats.length > 0);

    return filtered_data;
}

export { Lycees };