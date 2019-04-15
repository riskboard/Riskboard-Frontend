import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../styles/rb-header.scss';

export default () => {
	return (
		<header className="rb-header">
			<div className="rb-header-logo">
				<a href={`${process.env.PUBLIC_URL}`}><img src={`${process.env.PUBLIC_URL}/riskLogo.jpg`} /></a>
			</div>
		</header>
	);
}