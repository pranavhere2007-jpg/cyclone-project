const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/active', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'active')
    .order('last_updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;