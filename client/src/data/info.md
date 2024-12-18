# Infos Data

## Lycées

Les lycées sont triés par leur UAI.
L'UAI est un identifiant unique à chaque lycée.

* Attention, on ne dispose que des UAI des **lycées**, et donc pas des établissements supérieurs.

## Candidats

### Code Postal

Le code postal se trouve dans **Scolarite**, **CommuneEtablissementOrigineCodePostal**.
* Attention il ne faudra garder que les deux premiers chiffres pour avoir le département : `string.slice(0,2)`.

### Codes Diplômes

Le code diplôme se trouve dans Baccalauréat, TypeDiplomeCode.
1. Baccalauréat obtenu
2. Diplôme étranger équivalent au bac obtenu
3. ~~(Inexistant)~~
4. Baccalauréat en préparation
* A ne pas confondre avec SerieDiplomeCode qui donne l'acronyme de la série *(Générale, STI2D, etc.)*.

### Scolarité

La liste des années se fait de la plus récente à la plus ancienne.
Le "cas général" aura seulement les 3 premières de "remplies", mais il est possible d'en avoir plus.

*Exemple:*
```json
[
    {AnneeScolaireCode: 0, AnneeScolaireLibelle: '2023-2024', UAIEtablissementorigine: '0240035H', NomEtablissementOrigine: 'Lycée Pre De Cordy', CommuneEtablissementOrigineLibelle: 'Sarlat-la-Canéda', …},
    {AnneeScolaireCode: 1, AnneeScolaireLibelle: '2022-2023', UAIEtablissementorigine: '0240035H', NomEtablissementOrigine: 'Lycée Pre De Cordy', CommuneEtablissementOrigineLibelle: 'Sarlat-la-Canéda', …},
    {AnneeScolaireCode: 2, AnneeScolaireLibelle: '2021-2022', UAIEtablissementorigine: '0240035H', NomEtablissementOrigine: 'Lycée Pre De Cordy', CommuneEtablissementOrigineLibelle: 'Sarlat-la-Canéda', …},
    {AnneeScolaireCode: 3, AnneeScolaireLibelle: '2020-2021'},
    {AnneeScolaireCode: 4, AnneeScolaireLibelle: '2019-2020'},
    {AnneeScolaireCode: 5, AnneeScolaireLibelle: '2018-2019'}
]
```

On pourra utiliser un code du type :
```javascript
let UAI;
for (let annee of candidat.Scolarite){
    if (annee.UAIEtablissementorigine){
        UAI = annee.UAIEtablissementorigine;
        break;
    }
}
```
Qui viendra parcourir la scolarité du candidat, et s'arrêtera dès qu'il trouvera une année "valide" (la plus récente).

## Lien Candidats/Lycées

Le lien entre candidats et lycées se fait grâce au numéro UAI.

*Exemple :*
```json
{
    NomEtablissementOrigine: "Lycée Pre De Cordy",
    UAIEtablissementOrigine: "0240035H"
}
```

On ajoute par-nous mêmes à chaque lycée une liste de leurs candidats pour MMI.