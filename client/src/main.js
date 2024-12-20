import { HeaderView } from "./ui/header/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Barres } from "./ui/barres/index.js";

import './index.css';

import './ui/map/index.js';
import { mapFunctions } from './ui/map/index.js';
import { map } from "leaflet";

let C = {};

C.data = {};

C.init = async function(){
    C.data.lycees = await Lycees.getAll();

    C.data.departements = await Lycees.getDepartements(C.data.lycees);

    V.init(C.data.lycees, C.data.departements);

    document.querySelector("#slider").addEventListener("change", C.handler_Slider);
    document.querySelector("#map-slider").addEventListener("change", C.handler_mapSlider);
    document.querySelector("#toggle-circle").addEventListener("click", C.handler_toggleCircle);
    document.querySelector("#radios").addEventListener("click", C.handler_Radios);
}

C.handler_Slider = async function(event){
    let value = event.target.value;
    document.querySelector("#slider-value").innerHTML = value;

    document.querySelector("#barres").innerHTML = "";
    Barres.render(C.data.departements, value);
}

C.handler_mapSlider = async function(event){
    let distance = event.target.value
    document.querySelector("#toggle-circle").checked = true;
    document.querySelector("#map-slider-value").innerHTML = distance + " km";

    let radios = document.querySelectorAll("input[type=radio]");
    let idRadio = undefined;
    for (let radio of radios){
        if (radio.checked){
            idRadio = radio.id;
            idRadio = idRadio.split("-")[1];
            break;
        }
    }
    C.filterManager(idRadio, distance);
}

C.handler_toggleCircle = async function(event){
    let checked = event.target.checked;
    let distance = document.querySelector("#map-slider").value
    let radios = document.querySelectorAll("input[type=radio]");
    let idRadio = undefined;
    for (let radio of radios){
        if (radio.checked){
            idRadio = radio.id;
            idRadio = idRadio.split("-")[1];
            break;
        }
    }
    if (checked){
        C.filterManager(idRadio, distance);
    }
    else {
        C.filterManager(idRadio, undefined);
    }
}

C.handler_Radios = async function(event){
    if (event.target.type != "radio"){
        return;
    }
    else {
        let id = event.target.id;
        id = id.split("-")[1];

        let distance = document.querySelector("#map-slider").value;
        let checked = document.querySelector("#toggle-circle").checked;
        if (checked){
            C.filterManager(id, distance);
        }
        else {
            C.filterManager(id, undefined);
        }
    }
}

C.filterManager = async function(idFilter, distance){
    let valueBarres = document.querySelector("#slider").value;
    mapFunctions.clearMap();
    switch (idFilter) {
        case "tous":
            if (distance){
                let new_departements = await Lycees.filterByDistance(C.data.departements, distance);
                let new_lycees = await Lycees.filterByDistance(C.data.lycees, distance);
                mapFunctions.filter(distance);
                mapFunctions.renderCandidatures(new_lycees);
                Barres.render(new_departements, valueBarres);
            }
            else {
                mapFunctions.renderCandidatures(C.data.lycees);
                Barres.render(C.data.departements, valueBarres);
            }
            break;
        
        case "generale":
            if (distance){
                let dataLycees = await Lycees.filterByFiliere("Générale", C.data.lycees);
                let new_lycees = await Lycees.filterByDistance(dataLycees, distance);
                mapFunctions.filter(distance);
                mapFunctions.renderCandidatures(new_lycees, "Générale");
            }
            else {
                let dataLycees = await Lycees.filterByFiliere("Générale", C.data.lycees);
                mapFunctions.renderCandidatures(dataLycees, "Générale");
            }
            break;

        case "sti2d":
            if (distance){
                let dataLycees = await Lycees.filterByFiliere("STI2D", C.data.lycees);
                let new_lycees = await Lycees.filterByDistance(dataLycees, distance);
                mapFunctions.filter(distance);
                mapFunctions.renderCandidatures(new_lycees, "STI2D");
            }
            else {
                let dataLycees = await Lycees.filterByFiliere("STI2D", C.data.lycees);
                mapFunctions.renderCandidatures(dataLycees, "STI2D");
            }
            break;

    }
}

let V = {
    header: document.querySelector("#header")
};

V.init = function(lycees, departements){
    V.renderHeader();
    mapFunctions.renderCandidatures(lycees);
    Barres.render(departements, 15);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();