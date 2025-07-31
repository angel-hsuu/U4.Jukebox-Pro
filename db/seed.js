import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("musiclover", "password123");
  const user2 = await createUser("audiophile", "treblebass");

  const playlist1 = await createPlaylist("Lo-Fi Vibes", "Chill beats", user1.id);
  const playlist2 = await createPlaylist("Workout", "Pump it up", user2.id);

  for (let i = 1; i <= 10; i++) {
    const track = await createTrack(`Track ${i}`, i * 10000);
    await createPlaylistTrack(playlist1.id, track.id);
    await createPlaylistTrack(playlist2.id, track.id);
  }
}