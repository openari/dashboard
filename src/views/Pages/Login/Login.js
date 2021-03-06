import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { login } from '../../../services/AuthService';
import { MsgModal } from '../../../views/Notifications';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';

import 'ladda/dist/ladda-themeless.min.css';

const FormErrors = ({formErrors}) =>
  <div className='formErrors'>
    {Object.keys(formErrors).map((fieldName, i) => {
      if(formErrors[fieldName].length > 0){
        return (
          <p key={i}>{fieldName} {formErrors[fieldName]}</p>
        )
      } else {
        return '';
      }
    })}
  </div>

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: { email: '', password: '' },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      formWasValidated: false,
      isWarningModalOpen: false,
    };
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value},
      () => { this.validateField('email', this.state.email); });
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value},
      () => { this.validateField('password', this.state.password); });
  }

  handleLogin = (e) => {
    e.stopPropagation();

    if(!this.state.formValid){
      return;
    }

    this.setState({processing: true});
    login(this.state.email, this.state.password)
      .then(() => {
        this.setState({
          processing: false,
          isLoggedIn: true
        });
      })
      .catch((err) => {
        this.setState({processing: false});
        this.setState({ isWarningModalOpen: true });
      });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 4;
        fieldValidationErrors.password = passwordValid ? '': ' is too short';
        break;
      default:
        break;
    }
    this.setState({
                    formWasValidated: true,
                    formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                    passwordValid: passwordValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
  }

  closeWarningModal = () => {
    this.setState({isWarningModalOpen: false});
  }

  render() {
    const { isLoggedIn } = this.state;

    if (isLoggedIn) {
      return <Redirect to='/'/>;
    }

    return (
      <div className="app flex-row align-items-center">
        <MsgModal msgType="warning" title="Failed" isOpen={this.state.isWarningModalOpen} onRequestClose={this.closeWarningModal}>
          <p>Login failed.</p>
        </MsgModal>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form className={this.state.formWasValidated ? 'was-validated' : ''}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign in to your account</p>
                      <div className="panel panel-default">
                        <FormErrors formErrors={this.state.formErrors} />
                      </div>
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
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" required onChange={this.handlePasswordChange} />
                        <div className="invalid-feedback">
                          Password is required and at least 4 characters.
                        </div>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <LaddaButton color="primary" className="btn btn-success btn-ladda-progress" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleLogin} loading={this.state.processing}>Login</LaddaButton>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Link to="/forget-password" color="link" className="px-0">Forgot password?</Link>
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

export default Login;
