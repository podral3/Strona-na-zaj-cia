import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      // 'http://localhost:8080/geoserver/BDOT/ows?service=WFS&' +
      // 'version=1.0.0&request=GetFeature&typeName=BDOT%3APL.PZGiK.283.1218__OT_BUBD_A%20inf%20dod&' +
      // 'maxFeatures=50&outputFormat=application%2Fjson' + 
      // 'bbox =' + extent.join(',') + ',EPSG:4326'
      'http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Acountries&maxFeatures=50&outputFormat=application%2Fjson'
    );
  },
  strategy: bboxStrategy,
});

const vector = new VectorLayer({
  source: vectorSource,
  style: {
    'stroke-width': 0.75,
    'stroke-color': 'white',
    'fill-color': 'rgba(100,100,100,0.25)',
  },
});

function createLayer(layerID) {
  let myLayer = new TileLayer({
    title: "Country Boundaries",
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/BDOT/wms',
      params: {'LAYERS': `${layerID}`, 'TILED': true},
      serverType: 'geoserver',
      visible: true
    })
  })
  return myLayer;
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vector
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

let ptlz = createLayer("BDOT:PL.PZGiK.283.1218__OT_PTLZ_A — OT_PTLZ_A")
//map.addLayer(ptlz);

let ptzb = createLayer("BDOT:PL.PZGiK.283.1218__OT_PTZB_A — OT_PTZB_A")
//map.addLayer(ptzb);

let oior = createLayer("BDOT:PL.PZGiK.283.1218__OT_OIOR_A — OT_OIOR_A")
//map.addLayer(oior);

let swkn = createLayer("BDOT:PL.PZGiK.283.1218__OT_SWKN_L — OT_SWKN_L")
//map.addLayer(swkn);

let bubda = createLayer("BDOT:PL.PZGiK.283.1218__OT_BUBD_A inf dod")
//map.addLayer(bubda);
  