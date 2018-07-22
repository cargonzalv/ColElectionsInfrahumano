import React, {Component} from "react";

import VegaLite from 'react-vega-lite';
/*https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/Colombia.topo.json
*/const spec = {
  "width":400,
  "height":400,
  "config": {
    "view": {
      "stroke": "transparent"
    }
  },
  "signals" : [
    {
      "name": "zoom",
      "init": 1.0,
      "verbose": true,
      "streams": [
        {"type": "wheel", "expr": "pow(1.001, event.deltaY*pow(16, event.deltaMode))"}
      ]
    }
  ],
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
          "value": 7
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
    spec.layer[1].transform = this.props.transform;
    spec.layer[1].encoding.size = this.props.size;
    
    spec.layer[1].data = {
      "url": "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/" +this.props.vuelta + "_vuelta_coord"+ (this.props.vuelta === "segunda"? "enada" : "") +"s.csv",
        "format": {
          "type": "csv"
        }
      }
		return(
      
			<VegaLite spec={spec} />
			)
	}

}
export default BarChart;