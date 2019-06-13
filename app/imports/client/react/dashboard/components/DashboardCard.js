import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardTitle, CardFooter, CardImg } from 'reactstrap';
import cx from 'classnames';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';
import { CardBlock, Icon } from '../../components';

const Wrapper = styled.div`
  min-height: 92px;

  @media (max-width: 767px) {
    min-height:auto;
  }
`;

const StyledCard = styled(Card)`
  background-color: ${Styles.background.color.grey};
  border-color: ${Styles.border.color.darkGrey};
`;

const DashboardCard = ({
  className,
  disabled,
  title,
  footer,
  icon,
  text,
  label,
  ...props
}) => (
  <StyledCard
    tag="a"
    className={cx(
      className,
      'dashboard-item',
      { 'dashboard-item-disabled': disabled },
    )}
    {...props}
  >
    <CardBlock>
      <Wrapper>
        <CardImg
          top
          tag={Icon}
          className="dashboard-item-icon"
          name={cx('fw', icon)}
        />
        <CardBody>
          <CardTitle>
            {title}
          </CardTitle>
        </CardBody>
      </Wrapper>
      <CardFooter>
        <span className="text-muted">{text}</span>
        {label && (<span className="label label-danger margin-left">{label}</span>)}
      </CardFooter>
    </CardBlock>
  </StyledCard>
);

DashboardCard.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default DashboardCard;
