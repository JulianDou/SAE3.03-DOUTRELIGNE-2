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
}

C.handler_Slider = async function(event){
    let value = event.target.value;
    document.querySelector("#slider-value").innerHTML = value;

    document.querySelector("#barres").innerHTML = "";
    Barres.render(C.data.departements, value);
}

C.handler_mapSlider = async function(event){
    mapFunctions.clearMap();

    let value = event.target.value;
    document.querySelector("#map-slider-value").innerHTML = value + " km";
    mapFunctions.filter(value);

    let new_departements = await Lycees.filterByDistance(C.data.departements, value);
    let new_lycees = await Lycees.filterByDistance(C.data.lycees, value);

    document.querySelector("#barres").innerHTML = "";
    let barresValue = document.querySelector("#slider").value;
    Barres.render(new_departements, barresValue);
    mapFunctions.renderCandidatures(new_lycees);
}

C.handler_toggleCircle = async function(event){
    let checked = event.target.checked;
    if (checked){
        mapFunctions.clearMap();

        let value = document.querySelector("#map-slider").value;
        mapFunctions.filter(value);

        let new_lycees = await Lycees.filterByDistance(C.data.lycees, value);
        let new_departements = await Lycees.filterByDistance(C.data.departements, value);

        mapFunctions.renderCandidatures(new_lycees);
        Barres.render(new_departements, document.querySelector("#slider").value);
    }
    else {
        mapFunctions.clearMap();
        mapFunctions.renderCandidatures(C.data.lycees);
        Barres.render(C.data.departements, document.querySelector("#slider").value);
    }
}

let V = {
    header: document.querySelector("#header")
};

V.init = function(lycees, departements){
    V.renderHeader();
    mapFunctions.renderCandidatures(lycees);
    mapFunctions.filter(650);
    Barres.render(departements, 15);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();