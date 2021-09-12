import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
import { useStateValue } from '../context/currentUser';
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

export default function NewMarket() {
  const [isAddMarketDialogShowing, setIsAddMarketDialogShowing] = useState(
    false
  );
  const [marketName, setMarketName] = useState('');
  const { currentUser } = useStateValue();

  const openAddMarketDialog = () => setIsAddMarketDialogShowing(true);
  const closeAddMarketDialog = () => setIsAddMarketDialogShowing(false);

  const handleAddMarket = async (user) => {
    try {
      closeAddMarketDialog();

      const input = {
        name: marketName,
        owner: user.username,
      };

      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      );
      const createdMarket = result.data.createMarket;
      console.log(`created market: id ${createdMarket.id}`);
      setMarketName('');
    } catch (err) {
      console.error('Error adding new market', err);
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error adding market'}`,
      });
    }
  };

  return (
    <>
      <div className="market-header">
        <h1 className="market-title">
          Create Your Marketplace
          <Button
            type="text"
            icon="edit"
            className="market-title-button"
            onClick={openAddMarketDialog}
          />
        </h1>
      </div>

      <Dialog
        title="Create New Market"
        visible={isAddMarketDialogShowing}
        onCancel={closeAddMarketDialog}
        size="large"
        customClass="dialog">
        <Dialog.Body>
          <Form labelPosition="top">
            <Form.Item label="Add Market Name">
              <Input
                value={marketName}
                placeholder="Market Name"
                trim={true} // trim whitespaces
                onChange={(value) => setMarketName(value)}
              />
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={closeAddMarketDialog}>Cancel</Button>
          <Button
            type="primary"
            disabled={!marketName}
            onClick={() => handleAddMarket(currentUser)}>
            Add
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
