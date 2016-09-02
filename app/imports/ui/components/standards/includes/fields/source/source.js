import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';

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
    return type === 'video';
  },
  file() {
    const source = this.source();
    return Files.findOne({ _id: source.fileId });
  },
  sourceFile() {
    debugger;
    const _id = this.fileId();
    return Files.find({ _id });
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
