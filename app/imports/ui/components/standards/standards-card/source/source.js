import { Template } from 'meteor/templating';

Template.SCSource.viewmodel({
  mixin: 'urlRegex',
  renderVideoSrc(url) {
    if (this.isYoutubeUrl(url)) {
      const videoId = this.getIdFromYoutubeUrl(url);
      url = `https://www.youtube.com/embed/${videoId}`;
    } else if (this.isVimeoUrl(url)) {
      const videoId = this.getIdFromVimeoUrl(url);
      console.log(videoId)
      console.log(`vimeo ${videoId}`)
      url = `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  }
});
