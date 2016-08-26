import { Template } from 'meteor/templating';


Template.IP_MeansStatement_Edit.viewmodel({
  mixin: 'organization',
  files: [],
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId()
    };
  },
  update({ ...args }, cb) {
    const renameFields = (obj, fieldRe) => {
      for (let key in obj) {
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

    renameFields(args, /^files/);
    this.parent().update({ ...args }, cb);
  }
})
