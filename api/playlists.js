import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
} from "#db/queries/playlists";

import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId, getTrackById } from "#db/queries/tracks";

import requireUser from "#middleware/requireUser";

router.use(requireUser);

router.route("/").get(async (req, res) => {
  const playlists = await getPlaylistsByUserId(req.user.id);
  res.send(playlists);
});

router.route("/").post(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Missing name or description");

  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  req.playlist = playlist || null;
  next();
});

router.route("/:id").get((req, res) => {
  if (!req.playlist || req.playlist.user_id !== req.user.id)
    return res.status(403).send("Forbidden");
  res.send(req.playlist);
});

router.route("/:id/tracks")
  .get(async (req, res) => {
    if (!req.playlist || req.playlist.user_id !== req.user.id)
      return res.status(403).send("Forbidden");

    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.playlist || req.playlist.user_id !== req.user.id)
      return res.status(403).send("Forbidden");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Missing trackId");

    const track = await getTrackById(trackId);
    if (!track) return res.status(400).send("Invalid trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
