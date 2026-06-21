function twiml(xml) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return Object.fromEntries(new URLSearchParams(raw));
}

module.exports = async function handler(req, res) {
  const step = req.query.step || 'motif';
  const body = await readBody(req);
  const speech = body.SpeechResult || '';
  const from = body.From || '';
  const callSid = body.CallSid || '';

  // Visible dans Vercel > Functions > Logs
  console.log('AutoCall appel reçu', {
    step,
    from,
    callSid,
    speech,
    date: new Date().toISOString()
  });

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');

  if (step === 'motif') {
    return res.status(200).send(twiml(`
<Response>
  <Gather input="speech" language="fr-FR" speechTimeout="auto" timeout="6" action="/api/collect?step=plaque" method="POST">
    <Say language="fr-FR" voice="alice">
      Merci. J'ai bien noté votre demande : ${escapeXml(speech)}.
      Pouvez-vous maintenant me communiquer votre plaque d'immatriculation ?
    </Say>
  </Gather>
  <Say language="fr-FR" voice="alice">
    Merci. Notre équipe vous recontactera prochainement. Au revoir.
  </Say>
</Response>`));
  }

  if (step === 'plaque') {
    return res.status(200).send(twiml(`
<Response>
  <Gather input="speech" language="fr-FR" speechTimeout="auto" timeout="6" action="/api/collect?step=disponibilites" method="POST">
    <Say language="fr-FR" voice="alice">
      Très bien. J'ai noté la plaque : ${escapeXml(speech)}.
      Avez-vous des disponibilités particulières pour être rappelé ?
    </Say>
  </Gather>
  <Say language="fr-FR" voice="alice">
    Merci. Notre équipe vous recontactera prochainement. Au revoir.
  </Say>
</Response>`));
  }

  return res.status(200).send(twiml(`
<Response>
  <Say language="fr-FR" voice="alice">
    Parfait, votre demande est bien enregistrée.
    Notre secrétariat vous recontactera prochainement.
    Merci pour votre appel et à bientôt.
  </Say>
</Response>`));
};
