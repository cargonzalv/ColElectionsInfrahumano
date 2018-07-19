import React, {Component} from "react";


import VegaLite from 'react-vega-lite';

const spec = {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar"
};


class BarChart extends Component {

	render() {
		spec.encoding = this.props.encoding;
		return(
			<VegaLite spec={spec} data={this.props.data} />
			)
	}

}
export default BarChart;