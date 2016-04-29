import { Assets } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import Handlebars from 'handlebars';

export default class HandlebarsCompiledCache {
  constructor(templates) {
    this._cachedTemplates = {};
    _.forEach(templates, (sourcePath, templateName)=> {
      let source = Assets.getText(sourcePath);
      console.log(templateName, source);
      this._cachedTemplates[templateName] = Handlebars.compile(source);
    });
  }

  render(templateName, data = {}, helpers = false) {
    //register current helpers
    if (_.isObject(helpers)) {
      _.each(options.helpers, (helperFn, helperName) => {
        Handlebars.registerHelper(helperName, helperFn);
      });
    }

    return this._cachedTemplates[templateName](data);
  }
}