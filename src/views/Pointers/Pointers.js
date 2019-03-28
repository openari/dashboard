import React, {Component} from 'react';
import {Card, CardHeader, CardBody, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import { getToken } from '../../services/AuthService';
import { listPointers, statusNameLookup } from '../../services/PointersService';


class Pointers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      table: [],
    };

    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
      onRowClick: this.handleSelection,
    };

    this.loadData();

  }

  loadData = () => {
    listPointers(getToken(), this.state.status)
    .then((data) => {
      data.forEach(function(item) {
        item.status = statusNameLookup(item.status);
      });
      this.setState({ table: data })
    });
  }

  render() {

    let itemIdFormatter = (cell, row) => {
      const itemLink = `#/pointers/${row.id}`;
      return <a href={itemLink}>{row.id}</a>;
    };

    let itemApplicantFormatter = (cell, row) => {
      const itemLink = `#/pointers/${row.id}`;
      return <a href={itemLink}>{row.applicant}</a>;
    };

    let itemPointerUrlFormatter = (cell, row) => {
      const itemLink = row.pointer_url;
      return <a href={itemLink} target="_blank">{row.pointer_url}</a>;
    };

    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>藝術作品{' '}
            <div className="card-header-actions">
            </div>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.state.table} version="4" striped hover pagination search options={this.options}>
              <TableHeaderColumn isKey dataField="id" hidden={true} dataFormat={itemIdFormatter}>Application</TableHeaderColumn>
              <TableHeaderColumn dataField="name" dataFormat={itemApplicantFormatter} dataSort>申請人/單位</TableHeaderColumn>
              <TableHeaderColumn dataField="phone" dataSort>聯絡電話</TableHeaderColumn>
              <TableHeaderColumn dataField="email" dataSort>Email</TableHeaderColumn>
              <TableHeaderColumn dataField="title">標題</TableHeaderColumn>
              <TableHeaderColumn dataField="pointer_url" dataFormat={itemPointerUrlFormatter}>指向連結</TableHeaderColumn>
              <TableHeaderColumn dataField="abstract">描述</TableHeaderColumn>
              <TableHeaderColumn dataField="status" dataSort>申請狀態</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Pointers;
