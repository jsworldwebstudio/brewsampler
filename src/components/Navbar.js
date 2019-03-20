import React, { Component } from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { NavLink, withRouter } from 'react-router-dom';
import { getToken, clearToken, clearCart } from '../utils';

class Navbar extends Component {
  handleSignOut = () => {
    clearToken();
    clearCart();
    this.props.history.push('/');
  };

  render() {
    return getToken() !== null ?
      <AuthNav handleSignOut={this.handleSignOut} /> : <UnAuthNav />;
  };
};

const AuthNav = ({ handleSignOut }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      {/* Checkout Link */}
      <NavLink activeClassName="active" to="/checkout">
        <Text size="xl" color="white">Checkout</Text>
      </NavLink>

      {/* Title and Logo */}
      <NavLink activeClassName="active" exact to="/">
        <Box display="flex" alignItems="center">
          <Box margin={2} height={50} width={50}>
            <Image
              naturalHeight={1}
              naturalWidth={1}
              alt="BrewSampler Logo"
              src="./icons/logo.svg"
            />
          </Box>
          <div className="main-title">
            <Heading size="xs" color="orange">BrewSampler</Heading>
          </div>
        </Box>
      </NavLink>

      {/* Signout Button */}
      <Button
        inline
        color="transparent"
        text="Sign Out"
        inlinesize="md"
        onClick={handleSignOut}
      />
    </Box>
  );
};

const UnAuthNav = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      {/* Sign In Link */}
      <NavLink activeClassName="active" to="/signin">
        <Text size="xl" color="white">Sign In</Text>
      </NavLink>

      {/* Title and Logo */}
      <NavLink activeClassName="active" exact to="/">
        <Box display="flex" alignItems="center">
          <Box margin={2} height={50} width={50}>
            <Image
              naturalHeight={1}
              naturalWidth={1}
              alt="BrewSampler Logo"
              src="./icons/logo.svg"
            />
          </Box>
          <div className="main-title">
            <Heading size="xs" color="orange">BrewSampler</Heading>
          </div>
        </Box>
      </NavLink>

      {/* Sign Up Link */}
      <NavLink activeClassName="active" to="/signup">
        <Text size="xl" color="white">Sign Up</Text>
      </NavLink>
    </Box>
  );
};

export default withRouter(Navbar);