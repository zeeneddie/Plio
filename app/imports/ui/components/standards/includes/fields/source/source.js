import { Template } from 'meteor/templating';

Template.SCSource.viewmodel({
  mixin: ['urlRegex', 'iframe'],
  title() {
    const id = this.id && this.id();
    if (!id) {
      return;
    }
    return id === 1 ? 'Source file' : `Source file ${this.id()}`;
  },
  isVideo(type) {
    console.log('type', type);
    return type === 'video';
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
