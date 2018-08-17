import { Template } from 'meteor/templating';

Template.NC_Ref_Edit.viewmodel({
  mixin: 'urlRegex',
  text: '',
  url: '',
  updateText(e) {
    const { text } = this.data();
    const context = this.templateInstance.data;

    if (!text) return;
    if (text === context.text) return;
    if (!this._id) return;

    this.parent().update({ 'ref.text': text, e, withFocusCheck: true });
  },
  updateUrl(e) {
    let { url } = this.data();
    const context = this.templateInstance.data;

    if (url === context.url) return;
    if (!this._id) return;
    if (url) {
      if (url.search(/^https?\:\/\//) === -1) {
        url = `http://${url}`;
      }

      if (!this.isValidUrl(url)) {
        ViewModel.findOne('ModalWindow').setError('Url is not valid!');
        return;
      }
    } else {
      url = null;
    }

    this.parent().update({ 'ref.url': url, e, withFocusCheck: true });
  },
});
