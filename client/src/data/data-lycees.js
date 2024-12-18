import { Candidats } from "./data-candidats.js";
import { Poste } from "./data-poste.js";

let data = await fetch("./src/data/json/lycees.json");
data = await data.json();

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
    let villes = [];

    for (let cand of candidats){

        let UAI;
        let codePostal;
        for (let annee of cand.Scolarite){
            if (annee.UAIEtablissementorigine){
                UAI = annee.UAIEtablissementorigine;
                codePostal = annee.CommuneEtablissementOrigineCodePostal;
                break;
            }
        }

        let lycee = Lycees.binarySearch(UAI);
        if (lycee){
            if (!lycee.candidats){
                lycee.candidats = [];
            }
            lycee.candidats.push(cand);
        }
        else {
            if (codePostal){
                codePostal = codePostal.substring(0, 2);
                codePostal += "000";
                let ville = Poste.binarySearch(codePostal);
                if (ville){
                    if (!villes.includes(ville)){
                        ville.appellation_officielle = ville.nom_de_la_commune;
                        ville.latitude = parseFloat(ville._geopoint.split(",")[0]);
                        ville.longitude = parseFloat(ville._geopoint.split(",")[1]);
                        ville.candidats = [cand];
                        ville.numero_uai = ville.code_postal;
                        villes.push(ville);
                    }
                    else {
                        ville.candidats.push(cand);
                    }
                }
            }
        }

    }

    let filtered_data = data.filter(lycee => lycee.candidats && lycee.candidats.length > 0);

    filtered_data = filtered_data.concat(villes);

    return filtered_data;
}

export { Lycees };