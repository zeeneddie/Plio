import { Template } from 'meteor/templating';
import { mergeDeepLeft } from 'ramda';
import { swal } from '../../../../../client/util';
import { client } from '../../../../../client/apollo';

import {
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification,
  // TODO fix linkStandard, unlinkStandard import
  // eslint-disable-next-line import/named
  linkStandard,
  // eslint-disable-next-line import/named
  unlinkStandard,
  linkDocument,
  unlinkDocument,
  setCompletionDate,
  setCompletionExecutor,
  setVerificationDate,
  setVerificationExecutor,
} from '../../../../../api/actions/methods';
import { getTzTargetDate } from '../../../../../share/helpers';
import { ActionTypes, DocumentTypes } from '../../../../../share/constants';
import {
  deleteActionFromGoalFragment,
  updateActionFragment,
} from '../../../../../client/apollo/utils';
import { Fragment } from '../../../../../client/graphql';

const updateFragment = (actionId, action) => {
  updateActionFragment(mergeDeepLeft(action), {
    id: actionId,
    fragment: Fragment.DASHBOARD_ACTION,
  }, client);
};

Template.Actions_Edit.viewmodel({
  mixin: ['organization', 'workInbox', 'modal',
    'callWithFocusCheck', 'router', 'collapsing', 'utils'],
  isLinkedToEditable: true,
  action() {
    return this._getActionByQuery({ _id: this._id() });
  },
  isCompletionEditable(isVerified) {
    return !isVerified;
  },
  slingshotDirective: 'actionFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      action: this._id(),
    };
  },
  callUpdate(method, args = {}, cb = () => {}) {
    const _id = this._id();
    this.modal().callMethod(method, { _id, ...args }, cb);
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({
    query = {}, options = {}, e = {}, withFocusCheck = false, ...args
  }, cb = () => {}) {
    const updateFn = () => this.callUpdate(update, { query, options, ...args }, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  getCompleteFn() {
    return ({ ...args }, cb) => this.callUpdate(complete, { ...args }, cb);
  },
  getUndoCompletionFn() {
    return cb => this.callUpdate(undoCompletion, {}, cb);
  },
  getVerifyFn() {
    return ({ ...args }, cb) => this.callUpdate(verify, { ...args }, cb);
  },
  getUndoVerificationFn() {
    return cb => this.callUpdate(undoVerification, {}, cb);
  },
  getLinkStandardFn() {
    return ({ standardId }, cb) => {
      this.callUpdate(linkStandard, { standardId }, cb);
    };
  },
  getUnlinkStandardFn() {
    return ({ standardId }, cb) => {
      this.callUpdate(unlinkStandard, { standardId }, cb);
    };
  },
  getLinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.callUpdate(linkDocument, { documentId, documentType }, cb);
    };
  },
  getUnlinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.callUpdate(unlinkDocument, { documentId, documentType }, cb);
    };
  },
  getUpdateCompletionDateFn() {
    return ({ targetDate }, cb) => {
      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(targetDate, timezone);

      this.callUpdate(setCompletionDate, { targetDate: tzDate }, (err, res) => {
        if (cb) cb(err, res);
        if (!err) {
          try {
            updateFragment(this._id(), { completionTargetDate: tzDate });
          } catch (e) {
            // if dashboard page was not visited before in the current session
            // this will break without try/catch
          }
        }
      });
    };
  },
  getUpdateTitleFn() {
    return newAction => updateFragment(this._id(), newAction);
  },
  getUpdateCompletionExecutorFn() {
    return ({ userId }, cb) => {
      this.callUpdate(setCompletionExecutor, { userId }, cb);
    };
  },
  getUpdateVerificationDateFn() {
    return ({ targetDate }, cb) => {
      const { timezone } = this.organization();
      const tzDate = getTzTargetDate(targetDate, timezone);

      this.callUpdate(setVerificationDate, { targetDate: tzDate }, cb);
    };
  },
  getUpdateVerificationExecutorFn() {
    return ({ userId }, cb) => {
      this.callUpdate(setVerificationExecutor, { userId }, cb);
    };
  },
  remove() {
    const { title, type, linkedTo } = this.action();
    const _id = this._id();

    swal(
      {
        title: 'Are you sure?',
        text: `An action "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) {
            swal.close();
            return;
          }

          if (type === ActionTypes.GENERAL_ACTION) {
            linkedTo.forEach(({ documentId, documentType }) => {
              if (documentType === DocumentTypes.GOAL) {
                try {
                  deleteActionFromGoalFragment(documentId, _id, client);
                } catch (e) {
                  // if dashboard page was not visited before in the current session
                  // this will break without try/catch
                }
              }
            });
          }

          swal.success('Removed', `An action "${title}" was removed successfully.`);

          this.modal().close();
        });
      },
    );
  },
});
