import React, {Component} from "react";


import VegaLite from 'react-vega-lite';
/*https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/Colombia.topo.json
*/const spec = {
  "width": 200,
  "height": 200,
   "data": {
          "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/Colombia.topo.json",
          "format": {
            "type": "topojson",
            "feature": "Colombia"
          }
        },
  "transform": [
    {
      "lookup": "DPTO",
      "from": {
        "data": {
          "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/primera_vuelta_agrupada.csv"
        },
        "key": "round(cod_depto)",
        "fields":["total_votantes"]
      },
    }
  ],

  "mark": "geoshape",


};


class BarChart extends Component {

	render() {
		return(
			<VegaLite spec={spec} />
			)
	}

}
export default BarChart;