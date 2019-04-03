import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { functor, last, first, hexToRGBA, head, plotDataLengthBarWidth } from "../utils";

class TimeDomainMarker extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {

		const props = this.props;

		const { fill, opacity, markers } = props;
		const { xScale, xAccessor, plotData, chartConfig: { height } } = moreProps;

		const getFill = functor(fill);

		const visibleMarkers = markers.reduce((filtered, marker) => {
			const { start, end } = marker;
			const startTime = start.getTime();
			const endTime = end.getTime();
			const bars = plotData.filter(d => {
				const { date } = d;
				const barTime = date.getTime();
				if (startTime <= barTime && endTime >= barTime) {
					return true;
				}
				return false;
			});
			if (bars.length > 0) {
				filtered.push({
					...marker,
					bars,
				});
			}
			return filtered;
		}, []);

		visibleMarkers.forEach(visibleMarker => {
			const firstBar = first(visibleMarker.bars);
			const lastBar = last(visibleMarker.bars);
			const x = Math.round(xScale(xAccessor(firstBar)));
			const x2 = Math.round(xScale(xAccessor(lastBar)));
			let width = x2 - x;
			if (width < 1) {
				width = 1;
			}
			const y = 0;
			const y2 = height;
			ctx.fillStyle = hexToRGBA(getFill(), opacity);
			ctx.fillRect(x, y, width, y2);
		});
	}
	// eslint-disable-next-line no-unused-vars
	renderSVG(moreProps) {
		// TODO: The SVG equivalent
		return (<g></g>);
	}
	render() {
		const { clip } = this.props;

		return (
			<GenericChartComponent
				clip={clip}
				svgDraw={this.renderSVG}

				canvasToDraw={getAxisCanvas}
				canvasDraw={this.drawOnCanvas}

				drawOn={["pan"]}
			/>
		);
	}
}

TimeDomainMarker.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func,
	]),
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func
	]),
	opacity: PropTypes.number,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]),
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]),
	markers: PropTypes.array,
	clip: PropTypes.bool.isRequired,
};

TimeDomainMarker.defaultProps = {
	baseAt: (xScale, yScale/* , d*/) => head(yScale.range()),
	width: plotDataLengthBarWidth,
	opacity: 0.2,
	fill: "#000000",
	className: "timeDomain",
	markers: [],
	clip: true,
};

export default TimeDomainMarker;