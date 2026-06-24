const store = globalThis.__AUTO_CALL_DEMANDES__ || [];
globalThis.__AUTO_CALL_DEMANDES__ = store;

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, demandes: store });
  }

  if (req.method === 'DELETE') {
    store.length = 0;
    return res.status(200).json({ ok: true, demandes: store });
  }

  if (req.method === 'POST') {
    const body = await readBody(req);
    const now = new Date();
    const demande = {
      id: body.id || String(Date.now()),
      createdAt: now.toISOString(),
      heure: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      nom: body.nom || body.identite || 'Client à identifier',
      telephone: body.telephone || 'Téléphone à confirmer',
      preference: body.preference || 'Non précisée',
      plaque: body.plaque || body.identite || 'Plaque / nom à confirmer',
      categorie: body.categorie || 'vehicule_pret',
      motif: body.motif || 'Suivi véhicule / véhicule prêt',
      resume: body.resume || 'Le client souhaite connaître l’avancement de son véhicule. Le secrétariat du garage doit vérifier le dossier et le recontacter.',
      statut: body.statut || 'À traiter',
      priorite: body.priorite || 'Normale',
      transcription: Array.isArray(body.transcription) ? body.transcription : []
    };
    store.unshift(demande);
    return res.status(200).json({ ok: true, demande, demandes: store });
  }

  return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
};
