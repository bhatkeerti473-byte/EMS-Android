const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { createInvoiceForBooking } = require('../services/billingService');

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    let invoice = null;
    if (req.body.status === 'Approved') {
      invoice = await createInvoiceForBooking(booking);
    }

    const response = booking.toObject();
    if (invoice) {
      response.invoice = invoice;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.userId && payload.client_id) payload.userId = payload.client_id;
    if (!payload.client_id && payload.userId) payload.client_id = payload.userId;
    if (!payload.clientEmail && payload.email) payload.clientEmail = payload.email;

    const booking = new Booking(payload);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create booking', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update booking', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled', bookingId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
