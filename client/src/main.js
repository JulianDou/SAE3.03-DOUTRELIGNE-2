import { HeaderView } from "./ui/header/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";

import './index.css';

import './ui/map/index.js';
import { mapFunctions } from './ui/map/index.js';

let C = {};

C.init = async function(){
    let dataCandidats = await Candidats.getAll();
    let dataLycees = await Lycees.getAll();
    console.log(dataCandidats);
    console.log(dataLycees);

    V.init(Candidats.getAll(), Lycees.getAll());
}

let V = {
    header: document.querySelector("#header")
};

V.init = function(candidats, lycees){
    V.renderHeader();
    mapFunctions.renderCandidatures(candidats, lycees);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}


C.init();