// Cloudflare Pages Function — replaces SvelteKit API route
// (adapter-static cannot serve dynamic server routes)

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours
let cache = null;

function parseDate(raw) {
	try {
		return new Date(raw).toISOString().split('T')[0];
	} catch {
		return '';
	}
}

async function fetchGUESchedule() {
	const url = 'https://www.gue.com/diver-training/gue-class-schedule?instructor_name=imad+farhat';
	const res = await fetch(url, {
		headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OceanFrontier/1.0)' }
	});

	if (!res.ok) throw new Error(`GUE fetch failed: ${res.status}`);

	const html = await res.text();

	const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
	const linkRegex = /<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
	const stripTags = (s) => s.replace(/<[^>]+>/g, '').trim();

	const classes = [];
	let rowMatch;

	while ((rowMatch = rowRegex.exec(html)) !== null) {
		const rowHtml = rowMatch[1];
		const tds = [];
		const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
		let tdMatch;

		while ((tdMatch = tdRe.exec(rowHtml)) !== null) {
			tds.push(tdMatch[1]);
		}

		if (tds.length < 4) continue;

		const titleLinkMatch = linkRegex.exec(tds[0]);
		if (!titleLinkMatch) continue;

		const cid = (titleLinkMatch[1].match(/cid=(\d+)/) ?? [])[1] ?? '';
		const title = stripTags(titleLinkMatch[2]);
		const dateRaw = stripTags(tds[1]);
		const location = stripTags(tds[2]);
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

export async function onRequestGet() {
	const now = Date.now();

	if (cache && now - cache.ts < CACHE_TTL) {
		return new Response(JSON.stringify(cache.data), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	try {
		const data = await fetchGUESchedule();
		cache = { data, ts: now };
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	} catch {
		if (cache) {
			return new Response(JSON.stringify(cache.data), {
				headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
			});
		}
		return new Response(JSON.stringify([]), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}
}
