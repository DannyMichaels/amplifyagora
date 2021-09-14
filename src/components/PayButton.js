import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
};

const PayButton = ({ product, currentUser }) => {
  return (
    <StripeCheckout
      email={currentUser.attributes.email}
      name={product.description}
      amount={product.price}
      billingAddress={product.shipped}
      shippingAddress={product.shipped}
      currency={stripeConfig.currency}
      stripkeyKey={stripeConfig.publishableAPIKey}
      locale="auto"
      allowRememberMe={false}
    />
  );
};

export default PayButton;
