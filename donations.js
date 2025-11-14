const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

router.post('/', async (req, res) => {
  try {
    const d = new Donation(req.body);
    await d.save();
    res.status(201).json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radiusKm) || 10;

    const all = await Donation.find().lean();

    let filtered = all.filter(item => {
      if (!q) return true;
      const hay = (item.title + ' ' + item.description + ' ' + (item.foodType||'')).toLowerCase();
      return q.split(/\s+/).every(tok => hay.includes(tok));
    });

    if (!isNaN(lat) && !isNaN(lng)) {
      filtered = filtered.map(item => {
        const d = haversine(lat, lng, item.lat, item.lng);
        return { ...item, distanceKm: d };
      }).filter(item => item.distanceKm <= radiusKm)
        .sort((a,b) => a.distanceKm - b.distanceKm);
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
