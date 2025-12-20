import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function ComingSoon() {
	return (
		<Layout title="Coming Soon" description="English version under construction">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '60vh',
					textAlign: 'center',
					padding: '2rem',
				}}>
				<h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</h1>
				<h1 style={{ marginBottom: '1.5rem' }}>English Version Coming Soon</h1>
				<p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
					The English translation of the Learn Prompting × HumblebeeAI Collaboration Edition is currently in development.
				</p>
				<p style={{ marginBottom: '2rem', color: 'var(--ifm-color-emphasis-700)' }}>
					We are working hard to bring you high-quality content. Please check back later!
				</p>
				<Link className="button button--primary button--lg" to="/">
					Go Back to Uzbek Version
				</Link>
			</div>
		</Layout>
	);
}
