// Cloudflare Pages Function — handles inquiry form submission with Turnstile verification

export async function onRequestPost(context) {
	const { request, env } = context;

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, 400);
	}

	const { email, phone, whatsapp, turnstileToken, items } = body;

	if (!email || !turnstileToken) {
		return json({ error: 'Missing required fields' }, 400);
	}

	// Verify Turnstile token
	const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			secret: env.TURNSTILE_SECRET_KEY,
			response: turnstileToken,
			remoteip: request.headers.get('CF-Connecting-IP')
		})
	});

	const result = await verification.json();

	if (!result.success) {
		return json({ error: 'Turnstile verification failed' }, 403);
	}

	// TODO: forward inquiry via email (e.g. via Resend, Mailchannels, etc.)
	// For now, log and return success
	console.log('New inquiry:', { email, phone, whatsapp, items });

	return json({ success: true });
}

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
