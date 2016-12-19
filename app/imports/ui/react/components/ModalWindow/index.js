import React, { PropTypes } from 'react';
import { $ } from 'meteor/jquery';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import property from 'lodash.property';

import Modal from '../Modal';
import { pickC } from '/imports/api/helpers';
import { setModal } from '/client/redux/actions/modalActions';

class ModalWindow extends React.Component {
  static get propTypes() {
    return {
      variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
      helpText: PropTypes.string,
      isSaving: PropTypes.bool,
      title: PropTypes.string.isRequired,
      submitCaptionText: PropTypes.string,
      submitCaptionTextOnSave: PropTypes.string,
      closeCaptionTextOnSave: PropTypes.string,
      closeCaptionText: PropTypes.string,
      errorText: PropTypes.string,
      children: PropTypes.node,
      dispatch: PropTypes.func,
      closePortal: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      variation: null,
      isSaving: false,
      errorText: '',
      submitCaptionText: 'Save',
      submitCaptionTextOnSave: 'Saving...',
      closeCaptionText: 'Close',
      closeCaptionTextOnSave: 'Saving...',
    };
  }

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.closePortal = props.closePortal.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(setModal(this.modalRef));

    $(this.modalRef).modal('show');
    $(this.modalRef).on('hidden.bs.modal', this.closePortal);

    // const oldOnpopstate = window.onpopstate;
    // window.onpopstate = (e) => {
    //   this.close();
    //   if (_.isFunction(oldOnpopstate)) {
    //     oldOnpopstate(e);
    //   }
    //   window.onpopstate = oldOnpopstate;
    // };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.errorText && nextProps.errorText) {
      $(this.errorSection).collapse('show');
      $(this.modalRef).animate({ scrollTop: 0 }, 250, 'swing');
    } else if (this.props.errorText && !nextProps.errorText) {
      $(this.errorSection).collapse('hide');
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setModal(null));
  }

  _getSubmitCaptionText() {
    const { isSaving, submitCaptionTextOnSave, submitCaptionText } = this.props;

    return isSaving && submitCaptionTextOnSave
      ? submitCaptionTextOnSave
      : submitCaptionText;
  }

  _getCloseCaptionText() {
    const { isSaving, variation, closeCaptionText, closeCaptionTextOnSave } = this.props;

    return isSaving && variation === 'save' ? closeCaptionTextOnSave : closeCaptionText;
  }

  closeModal() {
    $(this.modalRef).modal('hide');
  }

  render() {
    return (
      <Modal
        {...this.props}
        submitCaptionText={this._getSubmitCaptionText()}
        closeCaptionText={this._getCloseCaptionText()}
        modalRefCb={modalRef => (this.modalRef = modalRef)}
        errorSectionRefCb={errorSection => (this.errorSection = errorSection)}
        helpPanelRefCb={helpPanel => (this.helpPanel = helpPanel)}
        onModalClose={this.closeModal}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default compose(
  pure,
  connect(compose(pickC(['isSaving', 'errorText']), property('modal'))),
)(ModalWindow);
