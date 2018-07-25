import _urlRegex_ from '../../../startup/client/mixins/urlRegex';

export default (url = '') => {
  if (_urlRegex_.isYoutubeUrl(url)) {
    const videoId = _urlRegex_.getIdFromYoutubeUrl(url);
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (_urlRegex_.isVimeoUrl(url)) {
    const videoId = _urlRegex_.getIdFromVimeoUrl(url);
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};
