import { Template } from 'meteor/templating';

Template.ESSources.viewmodel({
  mixin: 'urlRegex',
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('url');
    }
  },
  sourceType: 'url',
  sourceUrl: '',
  changeType(type) {
    this.sourceType(type);
    this.update();
  },
  update() {
    let { type, url } = this.getData();

    if (url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('Url is not valid!');
      return;
    }

    const query = {};

    query[`source${this.id()}`] = { type, url };

    this.parent().update(query);
  },
  getData() {
    const { sourceType:type, sourceUrl:url } = this.data();
    return { type, url };
  }
});
