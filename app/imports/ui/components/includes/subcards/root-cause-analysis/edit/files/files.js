import { Template } from 'meteor/templating';
import { Files } from '/imports/share/collections/files.js';

Template.RCA_Files_Edit.viewmodel({
  mixin: 'nonconformity',
  fileIds: [],
  uploaderMetaContext() {
    return {
      nonConformityId: this.NCId(),
    };
  },
  update({ ...args }, cb) {
    const renameFields = (obj, fieldRe) => {
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }

        const val = obj[key];
        if (fieldRe.test(key)) {
          obj[`rootCauseAnalysis.${key}`] = val;
          delete obj[key];
        } else if (_(val).isObject()) {
          renameFields(val, fieldRe);
        }
      }
    };

    renameFields(args, /^fileIds/);
    this.parent().update({ ...args }, cb);
  },
});
