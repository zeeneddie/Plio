import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';
import { Form } from 'react-final-form';
import { keys } from 'ramda';
import { CardTitle } from 'reactstrap';

import { CanvasReportSections } from '../constants';
import { WithToggle } from '../../helpers';
import {
  CardBlock,
  Button,
  TextAlign,
  Pull,
  CheckboxField,
  Modal,
  ModalHeader,
  ModalProvider,
  ModalBody,
} from '../../components';

const ReportSectionLabels = {
  [CanvasReportSections.BUSINESS_MODEL_CANVAS]: 'Business model canvas',
  [CanvasReportSections.CANVAS_ITEMS]: 'Canvas items',
  [CanvasReportSections.CANVAS_CHARTS]: 'Canvas charts',
  [CanvasReportSections.CUSTOMER_INSIGHTS]: 'Customer insights',
  [CanvasReportSections.VALUE_COMPONENTS]: 'Value components',
  [CanvasReportSections.OPERATIONAL_ELEMENTS]: 'Operational elements',
};

const StyledButton = styled(Button)`
  ${StyledMixins.media.print`
    display: none;
  `}
`;

const StyledCardBlock = styled(CardBlock)`
  hr {
    margin: 1.25rem -1.25rem;
  }
`;

const CanvasReportPrintModal = ({ printState, updatePrintState }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <Fragment>
        <Pull right>
          <StyledButton onClick={toggle} component="button">
            Print
          </StyledButton>
        </Pull>
        <ModalProvider {...{ isOpen, toggle }}>
          <Modal>
            <ModalHeader
              renderRightButton={<Button color="secondary" onClick={toggle}>Close</Button>}
            >
              <CardTitle>Print report</CardTitle>
            </ModalHeader>
            <ModalBody>
              <CardBlock>
                Make sure page orientation is set to landscape
                in your print options before printing.
              </CardBlock>
              <StyledCardBlock>
                <Form
                  initialValues={printState}
                  onSubmit={(values) => {
                    updatePrintState(values);
                    toggle();
                    setTimeout(window.print, 0);
                  }}
                >
                  {({ handleSubmit }) => (
                    <Fragment>
                      {keys(printState).map(reportSection => (
                        <CheckboxField
                          key={reportSection}
                          name={reportSection}
                          label={ReportSectionLabels[reportSection]}
                        />
                      ))}
                      <hr />
                      <TextAlign center>
                        <div>
                          <Button onClick={handleSubmit}>Print</Button>
                        </div>
                      </TextAlign>
                    </Fragment>
                  )}
                </Form>
              </StyledCardBlock>
            </ModalBody>
          </Modal>
        </ModalProvider>
      </Fragment>
    )}
  </WithToggle>
);

CanvasReportPrintModal.propTypes = {
  printState: PropTypes.object.isRequired,
  updatePrintState: PropTypes.func.isRequired,
};

export default CanvasReportPrintModal;
