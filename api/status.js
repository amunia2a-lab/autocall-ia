module.exports = async function handler(req, res) {
  res.status(200).json({ ok: true, service: 'AutoCall AI V15', message: 'API opérationnelle', demandes: (globalThis.__AUTO_CALL_DEMANDES__ || []).length });
};
