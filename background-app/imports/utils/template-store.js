import get from 'lodash.get';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

import { getAssetsPath } from '../helpers';


const TEMPLATES_DIR = 'templates';

export default TemplateStore = {

  _store: {},

  getTemplate(key, language = 'en') {
    return get(this._store, `${language}.${key}`);
  },

  loadTemplates() {
    const templatesDir = path.join(getAssetsPath(), TEMPLATES_DIR);
    this._readTemplateDir(templatesDir);
  },

  _readTemplateDir(dir, parentObj) {
    parentObj = parentObj || this._store;
    let entries;

    try {
      entries = fs.readdirSync(dir);
    } catch (err) {
      console.log(`Failed to read directory ${dir}:`);
      console.log(err);
      return;
    }

    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry);
      let stat;

      try {
        stat = fs.statSync(entryPath);
      } catch (err) {
        console.log(`Failed to read filesystem entry ${entryPath}:`);
        console.log(err);
        return;
      }

      if (stat.isDirectory()) {
        parentObj[entry] = {};
        this._readTemplateDir(entryPath, parentObj[entry]);
      } else if (stat.isFile()) {
        this._readTemplateFile(entryPath, parentObj);
      }
    });
  },

  _readTemplateFile(filePath, parentObj) {
    let relativePath = filePath.replace(getAssetsPath(), '');
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.slice(1);
    }

    const source = Assets.getText(relativePath).trim();
    const template = Handlebars.compile(source);
    const fileName = path.basename(filePath, path.extname(filePath));

    parentObj[fileName] = template;
  },

};
