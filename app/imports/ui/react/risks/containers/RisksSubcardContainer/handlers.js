import { insert, linkStandard } from '../../../../../api/risks/methods';
import _modal_ from '../../../../../startup/client/mixins/modal';
import { ACTIVE_VIEW_STATES } from './constants';

export const saveNewRisk = ({
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  typeId,
  organizationId,
  standardId,
}, cb) => {
  const args = {
    title,
    description,
    originatorId,
    ownerId,
    magnitude,
    typeId,
    organizationId,
    standardId,
    standardsIds: [standardId],
  };

  const invalid = Object.keys(args).some((key) => {
    if (key !== 'description' && !args[key]) {
      const message =
        `The new risk cannot be created without a ${key}. Please enter a key for your risk`;
      cb({ message });
      return true;
    }
    return false;
  });

  if (invalid) return invalid;

  // TEMP
  // because edit modal is still in blaze
  return _modal_.modal.callMethod(insert, args, cb);
};

const linkExistingRisk = ({ riskId: _id, standardId }, cb) => {
  const args = { _id, standardId };
  return _modal_.modal.callMethod(linkStandard, args, cb);
};

export const onSave = ({
  organizationId,
  updateUI,
  standardId,
}) => ({ card, activeView, ...props }) => {
  // If active view is 0 it means that the new risk is about to be created
  // otherwise the existing risk is about to be linked
  updateUI('isSaving', true);
  const cb = (err, id) => {
    setTimeout(() => updateUI('isSaving', false), 1000);

    if (err) return updateUI('error', err.message);

    updateUI('error', null);

    // remove subcard from ui
    card.onDelete();

    if (activeView === ACTIVE_VIEW_STATES.NEW) return updateUI('opened', id);

    return updateUI('opened', props.riskId);
  };

  if (activeView === ACTIVE_VIEW_STATES.NEW) {
    return saveNewRisk({
      ...props,
      organizationId,
      standardId,
    }, cb);
  }

  const { riskId } = props;

  return linkExistingRisk({
    riskId,
    standardId,
  }, cb);
};
