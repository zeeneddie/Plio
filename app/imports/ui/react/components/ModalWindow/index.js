import React, { PropTypes } from 'react';
import { $ } from 'meteor/jquery';
import { pure } from 'recompose';
import { _ } from 'meteor/underscore';

import Modal from '../Modal';
import { setModal, onModalClose, setErrorText } from '/client/redux/actions/modalActions';

const ERROR_PANEL_CLOSE_TIMER = 3000;

@pure
export default class ModalWindow extends React.Component {
  static get propTypes() {
    return {
      variation: PropTypes.oneOf(['save', 'simple', null, undefined]),
      helpContent: PropTypes.node,
      onToggleHelpPanel: PropTypes.func,
      isHelpPanelCollapsed: PropTypes.bool,
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
      isHelpPanelCollapsed: true,
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
    this.toggleHelpPanel = _.throttle(props.onToggleHelpPanel, 400).bind(this);
  }

  componentDidMount() {
    this.props.dispatch(setModal(this.modalRef));

    $(this.modalRef).modal('show');
    $(this.modalRef).on('hidden.bs.modal', this.closePortal);

    const oldOnpopstate = window.onpopstate;

    window.onpopstate = (e) => {
      this.closeModal();

      if (typeof oldOnpopstate === 'function') oldOnpopstate(e);

      window.onpopstate = oldOnpopstate;
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isHelpPanelCollapsed !== prevProps.isHelpPanelCollapsed) {
      $(this.helpPanel).collapse('toggle');
    }

    if (this.props.errorText && !prevProps.errorText) {
      $(this.errorSection).collapse('show');
      $(this.modalRef).animate({ scrollTop: 0 }, 250, 'swing');
      const timeout = setTimeout(() => {
        $(this.errorSection).collapse('hide');
        this.props.dispatch(setErrorText(''));
        clearTimeout(timeout);
      }, ERROR_PANEL_CLOSE_TIMER);
    } else if (!this.props.errorText && prevProps.errorText) {
      $(this.errorSection).collapse('hide');
    }
  }

  componentWillUnmount() {
    this.props.dispatch(onModalClose);
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
        onToggleHelpPanel={this.toggleHelpPanel}
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
