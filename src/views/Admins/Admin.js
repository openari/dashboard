import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { getToken } from '../../services/AuthService';
import { getAdmin, updateAdminStatus } from '../../services/AdminsService';


class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: null,
      adminDisabled: false
    };

    getAdmin(getToken(), this.props.match.params.id)
    .then(admin => {
      this.setState({
        admin: admin,
        adminDisabled: admin.disabled
      });
    });
  }

  toggleDisabled = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let adminDisabled = !this.state.adminDisabled;

    updateAdminStatus(getToken(), this.state.admin.id, adminDisabled)
    .then(() => {
      this.setState({adminDisabled: adminDisabled});
    })
    .catch((err) => {
      alert('Update status failed');
    });
  }

  render() {

    const adminDetails = this.state.admin ? Object.entries(this.state.admin) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Admin id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        adminDetails.map(([key, value], index) => {
                          if (key !== 'disabled') {
                            return (
                              <tr key={index.toString()}>
                                <td>{`${key}:`}</td>
                                <td><strong>{value}</strong></td>
                              </tr>
                            )
                          } else {
                            return (
                              <tr key={index.toString()}>
                                <td>{`${key}:`}</td>
                                <td>
                                  <AppSwitch className={'mx-1'} variant={'3d'} color={'danger'} checked={this.state.adminDisabled} label dataOn={'\u2713'} dataOff={'\u2715'} onClick={this.toggleDisabled}/>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Admin;
