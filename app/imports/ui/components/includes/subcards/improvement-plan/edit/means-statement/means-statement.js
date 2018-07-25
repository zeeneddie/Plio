import { Template } from 'meteor/templating';
import { Files } from '/imports/share/collections/files.js';

Template.IP_MeansStatement_Edit.viewmodel({
  mixin: 'organization',
  fileIds: [],
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
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
          obj[`improvementPlan.${key}`] = val;
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
