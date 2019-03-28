import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { getToken } from '../../services/AuthService';
import { getApplication, approveApplication, listApplicationTokens, createApplicationToken, invalidateApplicationToken, columnNameLookup, statusNameLookup } from '../../services/ApplicationsService';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Moment from 'react-moment';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import { MsgModal } from '../../views/Notifications';

import 'ladda/dist/ladda-themeless.min.css';

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tokens: [],
      isSuccessModalOpen: false,
      isWarningModalOpen: false,
    };

    this.tokenOptions = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      onRowClick: this.handleSelection,
    }

    this.loadData();
    this.getTokens();
  }

  loadData = (e) => {
    getApplication(getToken(), this.props.match.params.id)
    .then(data => {
      this.setState({
        data : data
      });
    });
  }

  handleApprove = (e) => {
    this.setState({
      processing: true,
      isConfirmModalOpen: true
    });
  }

  getTokens = (e) => {
    listApplicationTokens(getToken(), this.props.match.params.id)
    .then(data => {
      data.forEach(function(item) {
        item.status = statusNameLookup(item.status);
      });
      this.setState({ tokens: data })
    });
  }

  createToken = (e) => {
    this.setState({
      processingToken: true,
    }, () => {
      createApplicationToken(getToken(), this.props.match.params.id)
      .then(data => {
        this.setState({
          processing: false
        }, () => {
          this.getTokens();
          this.showToken(data.token);
        });
      })
      .catch((err) => {
        this.setState({
          processing: false
        });
      });
    });
  }

  confirmApprove = (e) => {
    this.setState({
      isConfirmModalOpen: false,
    }, () => {
      approveApplication(getToken(), this.props.match.params.id)
      .then(() => {
        this.setState({
          isSuccessModalOpen: true,
          processing: false
        }, () => {
          this.loadData();
        });
      })
      .catch((err) => {
        this.setState({
          isWarningModalOpen: true,
          processing: false
        });
      });
    });
  }

  closeConfirmModal = () => {
    this.setState({
      isConfirmModalOpen: false,
      processing: false
    });
  }

  closeSuccessModal = () => {
    this.setState({
      isSuccessModalOpen: false
    });
  }

  closeWarningModal = () => {
    this.setState({
      isWarningModalOpen: false
    });
  }

  showToken = (token) => {
    this.setState({
      showingToken: token,
      isShowingToken: true
    });
  }

  closeTokenModal = () => {
    this.setState({
      isShowingToken: false
    });
  }

  render() {

    let itemTokenStringFormatter = (cell, row) => {
      const itemLink = row.url;
      return <Button block color="light" onClick={() => {this.showToken(row.token)}}>顯示</Button>;
    };

    const data = this.state.data ? Object.entries(this.state.data) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <MsgModal msgType="secondary" className="modal-lg" title="Token 字串" hideOK={true}
          isOpen={this.state.isShowingToken} onRequestClose={this.closeTokenModal}
          footer="請將上方 Token 字串全部選取後複製使用">
            <code>{this.state.showingToken}</code>
        </MsgModal>
        <MsgModal msgType="warning" title="是否確定?" hideOK={true} isOpen={this.state.isConfirmModalOpen} onRequestClose={this.closeConfirmModal}>
          <p>您確定要審核通過此第三方應用的申請?</p>
          <Button color="ghost-danger" onClick={this.confirmApprove}>是的，確定通過!</Button>
        </MsgModal>
        <MsgModal msgType="success" title="成功完成!" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>第三方應用已通過申請</p>
        </MsgModal>
        <MsgModal msgType="warning" title="失敗..." isOpen={this.state.isWarningModalOpen} onRequestClose={this.closeWarningModal}>
          <p>操作失敗</p>
        </MsgModal>
        <Modal isOpen={this.state.imageModalShowing} toggle={this.toggleImageModal}
               className={'modal-success'}>
          <ModalBody>
            <ImageGallery items={[{original:this.state.imageModalImageSrc}]} showNav={false} showPlayButton={false} showThumbnails={false} useBrowserFullscreen={true} />
            {/* <img src={this.state.imageModalImageSrc}/> */}
          </ModalBody>
        </Modal>
        <Row>
          <Col lg={8}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>第三方應用 Id: {this.props.match.params.id}</strong>
                <div className="card-header-actions">
                </div>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        data.map(([key, value], index) => {
                          if (key == 'status') {
                            return (
                              <tr key={index.toString()}>
                                <td>{columnNameLookup(key)}</td>
                                <td><strong>{statusNameLookup(value.toString())}</strong></td>
                              </tr>
                            )
                          } else if (key == 'url') {
                            return (
                              <tr key={index.toString()}>
                                <td>{columnNameLookup(key)}</td>
                                <td><a href={value} target="_blank">{value}</a></td>
                              </tr>
                            )
                          } else {
                            return (
                              <tr key={index.toString()}>
                                <td>{columnNameLookup(key)}</td>
                                <td><strong>{value.toString()}</strong></td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </Table>
                  <LaddaButton className="btn btn-lg btn-success btn-ladda-progress" size="lg" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleApprove} loading={this.state.processing}>審核通過</LaddaButton>
              </CardBody>
            </Card>

            <Card hidden={this.state.data.status != 'approved'}>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>第三方應用存取 Token</strong>
                <div className="card-header-actions">
                </div>
              </CardHeader>
              <CardBody>
                <BootstrapTable data={this.state.tokens} version="4" striped hover options={this.tokenOptions}>
                  <TableHeaderColumn isKey dataField="id" >Token Id</TableHeaderColumn>
                  <TableHeaderColumn dataField="token" dataFormat={itemTokenStringFormatter}>存取 Token</TableHeaderColumn>
                  <TableHeaderColumn dataField="status" dataSort>申請狀態</TableHeaderColumn>
                </BootstrapTable>
                <LaddaButton className="btn btn-lg btn-success btn-ladda-progress" size="lg" data-style={EXPAND_RIGHT} type="submit" disabled={this.state.data.status != 'approved'} onClick={this.createToken} loading={this.state.processing}>建立存取 Token</LaddaButton>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Application;
