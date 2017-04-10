// cannot import it because of Meteor's bug
// import { Assets } from 'meteor/meteor';

import { _ } from 'meteor/underscore';
import Handlebars from 'handlebars';


export default HandlebarsCache = {

  _cachedTemplates: {},

  addTemplate(sourcePath, templateName) {
    const source = Assets.getText(sourcePath);
    this._cachedTemplates[templateName] = Handlebars.compile(source);
  },

  addTemplates(templates) {
    _(templates).each((sourcePath, templateName) => {
      this.addTemplate(sourcePath, templateName);
    });
  },

  render(templateName, data = {}, helpers = false) {
    //register current helpers
    if (_(helpers).isObject()) {
      _(helpers).each((helperFn, helperName) => {
        Handlebars.registerHelper(helperName, helperFn);
      });
    }
    return this._cachedTemplates[templateName] && this._cachedTemplates[templateName](data);
  }

};
