import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { API } from 'aws-amplify';
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
};

const PayButton = ({ product, currentUser }) => {
  const handleCharge = async (token) => {
    try {
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
        },
      });
      console.log({ result });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StripeCheckout
      token={handleCharge}
      email={currentUser.attributes.email}
      name={product.description}
      amount={product.price}
      billingAddress={product.shipped}
      shippingAddress={product.shipped}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      locale="auto"
      allowRememberMe={false}
    />
  );
};

export default PayButton;
