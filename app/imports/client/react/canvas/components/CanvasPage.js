import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { StyledMixins } from 'plio-util';
import is from 'styled-is';
import cx from 'classnames';
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from 'reactstrap';
import pluralize from 'pluralize';

import { Styles } from '../../../../api/constants';
import { Icon } from '../../components';
import { WithToggle } from '../../helpers';

const CanvasStyles = {
  itemMinHeight: 240,
  borderColor: '#aaa',
  sectionPadding: '1rem',
  color: {
    yellow: '#FCCF31',
    magenta: '#94135E',
    pink: '##F0889C',
  },
};

const Canvas = styled.div`
  width: 100%;
  min-height: 100%;
  background: white;

  ${StyledMixins.media.notMobile`
    min-height: ${CanvasStyles.itemMinHeight * 3}px;
    flex: 1;
  `}

  ${StyledMixins.media.desktop`
    display: flex;
    flex-direction: column;
  `}
`;

const CanvasRow = styled.div`
  ${StyledMixins.media.tabletPortrait`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  `}

  ${StyledMixins.media.desktop`
    display: flex;
    flex: 1;

    ${is('oneThird')`
      min-height: 33.33333%;
    `}

    ${is('twoThirds')`
      min-height: 66.66666%;
    `}
  `}
`;

const CanvasCol = styled.div`
  width: 100%;

  ${is('sm')`
    ${StyledMixins.media.notMobile`
      display: flex;
      flex: 1;
      flex-direction: column;
    `}
  `}

  ${is('md')`
    ${StyledMixins.media.tabletPortrait`
      display: flex;
    `}

    ${StyledMixins.media.desktop`
      display: flex;
      flex: 1;
      flex-direction: column;
    `}
  `}
`;

const CanvasSection = styled.div`
  border: 2px solid ${CanvasStyles.borderColor};
  transition: background-color 0.4s ease, border-color 0.4s ease;
  margin: -1px;

  ${StyledMixins.media.notMobile`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: ${CanvasStyles.itemMinHeight}
  `}

  ${StyledMixins.media.tabletPortrait`
    max-height: 400px;
  `}

  ${is('empty')`
    &:hover {
      cursor: pointer;
      background: #f5f5f5;
      border-color: ${Styles.color.blue};
      z-index: 2;

      .btn-add {
        color: ${Styles.color.blue};
      }
    }
  `}
`;

const CanvasSectionHeading = styled.div`
  padding: ${CanvasStyles.sectionPadding};
  display: flex;
  align-items: flex-start;

  h4 {
    font-size: 18px;
    line-height: 1.2;
    font-family: ${Styles.font.family.segoe.semibold};
    margin: 0;
    flex: 1;
  }
`;

const CanvasSectionHelp = styled.div`
  display: none;
  padding: 0px ${CanvasStyles.sectionPadding};
  margin: 0 0 .5rem;
  flex: 1;
`;

const CanvasSectionItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  ${StyledMixins.scroll};
`;

const CanvasSectionItem = styled.li`
  margin: 0 -0.5rem .5rem;
  border-radius: 3px;
  transition: background 0.4 ease;
  padding: 0 0.5rem;
  cursor: move;

  &:hover {
    background: #eee;
  }

  ${is('placeholder')`
    position: relative;
    height: 21px;
    border: 1px dashed #ddd;

    &:before {
      position: absolute;
    }
  `}
`;

const SquareIcon = props => <Icon {...props} name="square" />;

const CanvasSquareIcon = styled(SquareIcon)`
  float: left;
  margin-right: 8px;
  margin-top: 4px;

  ${is('yellow')`
    color: ${CanvasStyles.color.yellow};
  `}

  ${is('magenta')`
    color: ${CanvasStyles.color.magenta};
  `}

  ${is('pink')`
    color: ${CanvasStyles.color.pink};
  `}
`;

const CanvasLinkedItem = styled.div`
  overflow: hidden;
  color: ${Styles.color.muted};
  margin-top: 2px;
  line-height: 1.4;

  i {
    line-height: inherit;
    float: left;
    margin-right: 5px;
  }
`;

const CanvasSectionFooter = styled.div`
  padding: ${CanvasStyles.sectionPadding};
  display: flex;
  align-items: flex-end;
`;

const CanvasSectionFooterLabels = styled.div`
  flex: 1;
  margin-bottom: -4px;
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  transform: none !important;
  top: auto !important;
  left: auto !important;
