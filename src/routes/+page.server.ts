import { trainingCourses } from '$lib/data/trainingCourses';
import { gearItems } from '$lib/data/gearItems';
import { articles as localArticles } from '$lib/data/articles';
import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
	const apiUrl = env.OCEAN_FRONTIER_API_URL;
	const apiKey = env.OCEAN_FRONTIER_API_KEY;

	// Fall back to local data if env vars are not configured
	if (!apiUrl || !apiKey) {
		return { courses: trainingCourses, gear: gearItems, articles: localArticles };
	}

	const headers = { Authorization: `Bearer ${apiKey}` };

	try {
		const [coursesRes, gearRes, articlesRes] = await Promise.all([
			fetch(`${apiUrl}/api/ocean-frontier/courses`, { headers }),
			fetch(`${apiUrl}/api/ocean-frontier/gear`, { headers }),
			fetch(`${apiUrl}/api/ocean-frontier/articles`, { headers }).catch(() => null)
		]);

		if (!coursesRes.ok || !gearRes.ok) throw new Error('API error');

		const [courses, gear] = await Promise.all([coursesRes.json(), gearRes.json()]);
		const articles = articlesRes?.ok ? await articlesRes.json() : localArticles;

		return { courses, gear, articles };
	} catch {
		// Fall back to local data if API is unavailable
		return { courses: trainingCourses, gear: gearItems, articles: localArticles };
	}
}
