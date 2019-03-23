import React, { Component } from 'react'
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Heading, Card, Image, Text, Button, Mask, IconButton } from 'gestalt';
import { Link } from 'react-router-dom';
import { calculatePrice, setCart, getCart } from '../utils';
import Loader from './Loader';

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

class Brews extends Component {
  state = {
    brews: [],
    brand: "",
    cartItems: [],
    loadingBrews: true
  };

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brand(id: "${this.props.match.params.brandId}") {
              _id
              name
              brews {
                _id
                name
                description
                image {
                  url
                }
                price
              }
            }
          }`
        }
      });
      // console.log(response);
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cartItems: getCart(),
        loadingBrews: false
      });
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrews: false });
    }
  };

  addToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id);

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemToBeDeletedId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToBeDeletedId
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  getImageBrewName = (brandName, brewName) => {
    const newBrandName = brandName.toLowerCase().replace(/\s/g, "-");
    if (newBrandName === 'goose-island') {
      return "gi-" + brewName.toLowerCase().replace(/\s/g, "-") + ".png";
    } else {
      return brewName.toLowerCase().replace(/\s/g, "-") + ".jpg";
    }
  };

  render() {
    const { brand, brews, cartItems, loadingBrews } = this.state;
    return ( 
        <Box
          marginTop={4}
          display="flex"
          justifyContent="center"
          alignItems="start"
          dangerouslySetInlineStyle={{
            __style: {
              flexWrap: 'wrap-reverse'
            }
          }}
        >         
          { !loadingBrews && <React.Fragment>
          {/* Brews Section */}
          <Box display="flex" direction="column" alignItems="center">
            {/* Brews Heading */}
            <Box margin={2}>
              <Heading color="orchid">{brand}</Heading>
            </Box>
            {/* Brews */}
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: '#bdcdd9'
                }
              }}
              wrap
              shape="rounded"
              display="flex"
              justifyContent="center"
              padding={4}
            >
              {brews.map(brew => (
                <Box
                  paddingY={4}
                  margin={2}
                  width={210}
                  key={brew._id}
                >
                  <Card
                    image={
                      <Box height={250} width={200}>
                        <Image
                          fit="cover"
                          alt="Brew"
                          naturalHeight={1}
                          naturalWidth={1}
                          src={`./images/${this.getImageBrewName(brand, brew.name)}`}
                        />
                      </Box>
                    }
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      direction="column"
                    >
                      <Box marginBottom={2}><Text bold size="xl">{brew.name}</Text></Box>
                      <Box height={180} marginBottom={2}>
                        <Text>{brew.description}</Text>
                      </Box>
                      <Text color="orchid">${brew.price}</Text>
                      <Box marginTop={2}>
                        <Text bold size="xl">
                          <Button onClick={() => this.addToCart(brew)} color="blue" text="Add to Cart" />
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
          {/* User Cart */}
          <Box alignSelf="end" marginTop={2} marginLeft={2}>
            <Mask shape="rounded" wash>
              <Box
                display="flex"
                direction="column"
                alignItems="center"
                padding={2}
              >
                {/* User Cart Heading */}
                <Heading align="center" size="sm">Your Cart</Heading>
                <Text color="gray" italic>
                {cartItems.length} items selected
                </Text>

                {/* Cart Items */}
                {cartItems.map(item =>(
                  <Box key={item._id} display="flex" alignItems="center">
                    <Text>
                      {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                    </Text>
                    <IconButton
                      accessibilityLabel="Delete Item"
                      icon="cancel"
                      size="sm"
                      iconColor='red'
                      onClick={() => this.deleteItemFromCart(item._id)}
                    />
                  </Box>
                ))}

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Box margin={2}>
                    {cartItems.length === 0 && (
                      <Text color="red">Please select some items</Text>
                    )}
                  </Box>
                  <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                  <Text>
                    <Link to="/checkout">Checkout</Link>
                  </Text>
                </Box>
              </Box>
            </Mask>
          </Box>
          </React.Fragment>}
          <Loader show={loadingBrews} />
        </Box>
      )
  }
};

export default Brews;