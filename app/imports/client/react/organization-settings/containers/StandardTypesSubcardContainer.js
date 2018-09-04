import { withProps, withHandlers, pure } from 'recompose';

import { insert, update, remove } from '../../../../api/standards-types/methods';
import { swal } from '../../../util';
import { namedCompose } from '../../helpers';
import StandardTypesSubcard from '../components/StandardTypesSubcard';

export default namedCompose('StandardTypesSubcardContainer')(
  withProps(({ standardTypes = [] }) => ({
    initialValues: {
      standardTypes,
    },
  })),
  withHandlers({
    onDelete: ({ organizationId }) => ({ _id, title }) => swal.promise({
      text: `Standard type "${title}" will be removed.`,
      confirmButtonText: 'Remove',
      successTitle: 'Removed!',
      successText: `Standard type "${title}" was removed successfully.`,
    }, () => remove.callP({ _id, organizationId })),
    onUpdate: ({ organizationId }) => ({ _id, title, abbreviation = '' }, { reset }) => {
      if (!_id) {
        return insert.callP({ title, abbreviation, organizationId }).catch(swal.error);
      }

      return update.callP({
        _id,
        title,
        abbreviation,
        organizationId,
      }).catch((err) => {
        swal.error(err);

        reset();
      });
    },
  }),
  pure,
)(StandardTypesSubcard);
