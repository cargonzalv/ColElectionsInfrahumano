import React, {Component} from "react";


import VegaLite from 'react-vega-lite';



class BarChart extends Component {

	render() {
		console.log(this.props.candidato)
		let calc = "round(datum['"+this.props.candidato+"']/datum.total * 100)";
		const spec = {
			"description": "A simple bar chart with embedded data.",
  			"mark": "bar",
  			"transform": [{
  			  "window": [{
  			      "op": "count",
  			      "field": this.props.candidato,
  			      "as": "TotalVotosCandidato"
  			  },
  			  
  			  ],
  			},
  			{
  			  "calculate": calc,
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
  			  	"field":"PercentOfTotal",
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
			<VegaLite spec={spec} data={this.props.data}/>
			)
	}

}
export default BarChart;