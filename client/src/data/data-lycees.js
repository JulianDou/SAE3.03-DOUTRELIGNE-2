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

Lycees.getDepartements = function(){

    let departements = [];
    let dataLycees = Lycees.getAll();

    for (let lycee of dataLycees){
        let codePostal;
        if (!lycee.code_postal){
            codePostal = lycee.code_commune.substring(0, 2);
        }
        else {
            codePostal = lycee.code_postal.substring(0, 2);
        }
        let departement = departements.find(dep => dep.code_postal === codePostal);
        if (!departement) {
            departement = {
                latitude: lycee.latitude,
                longitude: lycee.longitude,
                code_postal: codePostal,
                candidatsPostBac: 0,
                candidatsGenerale: 0,
                candidatsSTI2D: 0,
                candidatsAutre: 0
            };
            departements.push(departement);
        }
        for (let candidat of lycee.candidats){
            if (candidat.Baccalaureat.TypeDiplomeCode == 1){
                departement.candidatsPostBac++;
            }
            else {
                if (candidat.Baccalaureat.SerieDiplomeCode == "STI2D"){
                    departement.candidatsSTI2D++;
                }
                else if (candidat.Baccalaureat.SerieDiplomeCode == "Générale"){
                    departement.candidatsGenerale++;
                }
                else {
                    departement.candidatsAutre++;
                }
            }
        }
        departement.total = departement.candidatsPostBac + departement.candidatsGenerale + departement.candidatsSTI2D + departement.candidatsAutre;
    }

    let compare = function(a, b){
        if (a.total < b.total){
            return -1;
        }
        if (a.total > b.total){
            return 1;
        }
    }
    departements.sort(compare);

    return departements;
}

Lycees.filterByDistance = function(data, distance){
    let new_data = data;
    for (let elt of data){
        if (elt.latitude && elt.longitude){
            if (distanceVolDoiseau(elt.latitude, elt.longitude, 45.836, 1.231) > distance){
                new_data = new_data.filter(e => e !== elt);
            }
        }
    }
    return new_data;
}

Lycees.filterByFiliere = function(filiere, data){
    let lycees = [];
    for (let lycee of data){
        for (let candidat of lycee.candidats){
            if (candidat.Baccalaureat.SerieDiplomeCode == filiere){
                lycees.push(lycee);
                break;
            }
        }
    }
    return lycees;
}

// Distance "à vol d'oiseau" entre deux points géographiques
// lat_a, lon_a : latitude et longitude du premier point
// lat_b, lon_b : latitude et longitude du second point
// Retourne la distance en km
let distanceVolDoiseau = function(lat_a, lon_a, lat_b, lon_b)
{
   // Convertion des degrés en radian
   let a = Math.PI / 180;
   let lat1 = lat_a * a;
   let lat2 = lat_b * a;
   let lon1 = lon_a * a;
   let lon2 = lon_b * a;
  
   let t1 = Math.sin(lat1) * Math.sin(lat2);
   let t2 = Math.cos(lat1) * Math.cos(lat2);
   let t3 = Math.cos(lon1 - lon2);
   let t4 = t2 * t3;
   let t5 = t1 + t4;
   let rad_dist = Math.atan(-t5/Math.sqrt(-t5 * t5 +1)) + 2 * Math.atan(1);


   return (rad_dist * 3437.74677 * 1.1508) * 1.6093470878864446;
}

export { Lycees };