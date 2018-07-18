import React, {Component} from "react";
import {createClassFromLiteSpec} from 'react-vega-lite';


import ReactDOM from 'react-dom';
import VegaLite from 'react-vega-lite';



class BarChart extends Component {

	render() {
		const spec = {
  			"description": "A simple bar chart with embedded data.",
  			"mark": "bar",
  			"transform": [{
  			  "window": [{
  			      "op": "sum",
  			      "field": this.props.candidato,
  			      "as": "TotalVotos"
  			  }],
  			  "frame": [null, null]
  			},
  			{
  			  "calculate": "datum.TotalVotos/datum.total_votantes * 100",
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
  			    "field": "",
  			    "type": "nominal",
  			    "scale": {
  			      "rangeStep": 12
  			    }
  			  }
  			}
		};

		return(
			<VegaLite spec={spec} data={this.props.data} />
			)
	}

}
export default BarChart;