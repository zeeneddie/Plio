import { withProps, withHandlers, pure } from 'recompose';
import { mapEntitiesToOptions } from 'plio-util';

import { insert, update, remove } from '../../../../api/standards-book-sections/methods';
import { swal } from '../../../util';
import { namedCompose } from '../../helpers';
import StandardSectionsSubcard from '../components/StandardSectionsSubcard';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';

export default namedCompose('StandardSectionsSubcardContainer')(
  withProps(({ standardSections = [] }) => ({
    initialValues: {
      standardSections: mapEntitiesToOptions(sortByTitlePrefix(standardSections)),
    },
  })),
  withHandlers({
    onDelete: ({ organizationId }) => ({ label: title, value: _id }) => swal.promise({
      text: `Standards section "${title}" will be removed.`,
      confirmButtonText: 'Remove',
      successTitle: 'Removed!',
      successText: `Standards section "${title}" was removed successfully.`,
    }, () => remove.callP({ _id, organizationId })),
    onUpdate: ({ organizationId }) => ({ label: title, value: _id }, reset) => {
      if (!_id) {
        insert.callP({ title, organizationId }).catch(swal.error);
      } else {
        update.callP({ _id, title, organizationId }).catch((err) => {
          swal.error(err);

          reset();
        });
      }
    },
  }),
  pure,
)(StandardSectionsSubcard);
