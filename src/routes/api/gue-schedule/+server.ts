import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface GUEClass {
	title: string;
	date: string;
	dateIso: string;
	location: string;
	cid: string;
	url: string;
}

// Simple in-memory cache
let cache: { data: GUEClass[]; ts: number } | null = null;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

function parseDate(raw: string): string {
	try {
		return new Date(raw).toISOString().split('T')[0];
	} catch {
		return '';
	}
}

async function fetchGUESchedule(): Promise<GUEClass[]> {
	const url = 'https://www.gue.com/diver-training/gue-class-schedule?instructor_name=imad+farhat';
	const res = await fetch(url, {
		headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OceanFrontier/1.0)' }
	});

	if (!res.ok) throw new Error(`GUE fetch failed: ${res.status}`);

	const html = await res.text();

	// Match every <tr> that contains course data
	const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
	const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
	const linkRegex = /<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
	const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').trim();

	const classes: GUEClass[] = [];
	let rowMatch: RegExpExecArray | null;

	while ((rowMatch = rowRegex.exec(html)) !== null) {
		const rowHtml = rowMatch[1];
		const tds: string[] = [];
		let tdMatch: RegExpExecArray | null;
		const tdRe = new RegExp(tdRegex.source, 'gi');

		while ((tdMatch = tdRe.exec(rowHtml)) !== null) {
			tds.push(tdMatch[1]);
		}

		if (tds.length < 4) continue;

		// Column 0: course title + link
		const titleLinkMatch = linkRegex.exec(tds[0]);
		if (!titleLinkMatch) continue;

		const cid = (titleLinkMatch[1].match(/cid=(\d+)/) ?? [])[1] ?? '';
		const title = stripTags(titleLinkMatch[2]);

		// Column 1: date
		const dateRaw = stripTags(tds[1]);

		// Column 2: location
		const location = stripTags(tds[2]);

		// Column 3: instructor — confirm it's Imad Farhat
		const instructor = stripTags(tds[3]);
		if (!instructor.toLowerCase().includes('imad')) continue;

		if (!title || !dateRaw) continue;

		classes.push({
			title,
			date: dateRaw,
			dateIso: parseDate(dateRaw),
			location,
			cid,
			url: cid ? `https://www.gue.com/gue-class-schedule/class-details?cid=${cid}` : ''
		});
	}

	return classes;
}

export const GET: RequestHandler = async () => {
	const now = Date.now();

	if (cache && now - cache.ts < CACHE_TTL) {
		return json(cache.data);
	}

	try {
		const data = await fetchGUESchedule();
		cache = { data, ts: now };
		return json(data);
	} catch (err) {
		// Return cached stale data if available, else empty
		if (cache) return json(cache.data);
		return json([]);
	}
};
