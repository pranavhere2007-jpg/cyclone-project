const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/latest', async (req, res) => {
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'active')
    .order('last_updated_at', { ascending: false })
    .limit(1)
    .single();

  if (eventErr) return res.status(404).json({ error: 'No active event found' });

  const { data: inferences, error: infErr } = await supabase
    .from('inferences')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false });

  if (infErr) return res.status(500).json({ error: infErr.message });

  const latestByType = {};
  for (const inf of inferences) {
    if (!latestByType[inf.model_type]) latestByType[inf.model_type] = inf;
  }

  res.json({ event, inferences: Object.values(latestByType) });
});

router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (eventErr) return res.status(404).json({ error: 'Event not found' });

  const { data: inferences } = await supabase
    .from('inferences')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  const { data: simulation } = await supabase
    .from('simulations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  res.json({ event, inferences, simulation: simulation || null });
});

router.get('/:eventId/track', async (req, res) => {
  const { eventId } = req.params;

  const { data, error } = await supabase
    .from('simulations')
    .select('predicted_track, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'No simulation found for this event' });

  res.json(data);
});

module.exports = router;