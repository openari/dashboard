import React, { Component } from 'react';
import { Card, CardBody, Col, Row, CardGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { getToken, changePassword } from '../../services/AuthService';
import { MsgModal } from '../../views/Notifications';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import 'ladda/dist/ladda-themeless.min.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirm: '',
      formErrors: { password: '', passwordConfirm: '' },
      passwordValid: false,
      passwordConfirmValid: false,
      formValid: false,
      formWasValidated: false,
      isWarningModalOpen: false,
      isSuccessModalOpen: false
    };
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value},
      () => { this.validateField('password', this.state.password); });
  }

  handlePasswordConfirmChange = (e) => {
    this.setState({passwordConfirm: e.target.value},
      () => { this.validateField('passwordConfirm', this.state.passwordConfirm); });
  }

  handleChange = (e) => {
    e.stopPropagation();

    if(!this.state.formValid){
      console.log('form invalid', this.state);
      return;
    }

    this.setState({processing: true});
    changePassword(getToken(), this.state.password)
      .then(() => {
        this.setState({
          processing: false,
          isSuccessModalOpen: true
        });
        this.resetFormRelatedStates();
      })
      .catch((err) => {
        this.setState({
          processing: false,
          isWarningModalOpen: true
        });
      });
  }

  resetFormRelatedStates = () => {
    this.setState({
      password: '',
      passwordConfirm: '',
      passwordValid: false,
      passwordConfirmValid: false,
      formValid: false,
      formWasValidated: false
    });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let passwordValid = this.state.passwordValid;
    let passwordConfirmValid = this.state.passwordConfirmValid;

    switch(fieldName) {
      case 'password':
        passwordValid = value && value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '' : ' is invalid';
        break;
      case 'passwordConfirm':
        passwordConfirmValid = value && value.length >= 6 && value === this.state.password;
        fieldValidationErrors.passwordConfirm = passwordConfirmValid ? '' : ' is invalid';
        break;
      default:
        break;
    }
    this.setState({
                    formWasValidated: true,
                    formErrors: fieldValidationErrors,
                    passwordValid: passwordValid,
                    passwordConfirmValid: passwordConfirmValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.passwordValid && this.state.passwordConfirmValid });
  }

  closeSuccessModal = () => {
    this.setState({isSuccessModalOpen: false});
  }

  closeWarningModal = () => {
    this.setState({isWarningModalOpen: false});
  }

  render() {


    return (
      <div className="animated fadeIn">
        <MsgModal msgType="success" title="Success" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>Done! Your password is updated.</p>
        </MsgModal>
        <MsgModal msgType="warning" title="Failed" isOpen={this.state.isWarningModalOpen} onRequestClose={this.closeWarningModal}>
          <p>Something wrong!</p>
        </MsgModal>
        <Row className="justify-content-start">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form className={this.state.formWasValidated ? 'was-validated' : ''}>
                    <h3>Change Your Password</h3>
                    <p className="text-muted">You can change your password here.</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-key"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" autoComplete="password" required minLength="6" onChange={this.handlePasswordChange} />
                      <div className="invalid-feedback">
                        Invalid password. Password is required and at least 6 characters.
                      </div>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-key"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Confirm Password" autoComplete="password" required minLength="6" onChange={this.handlePasswordConfirmChange} />
                      <div className="invalid-feedback">
                        Invalid password. Password confirm mismatch.
                      </div>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <LaddaButton color="primary" className="btn btn-success btn-ladda-progress" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleChange} loading={this.state.processing}>Submit</LaddaButton>
                      </Col>
                      <Col xs="6" className="text-right">
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ChangePassword;
