import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

import { insert } from '/imports/api/standards/methods';
import { setModalError, inspire, pickDeep } from '/imports/api/helpers';
import { insert as insertFile } from '/imports/api/files/methods';
import UploadService from '/imports/ui/utils/uploads/UploadService';
import {
  openStandardByFilter,
} from '/imports/ui/react/standards/containers/StandardsDataLoader/helpers';
import store, { getState } from '/client/redux/store';


Template.CreateStandard.viewmodel({
  mixin: ['standard', 'numberRegex', 'organization', 'router', 'getChildrenData', 'modal', 'store'],
  save() {
    const data = this.getChildrenData();

    const { sourceType, sourceFile, sourceUrl, sourceVideoUrl } = data;
    const isSourcePresent = _.every([
      sourceType,
      sourceFile || sourceUrl || sourceVideoUrl,
    ]);
    if (!isSourcePresent) {
      setModalError(
        'The new standard cannot be created without a source file. ' +
        'Please add a source file to your standard.'
      );
      return;
    }

    for (let key in data) {
      if (!data[key]) {
        let errorMessage;
        if (key === 'title') {
          errorMessage = `The new standard cannot be created without a title. Please enter a title for your standard`;
          setModalError(errorMessage);
          return;
        } else if (key === 'sectionId') {
          errorMessage = `The new standard cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
          setModalError(errorMessage);
          return;
        } else if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new standard type in Org settings`;
          setModalError(errorMessage);
          return;
        } else {
          const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
          setModalError(errorMessage);
          return;
        }
      }
    }

    this.insert(data);
  },
  insert(args) {
    const { title, sourceType, sourceFile } = args;

    const number = this.parseNumber(title);
    const nestingLevel = (number && number[0].split('.').length) || 1;

    if (nestingLevel > 4) {
      setModalError('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    _(args).extend({ nestingLevel });

    if ((sourceType === 'attachment') && sourceFile) {
      this.modal().callMethod(insertFile, {
        name: sourceFile.name,
        extension: sourceFile.name.split('.').pop().toLowerCase(),
        organizationId: this.organizationId(),
      }, (err, fileId) => {
        if (!err && fileId) {
          this._insertStandard({ ...args, fileId });
        }
      });
    } else {
      this._insertStandard(args);
    }
  },
  _insertStandard(args) {
    const {
      title, sectionId, typeId,
      owner, status, nestingLevel,
      sourceType, sourceFile, sourceUrl,
      sourceVideoUrl, fileId,
    } = args;

    const source1 = { type: sourceType };
    if (sourceType === 'attachment') {
      _(source1).extend({ fileId });
    } else {
      const url = {
        url: sourceUrl,
        video: sourceVideoUrl,
      }[sourceType];
      _(source1).extend({ url });
    }

    const standardArgs = {
      title,
      sectionId,
      typeId,
      owner,
      status,
      nestingLevel,
      source1,
      ...inspire(['organizationId'], this),
    };

    const cb = (_id, open) => {
      if (sourceFile && fileId) {
        this._uploadFile(sourceFile, fileId, _id);
      }

      this.isActiveStandardFilter('deleted')
        ? this.goToStandard(_id, false)
        : this.goToStandard(_id);

      openStandardByFilter({
        dispatch: this.store().dispatch,
        ...pickDeep([
          'standards.standards',
          'standards.sections',
          'standards.types',
          'global.filter',
          'global.urlItemId',
        ])(this.getState()),
      });

      open({
        _id,
        _title: 'Standard',
        template: 'EditStandard',
      });
    };

    invoke(this.card, 'insert', insert, standardArgs, cb);
  },
  _uploadFile(file, fileId, standardId) {
    const uploadService = new UploadService({
      slingshotDirective: 'standardFiles',
      slingshotContext: {
        standardId,
        organizationId: this.organizationId(),
      },
      maxFileSize: Meteor.settings.public.otherFilesMaxSize,
      hooks: {
        afterUpload: (__, url) => {
          const fileName = file.name;
          const extension = fileName.split('.').pop().toLowerCase();
          if (extension === 'docx') {
            this._launchDocxRendering(url, fileName, standardId);
          }
        },
      },
    });

    uploadService.uploadExisting(fileId, file);
  },
  _launchDocxRendering(fileUrl, fileName, standardId) {
    Meteor.call('Mammoth.convertStandardFileToHtml', {
      fileUrl,
      htmlFileName: fileName + '.html',
      source: 'source1',
      standardId,
    }, (error, result) => {
      if (error) {
        // HTTP errors
        toastr.error(`Failed to get .docx file: ${error}`);
      } else {
        if (result.error) {
          // Mammoth errors
          toastr.error(`Rendering document: ${result.error}`);
        }
      }
    });
  }
});
