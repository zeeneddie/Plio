import { CollectionNames } from '/imports/share/constants';
import { propEq } from '/imports/api/helpers';

export const createHelpSectionsData = (helpSections, helpDocs) => helpSections
  .map(section => ({
    ...section,
    helpDocs: helpDocs.filter(propEq('sectionId', section._id)),
  }))
  .filter(section => !!section.helpDocs.length);

export const createHelpSectionItem = sectionId => ({
  key: sectionId,
  type: CollectionNames.HELP_SECTIONS,
});
