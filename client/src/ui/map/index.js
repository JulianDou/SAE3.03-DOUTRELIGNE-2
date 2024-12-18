import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

import { Lycees } from '../../data/data-lycees.js';
import { Poste } from '../../data/data-poste.js';

var map = L.map('map').setView([45.836, 1.231], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* Ajout d'un cercle

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

*/

let mapFunctions = {}

mapFunctions.regions = [];

mapFunctions.renderLycee = function(lycee){
    // Vérification des coordonnées
    let latitude = parseFloat(lycee.latitude);
    let longitude = parseFloat(lycee.longitude);
    if (isNaN(latitude) || isNaN(longitude)){
        return;
    }

    let filieresString = mapFunctions.formatFilieresLycee(lycee).string;

    let marker = L.marker([latitude, longitude]);
    marker.bindPopup(`
        <b>${lycee.numero_uai} - ${lycee.appellation_officielle}</b>
        <br>${lycee.candidats.length} candidature(s)`
        + filieresString
    );
    return marker;
}

mapFunctions.renderLycees = function(data){
    for (let lycee of data){
        mapFunctions.renderLycee(lycee);
    }
}

mapFunctions.renderCandidatures = function(data){
    let cluster = L.markerClusterGroup({
        zoomToBoundsOnClick: false,
        spiderfyOnMaxZoom: false,
        disableClusteringAtZoom: 12
    });

    for (let lycee of data){
        if (lycee.candidats){
            let marker = mapFunctions.renderLycee(lycee);
            if (marker){
                cluster.addLayer(marker);
            }
        }
    }

    cluster.on('clusterclick', function (a) {
        let UAIS = [];
        let nbcandidats = 0;

        let markers = a.layer.getAllChildMarkers();
        for (let marker of markers){
            let popup = marker.getPopup().getContent();

            let popup_candidats = popup.split('<br>')[1];
            popup_candidats = popup_candidats.split(' ')[0];
            nbcandidats += parseInt(popup_candidats);

            let popup_UAI = popup.split(' - ')[0];
            popup_UAI = popup_UAI.split('<b>')[1];
            UAIS.push(popup_UAI);
        }

        let filieresString = mapFunctions.formatFilieresCluster(UAIS).string;

        L.popup().setLatLng(a.latlng).setContent(`
            ${nbcandidats} candidature(s)
            ${filieresString}
        `).openOn(map);
    });

    map.addLayer(cluster);
}

mapFunctions.formatFilieresLycee = function(lycee){
    let filieresLycee = [];
    for (let candidat of lycee.candidats){
        let filiereCandidat = candidat.Baccalaureat.SerieDiplomeCode;
        if (!(filiereCandidat == "Générale") && !(filiereCandidat == "STI2D")){
            if (filiereCandidat == "S" || filiereCandidat == "ES" || filiereCandidat == "L"){
                filiereCandidat = "Générale (Ancien Bac)";
            }
            else {
                filiereCandidat = "Autre";
            }
        }
        
        let filiereExistante = filieresLycee.find(filiere => filiere.code === filiereCandidat);
        if (filiereExistante) {
            filiereExistante.quantite += 1;
        } else {
            filieresLycee.push({ code: filiereCandidat, quantite: 1 });
        }
    }

    let filieresString = ' :';
    for (let filiere of filieresLycee){
        filieresString += `<br>- ${filiere.code} : ${filiere.quantite} candidature(s)`;
    }
    
    return {
        string: filieresString,
        tableau: filieresLycee
    };
}

mapFunctions.formatFilieresCluster = function(UAIS){
    let filieresTableau = [];
    for (let UAI of UAIS){
        let lycee = Lycees.binarySearch(UAI);
        if (!lycee){
            lycee = Poste.binarySearch(UAI);
        }
        let filieresLycee = mapFunctions.formatFilieresLycee(lycee).tableau;
        for (let filiere of filieresLycee){
            let filiereExistante = filieresTableau.find(f => f.code === filiere.code);
            if (filiereExistante){
                filiereExistante.quantite += filiere.quantite;
            } else {
                filieresTableau.push(filiere);
            }
        }
    }

    let filieresString = ' :';
    for (let filiere of filieresTableau){
        filieresString += `<br>- ${filiere.quantite} candidature(s) en ${filiere.code}`;
    }

    return {
        string: filieresString,
        tableau: filieresTableau
    };
}

export { mapFunctions };