import React, { useMemo } from 'react';
import { S3Image } from 'aws-amplify-react';

// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { convertCentsToDollars } from './../utils/index';
import { useStateValue } from '../context/currentUser';
import PayButton from './PayButton';

export default function Product({ product }) {
  const { currentUser } = useStateValue();

  const isProductOwner = useMemo(
    () => currentUser.attributes.sub === product.owner,
    [currentUser.attributes.sub, product.owner]
  );

  return (
    <div className="card-container">
      <Card bodyStyle={{ padding: 0, minWidth: '200px' }}>
        <S3Image
          imgKey={product.file.key}
          theme={{
            photoImg: {
              maxWidth: '100%',
              maxHeight: '100%',
            },
          }}
        />
        <div className="card-body">
          <h3 className="m-0">{product.description}</h3>
          <div className="items-center">
            <img
              src={`https://icon.now.sh/${
                product.shipped ? 'markunread_mailbox' : 'mail'
              }`}
              alt={'Shipping Icon'}
              className="icon"
            />
            {product.shipped ? 'Shipped' : 'Emailed'}
          </div>

          <div className="text-right">
            <span className="mx-1">{convertCentsToDollars(product.price)}</span>
            {!isProductOwner && <PayButton />}
          </div>
        </div>
      </Card>
    </div>
  );
}
