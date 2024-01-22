import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import MousePosition from 'ol/control/MousePosition.js';
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
import {createStringXY} from 'ol/coordinate.js';


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

const bubdaSource = new VectorSource({
  features: new GeoJSON().readFeatures(geoJsonBUBDA),
  style: {
    'stroke-width': 0.75,
    'stroke-color': 'black',
    'fill-color': 'rgba(100,100,100,0.25)',
  },
})
console.log(geoJsonBUBDA)
const bubdaLayer = new VectorLayer({
  source: bubdaSource,
  style: {
    'stroke-width': 0.75,
    'stroke-color': 'white',
    'fill-color': 'rgba(100,100,100,0.25)',
  },
})
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

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
});

const scaleControl = new ScaleLine({
  units: 'metric',
  bar: true,
  steps: 4,
  text: true,
  minWidth: 140,
});

const map = new Map({
  controls: defaultControls().extend([mousePositionControl, scaleControl]),
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    bubdaLayer
  ],
  view: new View({
    center: [14200000, 4130000],
    zoom: 2,
  }),
});
