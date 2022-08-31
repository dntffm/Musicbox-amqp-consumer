require('dotenv').config()

const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE
    });
  }


  async getPlaylistSongsById(playlistId, playlistOwner) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);

      return JSON.parse(result.rows);
    } catch (error) {
      const query = {
        text: 'SELECT songs.id, songs.title, songs.performer FROM songs JOIN playlistsongs ON playlistsongs.song_id = songs.id WHERE playlistsongs.playlist_id = $1',
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      return result.rows;
    }
  }
}

module.exports = PlaylistsService;
