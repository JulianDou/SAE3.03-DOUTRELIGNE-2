let data = await fetch("./src/data/json/base_officielle_codes_postaux.json");
data = await data.json();

let compare = function(a, b){
    if (a.code_postal < b.code_postal){
        return -1;
    }
    if (a.code_postal > b.code_postal){
        return 1;
    }
}
data.sort(compare);

let Poste = {};

Poste.binarySearch = function(codePostal){
    let min = 0;
    let max = data.length - 1;

    while (min <= max){
        let mid = Math.floor((min + max) / 2);
        if (data[mid].code_postal == codePostal){
            return data[mid];
        }
        else if (data[mid].code_postal < codePostal){
            min = mid + 1;
        }
        else{
            max = mid - 1;
        }
    }

    return null;
}

export { Poste };