import React, {Component} from "react";
import {createClassFromLiteSpec} from 'react-vega-lite';


import ReactDOM from 'react-dom';
import VegaLite from 'react-vega-lite';



class BarChart extends Component {

	render() {
		const spec = {
			"data": {
    "values": [
      {"total votantes": 10,"gustavo petro": 8},
      {"total votantes": 20,"gustavo petro": 2},
      {"total votantes": 30,"gustavo petro": 4},
      {"total votantes": 40,"gustavo petro": 8},
      {"total votantes": 50,"gustavo petro": 2}
    ]
  },
  			"description": "A simple bar chart with embedded data.",
  			"mark": "bar",
  			"transform": [{
  			  "window": [{
  			      "op": "sum",
  			      "field": "gustavo petro",
  			      "as": "TotalVotosCandidato"
  			  },
  			  {
  			      "op": "sum",
  			      "field": "total_votantes",
  			      "as": "TotalVotos"
  			  },
  			  
  			  ],
  			  "frame": [null, null]
  			},
  			{
  			  "calculate": "datum.TotalVotosCandidato/datum.TotalVotos * 100",
  			  "as": "PercentOfTotal"
  			}],
  			"encoding": {
  			  "x": {
  			    "field": "PercentOfTotal",
  			    "type": "quantitative",
  			    "axis": {
  			      "title": "% de votos obtenidos"
  			    }
  			  },
  			  "y": {
  			  	"field":"departamento",
  			  	 "type": "nominal",
	  			    "scale": {
  			      "rangeStep": 12
  			    },
  			    "axis":{
  			    	"title": this.props.candidato
  			    }
  			  }
  			}
		};

		return(
			<VegaLite spec={spec}/>
			)
	}

}
export default BarChart;