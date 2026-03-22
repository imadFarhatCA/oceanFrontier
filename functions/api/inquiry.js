// Cloudflare Pages Function — handles inquiry form submission with Turnstile verification
// Uses Cloudflare Email Workers (send_email binding) — no third-party email service needed

import { EmailMessage } from 'cloudflare:email';

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

	// Verify Turnstile token (skip if unavailable — fallback set client-side)
	if (turnstileToken !== 'unavailable') {
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
	}

	// Build item list
	const itemLines = Array.isArray(items) && items.length > 0
		? items.map(i => `  • ${i.name} (${i.type}) x${i.quantity}`).join('\r\n')
		: '  No items listed';

	// Build raw MIME email
	const emailBody =
		`New inquiry received from the Ocean Frontier website.\r\n` +
		`\r\n` +
		`CONTACT DETAILS\r\n` +
		`───────────────\r\n` +
		`Email:     ${email}\r\n` +
		`Phone:     ${phone || 'Not provided'}\r\n` +
		`WhatsApp:  ${whatsapp || 'Not provided'}\r\n` +
		`\r\n` +
		`REQUESTED ITEMS\r\n` +
		`───────────────\r\n` +
		`${itemLines}\r\n`;

	const rawEmail =
		`From: Ocean Frontier Inquiries <inquiries@theoceanfrontier.com>\r\n` +
		`To: imad.farhat@hotmail.com\r\n` +
		`Reply-To: ${email}\r\n` +
		`Subject: New Inquiry from ${email}\r\n` +
		`MIME-Version: 1.0\r\n` +
		`Content-Type: text/plain; charset=utf-8\r\n` +
		`\r\n` +
		emailBody;

	const encoded = new TextEncoder().encode(rawEmail);

	const message = new EmailMessage(
		'inquiries@theoceanfrontier.com',
		'imad.farhat@hotmail.com',
		new ReadableStream({
			start(controller) {
				controller.enqueue(encoded);
				controller.close();
			}
		})
	);

	try {
		await env.SEND_EMAIL.send(message);
	} catch (err) {
		console.error('Email send error:', err);
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
