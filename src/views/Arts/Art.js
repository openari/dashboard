import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { getToken } from '../../services/AuthService';
import { getArt, approveArt, identificationColumnNameLookup, statusNameLookup } from '../../services/ArtsService';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Moment from 'react-moment';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import { MsgModal } from '../../views/Notifications';

import 'ladda/dist/ladda-themeless.min.css';

class Art extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isSuccessModalOpen: false,
      isWarningModalOpen: false,
    };

    this.logTableOptions = {
      sortIndicator: false,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
    }

    getArt(getToken(), this.props.match.params.id)
    .then(data => {
      console.log(data.identification);
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

  confirmApprove = (e) => {
    this.setState({
      isConfirmModalOpen: false,
    }, () => {
      approveArt(getToken(), this.props.match.params.id)
      .then(() => {
        this.setState({
          isSuccessModalOpen: true,
          processing: false
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

  toggleImageModal = () => {
    this.setState({
      imageModalShowing: !this.state.imageModalShowing
    });
  }

  showArtImage = () => {
    this.setState({
      imageModalShowing: true,
      imageModalImageSrc: this.state.data.identification.image
    });
  }

  render() {

    var data = this.state.data ? Object.entries(this.state.data) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]
    const identification = this.state.data.identification ? Object.entries(this.state.data.identification) : []
    const ownership = this.state.data.ownership ? Object.entries(this.state.data.ownership) : []

    return (
      <div className="animated fadeIn">
        <MsgModal msgType="warning" title="是否確定?" hideOK={true} isOpen={this.state.isConfirmModalOpen} onRequestClose={this.closeConfirmModal}>
          <p>您確定要審核通過此藝術品的申請?</p>
          <Button color="ghost-danger" onClick={this.confirmApprove}>是的，確定通過!</Button>
        </MsgModal>
        <MsgModal msgType="success" title="成功完成!" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>藝術品已通過申請</p>
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
                <strong><i className="icon-info pr-1"></i>藝術品 Id: {this.props.match.params.id}</strong>
                <div className="card-header-actions">
                </div>
              </CardHeader>
              <CardBody>
                  <h4>申請人或組織</h4>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        data.map(([key, value], index) => {
                          if (key == 'title' || key == 'subject' || key == 'identification' || key == 'ownership') {
                            return;
                          } else if (key == 'status') {
                            return (
                              <tr key={index.toString()}>
                                <td>{identificationColumnNameLookup(key)}</td>
                                <td><strong>{statusNameLookup(value.toString())}</strong></td>
                              </tr>
                            )
                          } else {
                            return (
                              <tr key={index.toString()}>
                                <td>{identificationColumnNameLookup(key)}</td>
                                <td><strong>{value.toString()}</strong></td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </Table>

                  <h4>識别部</h4>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        identification.map(([key, value], index) => {
                            if (key === 'id' || key === 'type' ||
                                key === 'art_id' || key === 'attachments' ||
                                key === 'created_at' || key === 'updated_at') {
                                  return null;
                            } else if (key === 'image') {
                              const style = {maxWidth: '300px'};
                              return (
                                <tr key={index.toString()}>
                                  <td>{identificationColumnNameLookup(key)}</td>
                                  <td>
                                    <img src={value} style={style} onClick={this.showArtImage} alt="Art" />
                                  </td>
                                </tr>
                              );
                            }
                            return (
                              <tr key={index.toString()}>
                                <td>{identificationColumnNameLookup(key)}</td>
                                <td><strong>{value.toString()}</strong></td>
                              </tr>
                            );
                        })
                      }
                    </tbody>
                  </Table>

                  <h4>所有權部</h4>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        ownership.map(([key, value], index) => {
                            if (key === 'id' || key === 'type' || key === 'art_id' ||
                                key === 'created_at' || key === 'updated_at') {
                                  return null;
                            }
                            return (
                              <tr key={index.toString()}>
                                <td>{identificationColumnNameLookup(key)}</td>
                                <td><strong>{(value || '').toString()}</strong></td>
                              </tr>
                            )
                        })
                      }
                    </tbody>
                  </Table>

                  <LaddaButton className="btn btn-lg btn-success btn-ladda-progress" size="lg" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleApprove} loading={this.state.processing}>審核通過</LaddaButton>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Art;
