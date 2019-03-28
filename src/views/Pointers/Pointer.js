import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { getToken } from '../../services/AuthService';
import { getPointer, approvePointer, identificationColumnNameLookup, statusNameLookup } from '../../services/PointersService';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Moment from 'react-moment';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import { MsgModal } from '../../views/Notifications';
import ArtLink from '../../views/Common/AppLinks/ArtLink';

import 'ladda/dist/ladda-themeless.min.css';

class Pointer extends Component {
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

    getPointer(getToken(), this.props.match.params.id)
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
      approvePointer(getToken(), this.props.match.params.id)
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

    var data = this.state.data ? Object.entries(this.state.data) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]
    const identification = this.state.data.identification ? Object.entries(this.state.data.identification) : []
    const ownership = this.state.data.ownership ? Object.entries(this.state.data.ownership) : []

    return (
      <div className="animated fadeIn">
        <MsgModal msgType="warning" title="是否確定?" hideOK={true} isOpen={this.state.isConfirmModalOpen} onRequestClose={this.closeConfirmModal}>
          <p>您確定要審核通過此指向申請?</p>
          <Button color="ghost-danger" onClick={this.confirmApprove}>是的，確定通過!</Button>
        </MsgModal>
        <MsgModal msgType="success" title="成功完成!" isOpen={this.state.isSuccessModalOpen} onRequestClose={this.closeSuccessModal}>
          <p>已通過指向申請</p>
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
                <strong><i className="icon-info pr-1"></i>指向 Id: {this.props.match.params.id}</strong>
                <div className="card-header-actions">
                </div>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        data.map(([key, value], index) => {
                          if (key == 'title' || key == 'subject' || key == 'identification' || key == 'ownership') {
                            return;
                          } else if (key === 'art_id') {
                            return (
                              <tr key={index.toString()}>
                                <td>原作品</td>
                                <td><ArtLink artId={value} newWindow={true}/></td>
                              </tr>
                            );
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

                  <LaddaButton className="btn btn-lg btn-success btn-ladda-progress" size="lg" data-style={EXPAND_RIGHT} type="submit" onClick={this.handleApprove} loading={this.state.processing}>審核通過</LaddaButton>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Pointer;
