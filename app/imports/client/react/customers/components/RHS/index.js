/* eslint-disable react/jsx-pascal-case */

import PropTypes from 'prop-types';

import React, { Fragment } from 'react';

import RHS from '../../../components/RHS';
import NotFound from './NotFound';
import NotExist from './NotExist';
import Body from './Body';
import BodyContainer from '../../containers/BodyContainer';
import Button from '../../../components/Buttons/Button';
import CustomerEditModal from '../CustomerEditModal';
import CustomerEditContainer from '../../containers/CustomerEditContainer';
import useToggle from '../../../hooks/useToggle';

const CustomersRHS = ({ isReady, organization }) => {
  const [isOpen, toggle] = useToggle(false);

  return (
    <RHS flex>
      <RHS.Card className="document-details">
        <RHS.Header
          title="Organization"
          isReady={isReady}
        >
          {organization && (
            <Fragment>
              <Button color="primary" onClick={toggle}>Edit</Button>
              <CustomerEditContainer
                {...{
                  organization,
                  isOpen,
                  toggle,
                }}
                skip={!isOpen}
                component={CustomerEditModal}
              />
            </Fragment>
          )}
        </RHS.Header>

        <RHS.ContentList isReady={isReady}>
          <BodyContainer {...organization} />
          <div className="card-footer" />
        </RHS.ContentList>
      </RHS.Card>
    </RHS>
  );
};

CustomersRHS.NotFound = NotFound;
CustomersRHS.NotExist = NotExist;
CustomersRHS.Body = Body;

CustomersRHS.propTypes = {
  organization: PropTypes.object,
  isReady: PropTypes.bool,
};

export default CustomersRHS;
