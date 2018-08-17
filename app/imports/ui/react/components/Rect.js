import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Rect = styled.div`
  ${({
    size = 16,
    width = size,
    height = size,
    strokeWidth = 4,
    fill,
    stroke,
    inline,
  }) => css`
    width: ${width}px;
    height: ${height}px;
    background: ${fill};
    border: ${stroke ? `${strokeWidth}px solid ${stroke}` : 'none'};
    display: ${inline ? 'inline-block' : 'block'};
  `}
`;

Rect.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Rect;
