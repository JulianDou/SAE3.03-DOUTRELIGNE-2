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