import { batchActions } from 'redux-batched-actions';

import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers';
import { HelpDocs } from '/imports/share/collections/help-docs';
import { HelpSections } from '/imports/share/collections/help-sections';
import { setDataLoading } from '/imports/client/store/actions/globalActions';
import { setHelpDocs, setHelpSections } from '/imports/client/store/actions/collectionsActions';

export default ({ dispatch }, onData) => {
  const sub = DocumentLayoutSubs.subscribe('helpDocsLayout');

  if (sub.ready()) {
    const helpDocs = HelpDocs.find({}, { sort: { title: 1 } }).fetch();
    const helpSections = HelpSections.find({}, { sort: { index: 1 } }).fetch();

    dispatch(batchActions([
      setHelpDocs(helpDocs),
      setHelpSections(helpSections),
      setDataLoading(false),
    ]));
  } else {
    dispatch(setDataLoading(true));
  }

  onData(null, {});
};
