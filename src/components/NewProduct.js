import React, { useState } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";

export default function NewProduct() {
  const initialNewProductState = {
    description: '',
    price: '',
    shipped: false,
    image: null,
  };

  const [newProductData, setNewProductData] = useState({
    ...initialNewProductState,
  });

  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (name, value) => {
    setNewProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    console.log('product added!', newProductData);

    setNewProductData({ ...initialNewProductState });
  };

  const { shipped, description, price, image } = newProductData;

  return (
    <div className="flex-center">
      <h2 className="header">Add New Product</h2>
      <div>
        <Form className="market-header">
          <Form.Item label="Add Product Description">
            <Input
              value={description}
              type="text"
              icon="information"
              placeholder="description"
              onChange={(value) => handleChange('description', value)}
            />
          </Form.Item>

          <Form.Item label="Set Product Price">
            <Input
              value={price}
              type="number"
              icon="plus"
              placeholder="price ($USD)"
              onChange={(value) => handleChange('price', value)}
            />
          </Form.Item>

          <Form.Item label="Is the product Shipped or Emailed to the Customer?">
            <div className="text-center">
              <Radio
                value="true"
                checked={shipped}
                onChange={() => handleChange('shipped', true)}>
                Shipped
              </Radio>
              <Radio
                value="false"
                checked={!shipped}
                onChange={() => handleChange('shipped', false)}>
                Emailed
              </Radio>
            </div>
          </Form.Item>
          {/* {imagePreview && (
            <img
              src={imagePreview}
              alt="Product Preview"
              className="image-preview"
            />
          )} */}
          <PhotoPicker
            title="Product Image"
            onLoad={(url) => {
              setImagePreview(url);
            }}
            onPick={(file) => handleChange('image', file)}
            preview={true}
            // preview="hidden"
            theme={{
              formContainer: {
                margin: 0,
                padding: '0.8em',
              },
              sectionHeader: {
                padding: '0.2em',
                color: '#000',
                fontWeight: 700,
              },
              formSection: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
              sectionBody: {
                margin: 0,
                width: '250px',
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid #000',
              },

              photoPickerButton: {
                backgroundColor: '#f90',
              },
            }}
          />
          <Form.Item>
            <Button
              disabled={!image || !description || !price}
              type="primary"
              onClick={handleAddProduct}>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
