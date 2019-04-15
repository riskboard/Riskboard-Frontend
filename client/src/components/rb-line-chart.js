import React, { Component } from 'react';
import ReactChartkick, { LineChart } from 'react-chartkick'
import Chart from 'chart.js'

ReactChartkick.addAdapter(Chart)

export default (props) => {
	const data = props.data;
	return <LineChart data={data} />
}