import PropTypes from 'prop-types';
import React from 'react';
import { delayed } from 'libreact/lib/delayed';

import { WithToggle } from '../../helpers';
import CanvasSection from './CanvasSection';
import CanvasItemList from './CanvasItemList';
import CanvasHeading from './CanvasHeading';
import CanvasFooter from './CanvasFooter';

// delay rendering of footer
// it has some heavy computations
const DelayedFooter = delayed({
  loader: () => Promise.resolve(CanvasFooter),
  idle: true,
  delay: 200,
});

const CanvasBlock = ({
  label,
  help,
  items,
  renderModal,
  renderEditModal,
  renderChartModal,
  organizationId,
  sectionName,
  chartButtonIcon,
}) => {
  const isEmpty = !items.length;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => (
        <CanvasSection
          onClick={isEmpty ? toggle : undefined}
          empty={isEmpty}
        >
          <CanvasHeading
            {...{
              label,
              renderModal,
              isOpen,
              toggle,
              isEmpty,
              help,
              sectionName,
            }}
          />
          <CanvasItemList
            {...{
              organizationId,
              sectionName,
              renderEditModal,
              items,
            }}
          />
          <DelayedFooter
            {...{
              isEmpty,
              items,
              renderChartModal,
              chartButtonIcon,
              organizationId,
            }}
          />
        </CanvasSection>
      )}
    </WithToggle>
  );
};

CanvasBlock.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  renderModal: PropTypes.func.isRequired,
  renderEditModal: PropTypes.func,
  renderChartModal: PropTypes.func,
  chartButtonIcon: PropTypes.string,
};

export default CanvasBlock;
