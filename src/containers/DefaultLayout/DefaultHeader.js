import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

import { isLoggedIn, getIdToken, logout } from '../../services/AuthService';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authIdToken: getIdToken() || {}
    };

  }

  handleLogout = (e) => {
    logout();
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
        </Nav>
        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/2.jpg'} className="img-avatar" alt={this.state.authIdToken.email} />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
            <DropdownItem header tag="div" className="text-center"><strong>Admin Accounts</strong></DropdownItem>
                <DropdownItem><a href="#/admins"><i className="fa fa-wrench"></i> Admin Accounts</a></DropdownItem>
                <DropdownItem header tag="div" className="text-center"><strong>My Account</strong></DropdownItem>
                <DropdownItem><i className="fa fa-user"></i> {this.state.authIdToken.email}</DropdownItem>
                <DropdownItem><a href="#/change-password"><i className="fa fa-wrench"></i> Change Password</a></DropdownItem>
                <DropdownItem onClick={this.handleLogout}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
