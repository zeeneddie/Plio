export default (base) => class extends base {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'files':
          this._filesChanged(diff);
        case 'files.$.url':
          this._fileUrlChanged(diff);
      }
    });

    super._buildLogs();
  }

  _filesChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { kind, item:file } = diff;
    const { name, url } = file || {};

    if ((kind === ITEM_ADDED) && !url) {
      diff.isProcessed = true;
      return;
    }

    let message;
    if (kind === ITEM_ADDED) {
      message = name ? `File ${name} uploaded` : 'File uploaded';
    } else if (kind === ITEM_REMOVED) {
      message = name ? `File ${name} removed` : 'File removed';
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _fileUrlChanged(diff) {
    const getFileName = (doc, fileUrl) => {
      let name;

      for (let key in doc) {
        if (!doc.hasOwnProperty(key)) continue;

        const val = doc[key];
        if ((key === 'url') && (val === fileUrl)) {
          name = doc['name'];
          break;
        } else if (_(val).isObject()) {
          name = getFileName(val, fileUrl);
          if (name) break;
        }
      }

      return name;
    };

    const { field, oldValue, newValue } = diff;

    if (!oldValue && newValue) {
      const name = getFileName(this._newDoc, newValue);

      this._createLog({
        message: `File ${name} uploaded`,
        field
      });

      diff.isProcessed = true;
    }
  }

  static get _fieldLabels() {
    const fieldLabels = {
      files: 'Files',
      'files.$.extension': 'File extension',
      'files.$.name': 'File name',
      'files.$.url': 'File url',
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

}
