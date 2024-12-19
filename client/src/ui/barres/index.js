import '../../../node_modules/zingchart/zingchart-es6.min.js';

let Barres = {};

/* Data à avoir

    { // les générales
        values: [10],
        stack: 1 // et ça on met le code postal
    },
    { // les STI2D
        values: [20],
        stack: 1
    },
    { // les autres
        values: [30],
        stack: 1
    }

*/

Barres.render = function(data, seuil){

    let finalData = [];
    let labelList = [];

    let tabPostBac = [];
    let tabGenerale = [];
    let tabSTI2D = [];
    let tabAutre = [];

    let exclusPostBac = 0;
    let exclusGenerale = 0;
    let exclusSTI2D = 0;
    let exclusAutre = 0;

    for (let elt of data){
        if (elt.total < seuil){
            exclusPostBac += elt.candidatsPostBac;
            exclusGenerale += elt.candidatsGenerale;
            exclusSTI2D += elt.candidatsSTI2D;
            exclusAutre += elt.candidatsAutre;
            continue;
        }
        tabPostBac.push(elt.candidatsPostBac);
        tabGenerale.push(elt.candidatsGenerale);
        tabSTI2D.push(elt.candidatsSTI2D);
        tabAutre.push(elt.candidatsAutre);
        
        labelList.push(elt.code_postal);
    }

    tabPostBac.push(exclusPostBac);
    tabGenerale.push(exclusGenerale);
    tabSTI2D.push(exclusSTI2D);
    tabAutre.push(exclusAutre);
    labelList.push("Autres");

    finalData.push({
        values: tabGenerale,
        backgroundColor: '#4bd4f9',
        text: 'Générale',
        stack: "1"
    });
    finalData.push({
        values: tabSTI2D,
        backgroundColor: '#61b955',
        text: 'STI2D',
        stack: "1"
    });
    finalData.push({
        values: tabPostBac,
        backgroundColor: '#cc6adc',
        text: 'Post-Bac',
        stack: "1"
    });
    finalData.push({
        values: tabAutre,
        backgroundColor: '#f36243',
        text: 'Autres',
        stack: "1"
    });
    
    let chartConfig = {
        type: 'hbar',
        plot: {
            stacked: true
        },
        legend: {
            minimize: true,
        },
        scaleX: {
            labels: labelList,
            "items-overlap": true,
            "max-items": 999999,
            "max-labels": 999999,
        },
        series: finalData,
    }

    zingchart.render({
        id: 'barres',
        data: chartConfig,
        height: '100%',
        width: '100%'
    });
}

export { Barres };