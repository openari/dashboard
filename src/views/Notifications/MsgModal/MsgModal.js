import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class MsgModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showing: props.isOpen || false
    };

    this.toggleWarning = this.toggleWarning.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.toggleWarning();
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.toggleWarning();
    }
  }

  userToggle = () => {
    if (this.state.showing && this.props.onRequestClose) {
      this.props.onRequestClose();
    } else {
      this.toggleWarning();
    }
  }

  toggleWarning() {
    console.log('toggleWarning');
    console.log('new showing', !this.state.showing);
    this.setState({
      showing: !this.state.showing,
    }, () => {
      console.log('done state editing', this.state.showing);
      if (this.state.showing && this.props.onAfterOpen) {
        this.props.onAfterOpen();
      }
    });
  }

  render() {
    return (
      <Modal isOpen={this.state.showing} toggle={this.userToggle}
             className={'modal-' + this.props.msgType + ' ' + this.props.className}>
        <ModalHeader toggle={this.userToggle}>{this.props.title}</ModalHeader>
        <ModalBody>
          {this.props.children}
        </ModalBody>
        <ModalFooter>
          <Button hidden={this.props.hideOK} color={this.props.msgType} onClick={this.userToggle}>OK</Button>{' '}
          <p>{this.props.footer}</p>
        </ModalFooter>
      </Modal>

    );
  }
}

MsgModal.defaultProps = {
  msgType: 'warning'
};

export default MsgModal;
