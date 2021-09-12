import React, { useState } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import aws_exports from '../aws-exports';
import { createProduct } from '../graphql/mutations';
import { convertDollarsToCents } from '../utils/';

export default function NewProduct({ marketId }) {
  const initialNewProductState = {
    description: '',
    price: '',
    shipped: false,
    image: null,
  };

  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(0);
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

  const handleAddProduct = async () => {
    try {
      setIsUploading(true);

      const visibility = 'public';
      const { image } = newProductData;
      const { identityId } = await Auth.currentCredentials();

      const filename = `/${visibility}/${identityId}/${Date.now()}-${
        image.name
      }`;

      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: (progress) => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentUploaded = Math.round(
            (progress.loaded / progress.total) * 100
          ); // when it's multiplied by 100 it's going to give us a result as a decimal so to convert to a whole number  we use Math.round
          setPercentUploaded(percentUploaded);
        },
      });

      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region,
      };

      const input = {
        productMarketId: marketId,
        description: newProductData.description,
        shipped: newProductData.shipped,
        price: convertDollarsToCents(newProductData.price),
        file,
      };

      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      );
      console.log('Created product', result);

      Notification({
        title: 'Success',
        message: 'Product Successfully created',
        type: 'success',
      });
      setNewProductData({ ...initialNewProductState });
      setImagePreview('');
      setPercentUploaded(0);
      setIsUploading(false);
    } catch (err) {
      console.error('error creating product', err);
    }
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
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product Preview"
              className="image-preview"
            />
          )}

          {percentUploaded > 0 && (
            <Progress
              type="circle"
              className="progress"
              percentage={percentUploaded}
            />
          )}

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
              disabled={!image || !description || !price || isUploading}
              type="primary"
              onClick={handleAddProduct}
              loading={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
