import React, { Component } from 'react';
import { getToken } from '../../../services/AuthService';
import { getArt } from '../../../services/ArtsService';

class ArtLink extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    console.log(props);
    getArt(getToken(), props.artId)
    .then(creator => {
      this.setState(creator);
    });
  }

  render() {
    const url = `#/arts/${this.state.id}`;
    return <a href={url} target={this.props.newWindow ? '_blank' : ''}>{this.state.id}</a>
  }
}

export default ArtLink;
