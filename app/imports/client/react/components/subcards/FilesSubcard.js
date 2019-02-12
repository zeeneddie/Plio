import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';

import { CardBlock, Pull, Subcard, SubcardBody, SubcardHeader } from '../';
import FileInputContainer from '../../forms/components/FileInputContainer';

const FilesSubcard = ({
  input,
  onLink,
  onUnlink,
  slingshotDirective,
  uploaderMetaContext,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Files
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {input.value.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <FileInputContainer
          {...{ slingshotDirective }}
          fileIds={input.value}
          onAfterCreate={onLink}
          onAfterRemove={onUnlink}
          slingshotContext={uploaderMetaContext}
          multiple
        />
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

FilesSubcard.propTypes = {
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  uploaderMetaContext: PropTypes.object.isRequired,
  slingshotDirective: PropTypes.string.isRequired,
};

export default FilesSubcard;
