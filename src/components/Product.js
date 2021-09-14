import React, { useMemo, useState, useReducer } from 'react';
import { S3Image } from 'aws-amplify-react';

// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { convertCentsToDollars, convertDollarsToCents } from './../utils/index';
import { useStateValue } from '../context/currentUser';
import PayButton from './PayButton';
import { updateProduct, deleteProduct } from './../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

// need to add subscriptions so we don't have to refresh to see updated state
// they will execute after the mutations

const initialFormState = {
  description: '',
  price: '',
  shipped: false,
};

export const updateProductFormReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'RESET':
      return initialFormState;
    case 'SET_FORM':
      return {
        ...payload,
      };
    case 'UPDATE_FORM':
      return {
        ...state,
        [payload.name]: payload.value,
      };

    default:
      return state;
  }
};

export default function Product({ product }) {
  const { currentUser } = useStateValue();
  const [isUpdateProductDialogOpen, setIsUpdateProductDialogOpen] =
    useState(false);
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  // trying forms with reducer this time
  const [updateProductFormData, dispatchUpdateProductForm] = useReducer(
    updateProductFormReducer,
    initialFormState
  );

  const openProductUpdateDialog = () => {
    setIsUpdateProductDialogOpen(true);
    const { price, shipped, description } = product;
    dispatchUpdateProductForm({
      type: 'SET_FORM',
      payload: {
        price: convertCentsToDollars(price),
        shipped,
        description,
      },
    });
  };

  const closeProductUpdateDialog = () => {
    setIsUpdateProductDialogOpen(false);
    dispatchUpdateProductForm({ type: 'RESET' });
  };

  const isProductOwner = useMemo(
    () => currentUser.attributes.sub === product.owner,
    [currentUser.attributes.sub, product.owner]
  );

  const handleChangeUpdateProductForm = (name, value) => {
    dispatchUpdateProductForm({
      type: 'UPDATE_FORM',
      payload: { name, value },
    });
  };

  const handleUpdateProduct = async (productId) => {
    try {
      setIsUpdateProductDialogOpen(false);
      const input = {
        id: productId,
        ...updateProductFormData,
        price: convertDollarsToCents(updateProductFormData.price),
      };

      const result = await API.graphql(
        graphqlOperation(updateProduct, { input })
      );
      console.log({ result });
      Notification({
        title: 'Success',
        message: 'Product successfully updated!',
        type: 'success',
      });
    } catch (err) {
      console.error(`Failed to update product with id: ${productId}`, err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setIsDeletePopoverOpen(false);
      const input = {
        id: productId,
      };
      await API.graphql(graphqlOperation(deleteProduct, { input }));

      Notification({
        title: 'Success',
        message: 'Product successfully deleted!',
        type: 'success',
      });
    } catch (err) {
      console.error(`Failed to delete product with id: ${productId}`, err);
    }
  };

  const { description, price, shipped } = updateProductFormData;

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
      {/* Update / delete product btns */}
      <div className="text-center">
        {isProductOwner && (
          <>
            <Button
              type="warning"
              icon="edit"
              className="m-1"
              onClick={openProductUpdateDialog}
            />

            <Popover
              placement="top"
              width="160"
              trigger="click"
              visible={isDeletePopoverOpen}
              content={
                <>
                  <p>Do you want to delete this?</p>
                  <div className="text-right">
                    <Button
                      size="mini"
                      type="text"
                      className="m-1"
                      onClick={() => setIsDeletePopoverOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="mini"
                      className="m-1"
                      onClick={() => handleDeleteProduct(product.id)}>
                      Confirm
                    </Button>
                  </div>
                </>
              }>
              <Button
                type="danger"
                icon="delete"
                className="m-1"
                onClick={() => setIsDeletePopoverOpen(true)}
              />
            </Popover>
          </>
        )}
      </div>

      {/* Update product dialog */}
      <Dialog
        title="Update Product"
        size="large"
        customClass="dialog"
        visible={isUpdateProductDialogOpen}
        onCancel={closeProductUpdateDialog}>
        <Dialog.Body>
          <Form labelPosition="top">
            <Form.Item label="Update Description">
              <Input
                icon="info"
                value={description}
                trim={true}
                placeholder="description"
                onChange={(value) =>
                  handleChangeUpdateProductForm('description', value)
                }
              />
            </Form.Item>

            <Form.Item label="Update Price">
              <Input
                value={price}
                type="number"
                icon="plus"
                placeholder="price ($USD)"
                onChange={(value) =>
                  handleChangeUpdateProductForm('price', value)
                }
              />
            </Form.Item>

            <Form.Item label="Update shipping">
              <div className="text-center">
                <Radio
                  value="true"
                  checked={shipped}
                  onChange={() =>
                    handleChangeUpdateProductForm('shipped', true)
                  }>
                  Shipped
                </Radio>
                <Radio
                  value="false"
                  checked={!shipped}
                  onChange={() =>
                    handleChangeUpdateProductForm('shipped', false)
                  }>
                  Emailed
                </Radio>
              </div>
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={closeProductUpdateDialog}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => handleUpdateProduct(product.id)}>
            Update
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
