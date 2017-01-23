import React, { PropTypes } from 'react';
import Section from './Section';
import SectionItem from './SectionItem';
import SectionTableItem from './SectionTableItem';

function DocumentCard({ children }) {
  return (
    <div>{children}</div>
  );
}

DocumentCard.propTypes = {
  children: PropTypes.node,
};

DocumentCard.Section = Section;
DocumentCard.SectionItem = SectionItem;
DocumentCard.SectionTableItem = SectionTableItem;

export default DocumentCard;
