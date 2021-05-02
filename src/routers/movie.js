const express = require('express');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/movies', auth, async (req, res) => {
  const movie = new Movie(req.body);

  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/movies', auth, async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/movies/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const movie = await Movie.findOne({ _id });

    if (!movie) {
      return res.status(404).send();
    }

    res.send(movie);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/movies/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'year'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const movie = await Movie.findOne({ _id: req.params.id });

    if (!movie) {
      return res.status(404).send();
    }

    updates.forEach((update) => (movie[update] = req.body[update]));
    await movie.save();
    res.send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/movies/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id });

    if (!movie) {
      res.status(404).send();
    }

    res.send(movie);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
