import { trainingCourses } from '$lib/data/trainingCourses';
import { gearItems } from '$lib/data/gearItems';
import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
	const apiUrl = env.OCEAN_FRONTIER_API_URL;
	const apiKey = env.OCEAN_FRONTIER_API_KEY;

	// Fall back to local data if env vars are not configured
	if (!apiUrl || !apiKey) {
		return { courses: trainingCourses, gear: gearItems };
	}

	try {
		const [coursesRes, gearRes] = await Promise.all([
			fetch(`${apiUrl}/api/ocean-frontier/courses`, {
				headers: { Authorization: `Bearer ${apiKey}` }
			}),
			fetch(`${apiUrl}/api/ocean-frontier/gear`, {
				headers: { Authorization: `Bearer ${apiKey}` }
			})
		]);

		if (!coursesRes.ok || !gearRes.ok) throw new Error('API error');

		const [courses, gear] = await Promise.all([coursesRes.json(), gearRes.json()]);
		return { courses, gear };
	} catch {
		// Fall back to local data if API is unavailable
		return { courses: trainingCourses, gear: gearItems };
	}
}
