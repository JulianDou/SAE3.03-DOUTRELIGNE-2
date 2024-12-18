import { HeaderView } from "./ui/header/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Barres } from "./ui/barres/index.js";

import './index.css';

import './ui/map/index.js';
import { mapFunctions } from './ui/map/index.js';

let C = {};

C.init = async function(){
    let dataLycees = await Lycees.getAll();
    console.log(dataLycees);
    
    let dataDepartements = await Lycees.getDepartements();
    console.log(dataDepartements);

    V.init(dataLycees, dataDepartements);
}

let V = {
    header: document.querySelector("#header")
};

V.init = function(lycees, departements){
    V.renderHeader();
    mapFunctions.renderCandidatures(lycees);
    Barres.render(departements);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();