class ExportsListener {
  constructor(playlistService, mailsender) {
    this._playlistService = playlistService;
    this._mailsender = mailsender;

    this.listen = this.listen.bind(this);
  }

  // eslint-disable-next-line consistent-return
  async listen(message) {
    try {
      const { userId, playlistId, targetEmail } = JSON.parse(message.content.toString());

      const songs = await this._playlistService.getPlaylistSongsById(playlistId, userId);

      const result = await this._mailsender.sendEmail(targetEmail, JSON.stringify(songs));
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ExportsListener;
