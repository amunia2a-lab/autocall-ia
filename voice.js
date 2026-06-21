function twiml(xml) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.status(200).send(twiml(`
<Response>
  <Gather input="speech" language="fr-FR" speechTimeout="auto" timeout="6" action="/api/collect?step=motif" method="POST">
    <Say language="fr-FR" voice="alice">
      Bonjour, vous êtes bien chez Point S Alata.
      Je suis l'assistante virtuelle du garage.
      Pour ce test AutoCall, pouvez-vous me dire la raison de votre appel ?
    </Say>
  </Gather>
  <Say language="fr-FR" voice="alice">
    Je n'ai pas entendu votre réponse. Notre équipe vous recontactera prochainement. Merci, au revoir.
  </Say>
</Response>`));
};
