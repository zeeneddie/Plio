import PropTypes from 'prop-types';
import React from 'react';

import CardHeader from '../../../components/CardHeader';
import Button from '../../../components/Buttons/Button';
import Wrapper from '../../../components/Wrapper';
import { Icon } from '../../../components/Icons';
import CardHeadingButtons from '../../../components/CardHeadingButtons';
import { Pull, TextAlign } from '../../../components/Utility';
import withStateToggle from '/imports/ui/react/helpers/withStateToggle';

import Menu from './Menu';

const MenuEnhanced = withStateToggle(false, 'isOpen', 'toggle')(Menu);

const DiscussionHeader = ({ onToggleMute, onBackArrowClick, isMuted }) => (
  <CardHeader className="chat-heading">
    <Wrapper className="discussions-hd-top">
      <Pull left>
        <CardHeadingButtons>
          <Button color="secondary" onClick={onBackArrowClick}>
            <Icon name="angle-left" margin="right-2x" size="2" />
            <span>Back</span>
          </Button>
        </CardHeadingButtons>
      </Pull>
      <Pull right>
        <CardHeadingButtons>
          <MenuEnhanced {...{ isMuted, onToggleMute }} />
        </CardHeadingButtons>
      </Pull>
      <TextAlign center>
        <CardHeader.Title>
          Discussion
        </CardHeader.Title>
      </TextAlign>
    </Wrapper>
  </CardHeader>
);

DiscussionHeader.propTypes = {
  isMuted: PropTypes.bool,
  onToggleMute: PropTypes.func,
  onBackArrowClick: PropTypes.func,
};

export default DiscussionHeader;
