import React, { Component } from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Signup extends Component {
  state={
    username: '',
    email: '',
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
    const { username, email, password } = this.state;

    if(!this.isFormEmpty(this.state)) {
      this.showToast('Fill in all the fields');
      return;
    }

    // Sign up User
    try {
      this.setState({ loading: true });
      const response = await strapi.register(username, email, password);
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

  isFormEmpty = ({ username, email, password }) => {
    return username && email && password;
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
              backgroundColor: '#ebe2da'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
        >
          {/* Sign Up Form */}
          <form
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign Up Form Heading */}
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Let's Get Started</Heading>
              <Text italic color="orchid">Sign up to order some brews!</Text>
            </Box>
            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Email Address Input */}
            <TextField
              id="email"
              type="text"
              name="email"
              placeholder="Email Address"
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

export default Signup;
