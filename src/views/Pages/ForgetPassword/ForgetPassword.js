import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { forgetPassword } from '../../../services/AuthService';
import { MsgModal } from '../../../views/Notifications';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';

import 'ladda/dist/ladda-themeless.min.css';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      formErrors: { email: '' },
      emailValid: false,
      formValid: false,
      formWasValidated: false,
      isWarningModalOpen: false,
      isSuccessModalOpen: false,
    };
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value},
      () => { this.validateField('email', this.state.email); });
  }

  handleForgetPassword = (e) => {
    e.stopPropagation();

    if(!this.state.formValid){
      return;
    }

    this.setState({processing: true});
    forgetPassword(this.state.email)
      .then(() => {
        this.setState({processing: false});
        this.setState({ isSuccessModalOpen: true });
      })
      .catch((err) => {
        this.setState({processing: false});
        this.setState({ isWarningModalOpen: true });
      });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      default:
        break;
    }
    this.setState({
                    formWasValidated: true,
                    formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid});
  }

  closeSuccessModal = () => {
    this.setState({isSuccessModalOpen: false});
  }

  closeWarningModal = () => {
    this.setState({isWarningModalOpen: false});
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <MsgModal msgType="success" title="Success" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>Done! Your password is reset.</p>
          <p>Please check your mailbox for the new password.</p>
        </MsgModal>
        <MsgModal msgType="warning" title="Failed" isOpen={this.state.isWarningModalOpen} onRequestClose={this.closeWarningModal}>
          <p>Something wrong!</p>
        </MsgModal>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form className={this.state.formWasValidated ? 'was-validated' : ''}>
                      <h1>Forget Password</h1>
                      <p className="text-muted">We got you covered! Please enter your email address, we will send you the new password.</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Email" autoComplete="email" required onChange={this.handleEmailChange} />
                        <div className="invalid-feedback">
                          Invalid email address.
                        </div>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <LaddaButton color="primary" className="btn btn-success btn-ladda-progress" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleForgetPassword} loading={this.state.processing}>Submit</LaddaButton>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Link to="/login" className="px-0">Sign in</Link>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Open ARI Project</h2>
                      <p></p>
                      {/* <Button color="primary" className="mt-3" active>Register Now!</Button> */}
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgetPassword;
