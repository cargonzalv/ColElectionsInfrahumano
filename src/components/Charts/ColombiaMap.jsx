import React, {Component} from "react";
import {createClassFromLiteSpec} from 'react-vega-lite';


import ReactDOM from 'react-dom';
import VegaLite from 'react-vega-lite';

const spec = {
  
  "layer":[
  {
  "mark": {
        "type": "geoshape",
        "fill": "lightgray",
        "stroke": "white"
      },
      "projection": {
        "type": "mercator"
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
  	"projection": {
        "type": "albersUsa"
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
		spec.encoding = {
		"longitude": {
          "field": "longitude",
          "type": "quantitative"
        },
        "latitude": {
          "field": "latitude",
          "type": "quantitative"
        },
        "size": {"value": 10},
        "color": {"value": "steelblue"}
	}
		return(
			<VegaLite spec={spec} />
			)
	}

}
export default BarChart;