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
	if (turnstileToken !== 'unavailable') {
		const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				secret: env.TURNSTILE_SECRET_KEY,
				response: turnstileToken
			})
		});

		const result = await verification.json();
		if (!result.success) {
			return json({ error: 'Turnstile verification failed', codes: result['error-codes'] }, 403);
		}
	}

	// Build item list
	const itemLines = Array.isArray(items) && items.length > 0
		? items.map(i => `• ${i.name} (${i.type}) x${i.quantity}`).join('<br>')
		: '• No items listed';

	// Send email via Resend
	const emailRes = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.RESEND_API_KEY}`
		},
		body: JSON.stringify({
			from: 'Ocean Frontier <onboarding@resend.dev>',
			to: 'imad.farhat@hotmail.com',
			reply_to: email,
			subject: `New Inquiry from ${email}`,
			html: `
				<h2>New Inquiry — the Ocean Frontier</h2>
				<h3>Contact Details</h3>
				<p><strong>Email:</strong> ${email}<br>
				<strong>Phone:</strong> ${phone || 'Not provided'}<br>
				<strong>WhatsApp:</strong> ${whatsapp || 'Not provided'}</p>
				<h3>Requested Items</h3>
				<p>${itemLines}</p>
			`
		})
	});

	if (!emailRes.ok) {
		const err = await emailRes.text();
		console.error('Resend error:', err);
		return json({ error: 'Failed to send email. Please try again.' }, 500);
	}

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
