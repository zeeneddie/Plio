import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import PropTypes from 'prop-types';
import { CardTitle, FormGroup } from 'reactstrap';
import { CardBlock, Pull, Subcard, SubcardBody, SubcardHeader } from '../';

const FilesSubcard = ({
  input,
  onLink,
  onUnlink,
  ...props
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
        <FormGroup>
          <Blaze
            template="FileUploader_Wrapper"
            {...props}
            fileIds={input.value}
            onAfterInsert={onLink}
            onAfterRemove={file => onUnlink(file._id)}
          />
        </FormGroup>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

FilesSubcard.propTypes = {
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
};

export default FilesSubcard;
