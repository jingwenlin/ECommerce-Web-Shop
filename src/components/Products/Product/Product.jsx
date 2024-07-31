import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import useStyles from './styles';

const Product = ({ product, onAddToCart }) => {
  const classes = useStyles();

  // Check if product and its properties are defined
  const mediaSource = product?.image?.url || 'https://via.placeholder.com/150';
  const productName = product?.name || 'Unknown Product';
  const productPrice = product?.price?.formatted_with_symbol || 'N/A';
  const productDescription = product?.description || 'No description available';

  // Log the product and mediaSource for debugging
  console.log('Product:', product);
  console.log('Media Source:', mediaSource);

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={mediaSource} 
        title={productName}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
      />
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant="h5" gutterBottom>
            {productName}
          </Typography>
          <Typography variant="h5">
            {productPrice}
          </Typography>
        </div>
        <Typography dangerouslySetInnerHTML={{ __html: product.description }} variant="body2" color="textSecondary"/>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <IconButton aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default Product;
