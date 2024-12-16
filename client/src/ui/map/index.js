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

    // Vérification du nom
    // (Pour accorder les fonctions entre elles)
    if (!lycee.name){
        lycee.name = lycee.appellation_officielle;
    }

    let marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<b>${lycee.name}</b><br>${lycee.candidats.length} candidature(s)`);
    return marker;
}

mapFunctions.renderLycees = function(data){
    for (let lycee of data){
        mapFunctions.renderLycee(lycee);
    }
}

mapFunctions.renderCandidatures = function(data){
    for (let lycee of data){
        if (lycee.candidats){

            // Si la région est déjà enregistrée
            let region = mapFunctions.regions.find(region => region.code === lycee.code_region);
            if (region){
                
                // Si le département est déjà enregistré
                let departement = region.departements.find(departement => departement.code === lycee.code_departement);
                if (departement){

                    // Si la commune est déjà enregistrée
                    let commune = departement.communes.find(commune => commune.code === lycee.code_commune);
                    if (commune){
                        commune.lycees.push(lycee);
                    }

                    // On enregistre la commune
                    else {
                        departement.communes.push({
                            code: lycee.code_commune,
                            lycees: [lycee]
                        });
                    }

                }

                // On enregistre le département et la commune
                else {
                    region.departements.push({
                        code: lycee.code_departement,
                        communes: [{
                            code: lycee.code_commune,
                            lycees: [lycee]
                        }]
                    });
                }

            }

            // On enregistre la région, le département et la commune
            else {
                mapFunctions.regions.push({
                    code: lycee.code_region,
                    departements: [{
                        code: lycee.code_departement,
                        communes: [{
                            code: lycee.code_commune,
                            lycees: [lycee]
                        }]
                    }]
                });
            }
        }
    }

    console.log(mapFunctions.regions);
    
    for (let region of mapFunctions.regions){
        let region_marker = L.markerClusterGroup({
            zoomToBoundsOnClick: false,
            spiderfyOnMaxZoom: false,
            disableClusteringAtZoom: 12
        });

        for (let departement of region.departements){
            let departement_marker = L.markerClusterGroup({
                zoomToBoundsOnClick: false,
                spiderfyOnMaxZoom: false,
            });

            for (let commune of departement.communes){
                let commune_marker = L.markerClusterGroup({
                    zoomToBoundsOnClick: false,
                    spiderfyOnMaxZoom: false,
                });

                let commune_total = 0;
                for (let lycee of commune.lycees){
                    let marker = mapFunctions.renderLycee(lycee);
                    if (marker){
                        commune_marker.addLayer(marker);
                        commune_total += lycee.candidats.length;
                    }
                }
                commune_marker.bindPopup(`<b>${commune_total} candidature(s)`);

                departement_marker.addLayer(commune_marker);
            }

            region_marker.addLayer(departement_marker);
        }

        map.addLayer(region_marker);
    }
}

export { mapFunctions };