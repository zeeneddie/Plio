import React from 'react';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';
import is from 'styled-is';

import { Styles } from '../../../../api/constants';

const CanvasStyles = {
  itemMinHeight: 240,
  borderColor: '#aaa',
  sectionPadding: '1rem',
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
      border-color: ${Styles.colors.blue};
      z-index: 2;

      .btn-add {
        color: ${Styles.colors.blue};
      }
    }

    .btn-chart,
    .btn-add {
      font-size: 24px;
      transition: color 0.4s ease;
      color: #bbb;
      margin: ${CanvasStyles.sectionPadding * -1};
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

const CanvasSectionItems = styled.div`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  ${StyledMixins.scroll};

  li {
    margin: 0 -0.5rem .5rem;
    border-radius: 3px;
    transition: background 0.4 ease;
    padding: 0 0.5rem;
    cursor: move;

    &:hover {
      background: #eee;
    }
  }
`;

const CanvasPage = () => (
  <Canvas>
    <CanvasRow twoThirds>
      <CanvasCol md>Hello World</CanvasCol>
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
