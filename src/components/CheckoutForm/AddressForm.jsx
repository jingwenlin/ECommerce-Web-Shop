import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Grid, Typography, Button} from '@material-ui/core';
import { commerce } from '../../lib/commerce';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken,next }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]); // Added state for shippingOptions
  const [shippingOption, setShippingOption] = useState(''); // Added state for shippingOption
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
  const options = shippingOptions.map((so) => ({
    id: so.id,
    label: `${so.description} - (${so.price.formatted_with_symbol})`
  }));

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]); // Set default to first country
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]); // Set default to first subdivision
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    setShippingOptions(options);
    setShippingOption(options[0].id); // Set default to first option
  };

  useEffect(() => {
    if (checkoutToken) {
      fetchShippingCountries(checkoutToken.id);
    }
  }, [checkoutToken]);

  useEffect(() => {
    if (shippingCountry) {
      fetchSubdivisions(shippingCountry);
    }
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) {
      fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping Address</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption}))}>
          <Grid container spacing={3}>
            <FormInput name='firstName' label='First name' />
            <FormInput name='lastName' label='Last name' />
            <FormInput name='address1' label='Address' />
            <FormInput name='email' label='Email' />
            <FormInput name='city' label='City' />
            <FormInput name='zip' label='ZIP / Postal code' />

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link}  to="/cart" variant="outlined">Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>
          </div>
          
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
