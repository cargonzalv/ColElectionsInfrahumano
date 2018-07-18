import React, {Component} from "react";
import {createClassFromLiteSpec} from 'react-vega-lite';


import ReactDOM from 'react-dom';
import VegaLite from 'react-vega-lite';

const spec = {
    "projection":{
  		"type":"mercator",
  		"scale":"774",
  		"center0":"-72",
  		"center1":"2",

  	},
  "layer":[
  {
  "mark": {
        "type": "geoshape",
        "fill": "lightgray",
        "stroke": "white"
      },

  "data":{
  	"url": "https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/Colombia.geo.json",
        "format": {
          "type": "json",
          "feature": "states"
        }
  	}
  },
  {
  "mark":"circle",

  "data":{
  	"url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/primera_vuelta_con_coordenadas.csv",
  	},
  	"projection":{
  		"type":"albers",
  		"scale":"774"
  	},
      "encoding": {
        "longitude": {
          "field": "longitud",
          "type": "quantitative"
        },
        "latitude": {
          "field": "latitud",
          "type": "quantitative"
        },
        "size": {"value": 100},
        "color": {"value": "red"}
      }
  }
  ]
  


};


class BarChart extends Component {

	render() {
		return(
			<VegaLite spec={spec} />
			)
	}

}
export default BarChart;