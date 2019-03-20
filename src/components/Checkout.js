import React, { Component } from 'react';
import { Container, Box, Heading, Text, TextField } from 'gestalt';
import { Elements, StripeProvider, CardElement, injectStripe } from
  'react-stripe-elements';
import ToastMessage from './ToastMessage';
import Strapi from 'strapi-sdk-javascript/build/main';
import { getCart, calculatePrice, calculateAmount, clearCart } from '../utils';
import { withRouter } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
  state={
    cartItems: [],
    address: '',
    postalCode: '',
    city: '',
    confirmationEmailAddress: '',
    toast: false,
    toastMessage: '',
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() })
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if(!this.isFormEmpty(this.state)) {
      this.showToast('Fill in all the fields');
      return;
    }

    this.setState({ modal: true });
  };

  redirectUser = path => this.props.history.push(path);

  handleSubmitOrder = async () => {
    const { cartItems, city, address, postalCode, confirmationEmailAddress } = this.state;
    const amount = calculateAmount(cartItems);
    // Process order
    this.setState({ orderProcessing: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      await strapi.createEntry('orders', {
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token
      });
      await strapi.request('POST', '/email', {
        data: {
          to: confirmationEmailAddress,
          from: 'jsworldwebstudio@gmail.com',
          subject: `Order Confirmation - BrewSampler ${new Date(Date.now())}`,
          text: 'Your order has been processed',
          html: '<bold>Expect your order to arrive in 2-3 shipping days</bold>'
        }
      });
      this.setState({ orderProcessing: false, modal: false });
      clearCart();
      this.showToast('Your order has been successfully submitted!', true);
    } catch (err) {
      this.setState({ orderProcessing: false, modal: false });
      this.showToast(err.message); 
    }
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return address && postalCode && city && confirmationEmailAddress ;
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({ toast: true, toastMessage });
    // previous line of code below...no callback, no redirect param...
    // setTimeout(() => this.setState({ toast: false, toastMessage: '' }), 5000);
    
    setTimeout(() => this.setState({ toast: false, toastMessage: '' },
    // add callback function if true passed to redirect argument, redirect to home
      () => redirect && this.props.history.push('/')
    ), 5000);
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { toastMessage, toast, cartItems, modal, orderProcessing } = this.state;

    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
          margin={4}
          padding={4}
          shape="rounded"
          color="darkWash"
        >
          {/* Checkout Form Heading */}
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? <React.Fragment>
          {/* User Cart */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            direction="column"
            marginTop={2}
            marginBottom={6}
          >
            <Text color="darkGray" italic>{cartItems.length} Item&#40;s&#41; for Checkout</Text>
            <Box padding={2}>
              {cartItems.map(item => (
                <Box key={item._id} padding={1}>
                  <Text color="midnight">
                    {item.name} X {item.quantity} - ${item.quantity * item.price}
                  </Text>
                </Box>
              ))}
            </Box>
            <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
          </Box>

          {/* Checkout Form */}
          <form
            style={{
              display: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
            onSubmit={this.handleConfirmOrder}
          >
            {/* Shipping Address Input */}
            <TextField
              id="address"
              type="text"
              name="address"
              placeholder="Shipping Address"
              onChange={this.handleChange}
            />
            {/* Postal Code Input */}
            <TextField
              id="postalCode"
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              onChange={this.handleChange}
            />
            {/* City Input */}
            <TextField
              id="city"
              type="text"
              name="city"
              placeholder="City of Residence"
              onChange={this.handleChange}
            />
            {/* Confirmation Email Address Input */}
            <TextField
              id="confirmationEmailAddress"
              type="email"
              name="confirmationEmailAddress"
              placeholder="Confirmation Email Address"
              onChange={this.handleChange}
            />
            {/* Card Element - Area for Users to type their card info */}
            <CardElement
              id="stript__input"
              onReady={input => input.focus()}
            />
            <button id="stripe__button" type="submit">Submit</button>
          </form>
          </React.Fragment> : (
            // Default Text if no items in the cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your Cart is Empty
              </Heading>
              <Text align="center" italic color="green">
                Please make some brew selections!!!
              </Text>
            </Box>
          )}
        </Box>
        {/* Confirmation Modal */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    )
  }
};

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider apiKey="pk_test_p8jgfkFYM4MH44ZWzLXf6I3Z">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;