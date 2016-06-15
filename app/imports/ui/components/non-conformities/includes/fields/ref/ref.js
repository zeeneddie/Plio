import { Template } from 'meteor/templating';

Template.NCRef.viewmodel({
  mixin: 'urlRegex',
  text: '',
  url: '',
  update() {
    let { text, url } = this.data();

    if (!text || !url) return;

    if (text === this.templateInstance.data.text && url === this.templateInstance.data.url) return;

    if (!this._id) return;

    if (url.search(/^https?\:\/\//) === -1) {
      url = `http://${url}`;
    }

    if (!!url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('Url is not valid!');
      return;
    }

    const ref = { text, url };

    this.parent().update({ ref });
  }
});