`;

const CanvasLabel = ({
  children,
  label,
  ...props
}) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <ButtonDropdown
        {...{ ...props, isOpen, toggle }}
        dropup
        group={false}
      >
        <DropdownToggle>
          {label}
        </DropdownToggle>
        <StyledDropdownMenu>
          {children}
        </StyledDropdownMenu>
      </ButtonDropdown>
    )}
  </WithToggle>
);

CanvasLabel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const StyledCanvasLabel = styled(CanvasLabel)`
  margin: 0 5px 4px 0;
  display: inline-block;

  & > button {
    padding: 0.1rem 0.7rem 0.15rem !important;
  }
`;

CanvasLabel.defaultProps = {
  color: 'secondary',
  size: 'sm',
};

const canvasIconStyles = css`
  font-size: 24px;
  transition: color 0.4s ease;
  color: #bbb;
  margin: -${CanvasStyles.sectionPadding};
  margin-left: 5px;

  &:hover {
    cursor: pointer;
    color: ${Styles.color.blue};
  }

  &[disabled] {
    cursor: default;
    color: #bbb;
    opacity: 0.3;
  }
`;

const PlusButton = ({ className, ...props }) => (
  <Button className={cx('btn-link', className)} color="add" {...props}>
    <Icon name="plus" />
  </Button>
);

PlusButton.propTypes = {
  className: PropTypes.string,
};

const CanvasAddButton = styled(PlusButton)`
  ${canvasIconStyles}
`;

const ChartButton = ({ className, icon, ...props }) => (
  <Button className={cx('btn-link', className)} color="chart" {...props}>
    <Icon name={icon} />
  </Button>
);

ChartButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
};

const CanvasChartButton = styled(ChartButton)`
  ${canvasIconStyles};
`;

const goals = [
  { sequentialId: 'KG1', title: 'Finish UI design' },
  { sequentialId: 'KG3', title: 'Close New York Office' },
  { sequentialId: 'KG4', title: 'Launch Product X' },
];

const standards = [
  { issueNumber: '2.1', title: 'Identification of needs' },
  { issueNumber: '2.2.1.1', title: 'Due diligence' },
];

const CanvasPage = () => (
  <Canvas>
    <CanvasRow twoThirds>
      <CanvasCol md>
        <CanvasSection>
          <CanvasSectionHeading>
            <h4>Key partners</h4>
            <CanvasAddButton />
          </CanvasSectionHeading>
          <CanvasSectionItems>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Total Scientific Ltd</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon magenta />
              <span>Jackson Laboratory</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon pink />
              <span>Boult (international patent lawyers)</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Clinical & research collaborators</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Another item here</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Total Scientific Ltd</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon magenta />
              <span>Jackson Laboratory</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon pink />
              <span>Boult (international patent lawyers)</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Clinical & research collaborators</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Another item here</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Total Scientific Ltd</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon magenta />
              <span>Jackson Laboratory</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon pink />
              <span>Boult (international patent lawyers)</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Clinical & research collaborators</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Another item here</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Total Scientific Ltd</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon magenta />
              <span>Jackson Laboratory</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon pink />
              <span>Boult (international patent lawyers)</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Clinical & research collaborators</span>
            </CanvasSectionItem>
            <CanvasSectionItem>
              <CanvasSquareIcon yellow />
              <span>Another item here</span>
            </CanvasSectionItem>
          </CanvasSectionItems>
          <CanvasSectionFooter>
            <CanvasSectionFooterLabels>
              <ButtonGroup>
                <StyledCanvasLabel label={pluralize('key goal', goals.length, true)}>
                  {goals.map(({ sequentialId, title }) => (
                    <DropdownItem key={sequentialId}>
                      <span className="text-muted">{sequentialId}</span>
                      {' '}
                      <span>{title}</span>
                    </DropdownItem>
                  ))}
                </StyledCanvasLabel>
                <StyledCanvasLabel label={pluralize('standard', standards.length, true)}>
                  {standards.map(({ issueNumber, title }) => (
                    <DropdownItem key={issueNumber}>
                      <span className="text-muted">{issueNumber}</span>
                      {' '}
                      {title}
                    </DropdownItem>
                  ))}
                </StyledCanvasLabel>
              </ButtonGroup>
            </CanvasSectionFooterLabels>
            <CanvasChartButton icon="th-large" />
          </CanvasSectionFooter>
        </CanvasSection>
      </CanvasCol>
      <CanvasCol md>Hello World</CanvasCol>
      <CanvasCol md>Hello World</CanvasCol>
      <CanvasCol md>Hello World</CanvasCol>
      <CanvasCol md>Hello World</CanvasCol>
    </CanvasRow>
    <CanvasRow oneThird>
      <CanvasCol sm>Hello World</CanvasCol>
      <CanvasCol sm>Hello World</CanvasCol>
    </CanvasRow>
  </Canvas>
);

export default CanvasPage;
