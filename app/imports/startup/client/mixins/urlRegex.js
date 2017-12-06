import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const vimeoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

export default {
  isValidUrl(url) {
    return SimpleSchema.RegEx.Url.test(url);
  },
  isYoutubeUrl(url) {
    return youtubeRegex.test(url);
  },
  getIdFromYoutubeUrl(url) {
    const videoId = url.match(youtubeRegex)[1];
    if (!videoId) return '';
    return videoId;
  },
  isVimeoUrl(url) {
    return vimeoRegex.test(url);
  },
  getIdFromVimeoUrl(url) {
    const match = url.match(vimeoRegex);
    if (!match) return false;
    return match[4];
  },
};
