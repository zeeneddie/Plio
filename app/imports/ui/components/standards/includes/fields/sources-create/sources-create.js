import { Template } from 'meteor/templating';


const addProtocol = (url) => {
  if (url.search(/^https?\:\/\//) === -1) {
    return `http://${url}`;
  }
};

Template.ESSources_Create.viewmodel({
  mixin: ['urlRegex', 'modal'],
  sourceType: 'attachment',
  sourceFile: '',
  sourceUrl: '',
  sourceVideoUrl: '',
  label: 'Source file',
  attachmentTypes() {
    return [{
      id: 'attachment', label: 'Attachment'
    }, {
      id: 'url', label: 'URL link'
    }, {
      id: 'video', label: 'Video'
    }];
  },
  isSourceType(sourceType) {
    return this.sourceType() === sourceType;
  },
  isDocxFile() {
    const { name } = this.sourceFile() || {};
    return name && (name.split('.').pop().toLowerCase() === 'docx');
  },
  changeType(e) {
    const { id } = Blaze.getData(e.target);
    this.sourceType(id);
  },
  removeFile() {
    this.sourceFile('');
  },
  removeFileFn() {
    return this.removeFile.bind(this);
  },
  getData() {
    const sourceType = this.sourceType();
    const data = { sourceType };
    let sourceData;

    switch (sourceType) {
      case 'attachment':
        sourceData = { sourceFile: this.sourceFile() };
        break;
      case 'url':
        sourceData = { sourceUrl: addProtocol(this.sourceUrl()) };
        break;
      case 'video':
        sourceData = { sourceVideoUrl: addProtocol(this.sourceVideoUrl()) };
        break;
      default:
        sourceData = {};
        break;
    }

    _(data).extend(sourceData);

    return data;
  }
});
