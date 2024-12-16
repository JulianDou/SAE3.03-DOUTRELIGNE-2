# Infos Data

## Candidats

### Codes Diplomes

4. Baccalauréat en préparation

### Scolarité

La liste des années se fait de la plus récente à la plus ancienne.
Le "cas général" aura seulement les 3 premières de "remplies", mais il est possible d'en avoir plus.

Exemple:
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

## Lien Candidats/Lycées

Le lien entre candidats et lycées se fait grâce au numéro UAI.

Exemple :
```json
{
    NomEtablissementOrigine: "Lycée Pre De Cordy",
    UAIEtablissementOrigine: "0240035H"
}
```