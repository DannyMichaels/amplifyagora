import React, { useState } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";

export default function NewProduct() {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    shipped: false,
  });

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    console.log('product added!');
  };

  return (
    <div className="flex-center">
      <h2 className="header">Add New Product</h2>
      <div>
        <Form className="market-header">
          <Form.Item label="Add Product Description">
            <Input
              type="text"
              icon="information"
              placeholder="description"
              onChange={(value) => handleChange('description', value)}
            />
          </Form.Item>

          <Form.Item label="Set Product Price">
            <Input
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
                checked={formData.shipped}
                onChange={() => handleChange('shipped', true)}>
                Shipped
              </Radio>
              <Radio
                value="false"
                checked={!formData.shipped}
                onChange={() => handleChange('shipped', false)}>
                Emailed
              </Radio>
            </div>
          </Form.Item>
          <PhotoPicker />
          <Form.Item>
            <Button type="primary" onClick={handleAddProduct}>
              {' '}
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
