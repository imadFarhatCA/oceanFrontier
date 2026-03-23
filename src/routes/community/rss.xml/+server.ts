import { articles } from '$lib/data/articles';

export const prerender = true;

export function GET() {
	const siteUrl = 'https://theoceanfrontier.com';

	const items = articles
		.map(
			(article) => `
		<item>
			<title><![CDATA[${article.title}]]></title>
			<link>${siteUrl}/community/${article.id}</link>
			<guid isPermaLink="true">${siteUrl}/community/${article.id}</guid>
			<description><![CDATA[${article.excerpt}]]></description>
			<category>${article.category}</category>
			<author>${article.author}</author>
			<pubDate>${new Date(article.date).toUTCString()}</pubDate>
		</item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>the Ocean Frontier — Community</title>
		<link>${siteUrl}/community</link>
		<description>Dive stories, gear reviews, training insights and news from the Ocean Frontier GUE community.</description>
		<language>en</language>
		<atom:link href="${siteUrl}/community/rss.xml" rel="self" type="application/rss+xml"/>
		${items}
	</channel>
</rss>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
