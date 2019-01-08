

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { first, last } from "../utils";

class EdgeCoordinatesProxy extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { onUpdated } = this.props;
		const edges = getEdges(moreProps);
		onUpdated(edges);
	}
	// eslint-disable-next-line no-unused-vars
	renderSVG(moreProps) {
		// TODO: The SVG equivalent
		return (<g></g>);
	}
	render() {
		return <GenericChartComponent
			edgeClip
			clip={false}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getAxisCanvas}
			drawOn={["pan"]}
		/>;
	}
}

EdgeCoordinatesProxy.propTypes = {
	onUpdated: PropTypes.func.isRequired,
};

function getEdges(moreProps) {
	const { plotData } = moreProps;
	return {
		first: first(plotData),
		last: last(plotData),
	};
}

export default EdgeCoordinatesProxy;
