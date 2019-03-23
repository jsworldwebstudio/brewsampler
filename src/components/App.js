import React, { Component } from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon } from 'gestalt';
import { Link } from 'react-router-dom';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337';
const apiUrl = process.env.REACT_APP_API_URL;
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  };

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });
      // console.log(response);
      this.setState({ brands: response.data.brands, loadingBrands: false });
    } catch (err) {
      console.error(err);
      this.setState({ loadingBrands: false });
    }
  };

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value }, () => this.searchBrands());
  };

  // filteredBrands = (searchTerm, brands) => {
  //   return brands.filter(brand => {
  //     return ( 
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // };

  getImageBrandName = brandName => {
    // let newBrandName = brandName.replace(" ", "_");
    return brandName.toLowerCase().replace(/ /g, "-");
  };

  searchBrands = async () => {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
          brands(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
            _id
            name
            description
            image {
              url
            }
          }
        }`
      }
    });
    // console.log(this.state.searchTerm, response.data.brands);
    this.setState({
      brands: response.data.brands,
      loadingBrands: false
    });
  };

  render() {
    const { brands, searchTerm, loadingBrands } = this.state;

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Search Brands"
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* Brand Section */}
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
        {/* Brands Header */}
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {/*this.filteredBrands(searchTerm, brands).map(brand => (*/}
          {/*src={`${apiUrl}${brand.image.url}`}*/}
          {brands.map(brand => (
            <Box
              paddingY={4}
              margin={2}
              width={200}
              key={brand._id}
            >
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`./images/brand-${this.getImageBrandName(brand.name)}.png`}
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
                  <Text bold size="xl">{brand.name}</Text>
                  <Box height={75}><Text>{brand.description}</Text></Box>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        {/* <Spinner
          show={loadingBrands}
          accessibilityLabel="Loading Spinner"
        />  IF USE, ADD Spinner TO IMPORTED ELEMENTS FROM Gestalt */}
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
