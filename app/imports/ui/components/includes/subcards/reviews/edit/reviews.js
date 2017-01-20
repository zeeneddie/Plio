import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { Reviews } from '/imports/share/collections/reviews';
import { insert, update, remove } from '/imports/api/reviews/methods';
import { invokeId } from '/imports/api/helpers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.Subcards_Reviews_Edit.viewmodel({
  mixin: ['modal', 'date', 'organization', 'nonconformity'],
  wrapperArgs() {
    const items = invoke(this.reviews(), 'fetch');

    return {
      items,
      addText: 'Add a new review',
      renderContentOnInitial: !(items.length > 15),
      _lText: 'Reviews',
      _rText: items.length,
      onAdd: this.onAdd.bind(this),
      getSubcardArgs: this.getSubcardArgs.bind(this),
    };
  },
  getSubcardArgs(doc) {
    return {
      doc,
      ...doc,
      _lText: this.renderText(doc),
      content: 'Subcards_Review',
      insertFn: this.insert.bind(this),
      updateFn: this.update.bind(this),
      removeFn: this.remove.bind(this),
    };
  },
  renderText({ reviewedAt }) {
    return `<strong>Review on ${this.renderDate(reviewedAt)}</strong>`;
  },
  reviews() {
    const query = {
      documentId: this.documentId(),
      documentType: this.documentType(),
    };
    const options = { sort: { reviewedAt: 1 } };

    return Reviews.find(query, options);
  },
  onAdd(add) {
    return add(
      'Subcard',
      {
        content: 'Subcards_Review',
        _lText: 'New review',
        isNew: false,
        insertFn: this.insert.bind(this),
        updateFn: this.update.bind(this),
        removeFn: this.remove.bind(this),
      }
    );
  },
  insert({ ...args }, cb) {
    console.log(args);

    const documentId = this.documentId();
    const documentType = this.documentType();
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, {
      documentId,
      documentType,
      organizationId,
      ...args,
    }, cb);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = invokeId(viewmodel);

    if (!_id) {
      viewmodel.destroy();
    } else {
      swal({
        title: 'Are you sure?',
        text: 'Review will be removed.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false,
      }, () => {
        const cb = (err) => {
          if (!err) {
            swal({
              title: 'Removed!',
              text: 'Review was removed successfully.',
              type: 'success',
              timer: ALERT_AUTOHIDE_TIME,
              showConfirmButton: false,
            });
          }
        };

        this.modal().callMethod(remove, { _id }, cb);
      });
    }
  },
});
