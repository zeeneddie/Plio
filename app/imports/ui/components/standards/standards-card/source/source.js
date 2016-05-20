import { Template } from 'meteor/templating';

Template.SCSource.viewmodel({
  mixin: 'urlRegex',
  title() {
    const id = this.id();
    return id === 1 ? 'Source file' : `Source file ${this.id()}`;
  },
  renderVideoSrc(url) {
    if (!this.source() || this.source().type !== 'video') {
      return '';
    }
    if (this.isYoutubeUrl(url)) {
      const videoId = this.getIdFromYoutubeUrl(url);
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (this.isVimeoUrl(url)) {
      const videoId = this.getIdFromVimeoUrl(url);
      url = `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  }
});
