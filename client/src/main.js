import { HeaderView } from "./ui/header/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Barres } from "./ui/barres/index.js";

import './index.css';

import './ui/map/index.js';
import { mapFunctions } from './ui/map/index.js';

let C = {};

C.data = {};

C.init = async function(){
    C.data.lycees = await Lycees.getAll();
    console.log("Data lycees : ");
    console.log(C.data.lycees);

    C.data.departements = await Lycees.getDepartements();
    console.log("Data departements : ");
    console.log(C.data.departements);

    V.init(C.data.lycees, C.data.departements);

    document.querySelector("#slider").addEventListener("change", C.handler_Slider);
}

C.handler_Slider = async function(event){
    let value = event.target.value;
    document.querySelector("#slider-value").innerHTML = value;

    document.querySelector("#barres").innerHTML = "";
    Barres.render(C.data.departements, value);
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