import React, {Component} from 'react';
import {Card, CardHeader, CardBody, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import { getToken } from '../../services/AuthService';
import { listArtists, statusNameLookup } from '../../services/ArtistsService';


class Artists extends Component {
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
    }

    this.loadData();

  }

  loadData = () => {
    listArtists(getToken(), this.state.status)
    .then((data) => {
      data.forEach(function(item) {
        item.status = statusNameLookup(item.status);
      });
      this.setState({ table: data })
    });
  }

  render() {

    let itemIdFormatter = (cell, row) => {
      const itemLink = `#/artists/${row.id}`;
      return <a href={itemLink}>{row.id}</a>;
    };

    let itemNameFormatter = (cell, row) => {
      const itemLink = `#/artists/${row.id}`;
      return <a href={itemLink}>{row.name}</a>;
    };

    let itemUrlFormatter = (cell, row) => {
      const itemLink = row.url;
      return <a href={itemLink} target="_blank">{row.url}</a>;
    };

    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>藝術家{' '}
            <div className="card-header-actions">
            </div>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.state.table} version="4" striped hover pagination search options={this.options}>
              <TableHeaderColumn isKey dataField="id" hidden={true} dataFormat={itemIdFormatter}>Application</TableHeaderColumn>
              <TableHeaderColumn dataField="name" dataFormat={itemNameFormatter} dataSort>申請人/單位</TableHeaderColumn>
              <TableHeaderColumn dataField="phone" dataSort>聯絡電話</TableHeaderColumn>
              <TableHeaderColumn dataField="email" dataSort>Email</TableHeaderColumn>
              <TableHeaderColumn dataField="url" dataFormat={itemUrlFormatter}>單位或個人社群網頁</TableHeaderColumn>
              <TableHeaderColumn dataField="source" >如何得知這個實驗計畫</TableHeaderColumn>
              <TableHeaderColumn dataField="description" >簡易申請描述</TableHeaderColumn>
              <TableHeaderColumn dataField="status" dataSort>申請狀態</TableHeaderColumn>
              <TableHeaderColumn dataField="invitation_code" dataSort>邀請碼</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Artists;
