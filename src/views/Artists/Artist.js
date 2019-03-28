import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { getToken } from '../../services/AuthService';
import { getArtist, approveArtist, columnNameLookup, statusNameLookup } from '../../services/ArtistsService';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Moment from 'react-moment';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import { MsgModal } from '../../views/Notifications';

import 'ladda/dist/ladda-themeless.min.css';

class Artist extends Component {
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

    getArtist(getToken(), this.props.match.params.id)
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

  confirmApprove = (e) => {
    this.setState({
      isConfirmModalOpen: false,
    }, () => {
      approveArtist(getToken(), this.props.match.params.id)
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

  render() {

    const data = this.state.data ? Object.entries(this.state.data) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <MsgModal msgType="warning" title="是否確定?" hideOK={true} isOpen={this.state.isConfirmModalOpen} onRequestClose={this.closeConfirmModal}>
          <p>您確定要審核通過此藝術家的申請?</p>
          <Button color="ghost-danger" onClick={this.confirmApprove}>是的，確定通過!</Button>
        </MsgModal>
        <MsgModal msgType="success" title="成功完成!" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>藝術家已通過申請</p>
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
                <strong><i className="icon-info pr-1"></i>藝術家 Id: {this.props.match.params.id}</strong>
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
          </Col>
        </Row>
      </div>
    )
  }
}

export default Artist;
