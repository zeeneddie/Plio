import { setHelpSectionsData } from '/imports/client/store/actions/helpDocsActions';
import { createHelpSectionsData } from '../helpers';

export default initHelpSectionsData = ({ helpDocs, helpSections, dispatch }, onData) => {
  const helpSectionsData = createHelpSectionsData(helpSections, helpDocs);
  dispatch(setHelpSectionsData(helpSectionsData));

  onData(null, {});
};
