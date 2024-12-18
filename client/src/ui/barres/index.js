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

Barres.render = function(data){

    let finalData = [];
    let labelList = [];

    for (let elt of data){
        finalData.push({
            values: [elt.candidatsPostBac],
            stack: elt.code_postal
        });
        finalData.push({
            values: [elt.candidatsGenerale],
            stack: elt.code_postal
        });
        finalData.push({
            values: [elt.candidatsSTI2D],
            stack: elt.code_postal
        });
        finalData.push({
            values: [elt.candidatsAutre],
            stack: elt.code_postal
        });
        labelList.push(elt.code_postal);
    }

    console.log(labelList);

    let chartConfig = {
        type: 'hbar',
        plot: {
            stacked: true
        },
        scaleX: {
            labels: labelList
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