import React, { Component } from 'react';
import { Container, Box, Button, Heading, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from '../utils';

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

class Signin extends Component {
  state={
    username: '',
    password: '',
    toast: false,
    toastMessage: '',
    loading: false
  };

  handleChange =({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, password } = this.state;

    if(!this.isFormEmpty(this.state)) {
      this.showToast('Fill in all the fields');
      return;
    }

    // Sign up User
    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      // console.log(response);
      this.redirectUser('/');
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, password }) => {
    return username && password;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: '' }), 5000);
  };

  render() {
    const { toastMessage, toast, loading } = this.state;

    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#d6a3b1'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
        >
          {/* Sign In Form */}
          <form
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign In Form Heading */}
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Welcome Back!</Heading>
            </Box>
            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Password Input */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button
              inline
              disabled={loading}
              color="blue"
              type="submit"
              text="Submit"
            />
          </form>
        </Box>
        {/*
        <Box
          marginTop={2}
          display="flex"
          direction="column"
          alignItems="center"
        >
          <ToastMessage message={toastMessage} show={toast} />
        </Box>
        */}
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    )
  }
};

export default Signin;
