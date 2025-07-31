import client from "../client.js";

export async function createPlaylistTrack(playlistId, trackId) {
  const { rows } = await client.query(
    `
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [playlistId, trackId]
  );
  return rows[0];
}

export async function getPlaylistsContainingTrack(trackId, userId) {
  const { rows } = await client.query(
    `
    SELECT playlists.*
    FROM playlists
    JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
    WHERE playlists_tracks.track_id = $1
    AND playlists.user_id = $2;
    `,
    [trackId, userId]
  );
  return rows;
}
