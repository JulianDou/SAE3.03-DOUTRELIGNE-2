import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

var map = L.map('map').setView([45.836, 1.231], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([45.83628, 1.23166]).addTo(map);

/* Ajout d'un cercle

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

*/