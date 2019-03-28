import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table, CardGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { getToken } from '../../services/AuthService';
import { listAdmins, createAdmin } from '../../services/AdminsService';
import { MsgModal } from '../../views/Notifications';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';

import 'ladda/dist/ladda-themeless.min.css';

function AdminRow(props) {
  const admin = props.admin
  const adminLink = `#/admins/${admin.id}`

  return (
    <tr key={admin.id.toString()}>
        <th scope="row"><a href={adminLink}>{admin.id}</a></th>
        <th scope="row"><a href={adminLink}>{admin.name}</a></th>
        <td><a href={adminLink}>{admin.email}</a></td>
        <td>
          <AppSwitch className={'mx-1'} variant={'3d'} color={'danger'} checked={admin.disabled} label dataOn={'\u2713'} dataOff={'\u2715'} disabled/>
        </td>
    </tr>
  )
}

class Admins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminsList: [],
      name: '',
      email: '',
      password: '',
      formErrors: { name: '', email: '', password: '' },
      nameValid: false,
      emailValid: false,
      passwordValid: false,
      formValid: false,
      formWasValidated: false,
      isWarningModalOpen: false,
      isSuccessModalOpen: false
    };

    this.loadAdmins();
  }

  loadAdmins = () => {
    listAdmins(getToken())
    .then(admins => {
      this.setState({
        adminsList : admins
      });
    });
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value},
      () => { this.validateField('name', this.state.name); });
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value},
      () => { this.validateField('email', this.state.email); });
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value},
      () => { this.validateField('password', this.state.password); });
  }

  handleCreate = (e) => {
    e.stopPropagation();

    if(!this.state.formValid){
      return;
    }

    this.setState({processing: true});
    createAdmin(getToken(), this.state.name, this.state.email, this.state.password)
      .then(() => {
        this.setState({
          processing: false,
          isSuccessModalOpen: true
        });
        this.resetFormRelatedStates();
        this.loadAdmins();
      })
      .catch((err) => {
        this.setState({
          processing: false,
          isWarningModalOpen: true
        });
        this.resetFormRelatedStates();
      });
  }

  resetFormRelatedStates = () => {
    this.setState({
      name: '',
      email: '',
      password: '',
      nameValid: false,
      emailValid: false,
      passwordValid: false,
      formValid: false,
      formWasValidated: false
    });

  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(fieldName) {
      case 'name':
        nameValid = value && value.length > 0;
        fieldValidationErrors.name = nameValid ? '' : ' is invalid';
        break;
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value && value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '' : ' is invalid';
        break;
      default:
        break;
    }
    this.setState({
                    formWasValidated: true,
                    formErrors: fieldValidationErrors,
                    nameValid: nameValid,
                    emailValid: emailValid,
                    passwordValid: passwordValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.nameValid && this.state.emailValid && this.state.passwordValid });
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
          <p>Done! A new admin is created.</p>
        </MsgModal>
        <MsgModal msgType="warning" title="Failed" isOpen={this.state.isWarningModalOpen} onRequestClose={this.closeWarningModal}>
          <p>Something wrong!</p>
        </MsgModal>
        <Row>
          <Col xl={8}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Admins
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">email</th>
                      <th scope="col">disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.adminsList.map((admin, index) =>
                      <AdminRow key={index} admin={admin}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-start">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form className={this.state.formWasValidated ? 'was-validated' : ''}>
                    <h3>Create a new admin</h3>
                    <p className="text-muted">You can add a new admin here.</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Name" autoComplete="name" required onChange={this.handleNameChange} />
                      <div className="invalid-feedback">
                        Invalid name. Name is required.
                      </div>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" placeholder="Email" autoComplete="email" required onChange={this.handleEmailChange} />
                      <div className="invalid-feedback">
                        Invalid email address. Email is required.
                      </div>
                    </InputGroup>
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
                    <Row>
                      <Col xs="6">
                        <LaddaButton color="primary" className="btn btn-success btn-ladda-progress" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleCreate} loading={this.state.processing}>Submit</LaddaButton>
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

export default Admins;
