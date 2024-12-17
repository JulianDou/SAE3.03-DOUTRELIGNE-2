import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

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

    let marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.candidats.length} candidature(s)`);
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
        let nbcandidats = 0;
        let markers = a.layer.getAllChildMarkers();
        for (let marker of markers){
            let popup = marker.getPopup().getContent();
            popup = popup.split('<br>')[1];
            popup = popup.split(' ')[0];
            nbcandidats += parseInt(popup);
        }
        L.popup().setLatLng(a.latlng).setContent(`Nombre de candidats : ${nbcandidats}`).openOn(map);
    });

    map.addLayer(cluster);
}

export { mapFunctions };