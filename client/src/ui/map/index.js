import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

mapFunctions.renderLycee = function(lycee){
    // Vérification des coordonnées
    let latitude = parseFloat(lycee.latitude);
    let longitude = parseFloat(lycee.longitude);
    if (isNaN(latitude) || isNaN(longitude)){
        return;
    }

    // Vérification du nom
    // (Pour accorder les fonctions entre elles)
    if (!lycee.name){
        lycee.name = lycee.appellation_officielle;
    }

    let marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`<b>${lycee.name}</b><br>${lycee.candidats.length} candidature(s)`);
}

mapFunctions.renderLycees = function(data){
    for (let lycee of data){
        mapFunctions.renderLycee(lycee);
    }
}

mapFunctions.renderCandidatures = function(data){
    for (let lycee of data){
        if (lycee.candidats){
            mapFunctions.renderLycee(lycee);
        }
    }
}

export { mapFunctions };