import React, { PropTypes } from 'react';

import CardHeader from '../../../components/CardHeader';
import Button from '../../../components/Buttons/Button';
import Wrapper from '../../../components/Wrapper';
import { Icon, IconStack } from '../../../components/Icons';
import CardHeadingButtons from '../../../components/CardHeadingButtons';
import { Pull } from '../../../components/Utility';

const DiscussionHeader = ({ onBackArrowClick }) => (
  <CardHeader className="chat-heading">
    <Wrapper className="discussions-hd-top">
      <Pull left>
        <CardHeadingButtons tag={CardHeader.Item}>
          <Button color="secondary" onClick={onBackArrowClick}>
            <Icon name="angle-left" margin="right-2x" size="2" />
            <span>Back</span>
          </Button>
        </CardHeadingButtons>
      </Pull>
      <Pull right>
        <CardHeadingButtons tag={CardHeader.Item}>
          <IconStack>
            <Icon name="volume-off nudge-left" size="3" sizePrefix="stack" />
            <Icon name="times right" size="1" />
          </IconStack>
        </CardHeadingButtons>
      </Pull>
      <CardHeader.Title>
        Discussion
      </CardHeader.Title>
    </Wrapper>
  </CardHeader>
);

DiscussionHeader.propTypes = {
  onBackArrowClick: PropTypes.func,
};

export default DiscussionHeader;
