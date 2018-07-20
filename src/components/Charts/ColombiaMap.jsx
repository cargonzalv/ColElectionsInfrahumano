import React, {Component} from "react";

import VegaLite from 'react-vega-lite';
/*https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/Colombia.topo.json
*/const spec = {
  "width":300,
  "height":300,
  "config": {
    "view": {
      "stroke": "transparent"
    }
  },
  "layer": [
    {
      "data": {
        "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/Colombia.topo.json",
        "format": {
          "type": "topojson",
          "feature": "Colombia"
        }
      },
      "mark": {
        "type": "geoshape",
        "stroke": "white",
        "strokeWidth": 2
      },
      "encoding": {
        "color": {
          "value": "#eee"
        }
      }
    },
    {
      "data": {
        "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/primera_vuelta_coords.csv",
        "format": {
          "type": "csv"
        }
      },
      "mark": "circle",
      "encoding": {
        "longitude": {
          "field": "longitud",
          "type": "quantitative"
        },
        "latitude": {
          "field": "latitud",
          "type": "quantitative"
        },
        "size": {
          "value":5
        },
        "opacity": {
          "value": 0.6
        }
      }
    },
    {
      "data": {
        "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/departamentosColombia.csv",
        "format": {
          "type": "csv"
        }
      },
      "transform": [
        {
          "calculate": "indexof (datum.departamento,' ') > 0  ? substring(datum.name,0,indexof(datum.departamento, ' ')) : datum.departamento",
          "as": "bLabel"
        }
      ],
      "mark": "text",
      "encoding": {
        "longitude": {
          "field": "longitud",
          "type": "quantitative"
        },
        "latitude": {
          "field": "latitud",
          "type": "quantitative"
        },
        "text": {
          "field": "bLabel",
          "type": "nominal"
        },
        "size": {
          "value": 4
        },
        "opacity": {
          "value": 0.6
        }
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