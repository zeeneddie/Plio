import PropTypes from 'prop-types';
import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { CardTitle, Col } from 'reactstrap';

import { Subcard, SubcardHeader, SubcardBody, Pull, CardBlock } from '../';

const FilesSubcard = ({ fileIds, ...props }) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Files
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {fileIds.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <Blaze
            template="FileUploader_Wrapper"
            {...{ fileIds, ...props }}
          />
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

FilesSubcard.propTypes = {
  fileIds: PropTypes.arrayOf(PropTypes.string),
  slingshotDirective: PropTypes.string,
  uploaderMetaContext: PropTypes.object,
};

export default FilesSubcard;
