import { Template } from 'meteor/templating';

Template.NCRef.viewmodel({
  mixin: ['urlRegex', 'callWithFocusCheck'],
  text: '',
  url: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      let { text, url } = this.data();
      const context = this.templateInstance.data;

      if (!text || !url) return;

      if (text === context.text && url === context.url) return;

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
    });
  }
});
