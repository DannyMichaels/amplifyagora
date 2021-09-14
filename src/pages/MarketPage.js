import React, { useEffect, useState } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import { Loading, Tabs, Icon } from 'element-react';
// import { getMarket } from './../graphql/queries';

import { Link } from 'react-router-dom';
import { useStateValue } from '../context/currentUser';
import NewProduct from './../components/NewProduct';
import Product from './../components/Product';

// need to add subscriptions so we don't have to refresh to see updated state
// they will execute after the mutations
import {
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
} from './../graphql/subscriptions';

const getMarket = /* GraphQL */ `
  query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          file {
            key
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

export default function MarketPage() {
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketOwner, setIsMarketOwner] = useState(false);
  const { currentUser } = useStateValue();
  const { marketId } = useParams();

  const getUser = async () => {
    return await Auth.currentUserInfo();
  };

  const checkMarketOwner = async (market) => {
    if (currentUser) {
      setIsMarketOwner(currentUser.username === market?.owner);
    }
  };

  const handleGetMarket = async () => {
    const input = {
      id: marketId,
    };

    const result = await API.graphql(graphqlOperation(getMarket, input));
    let market = result.data.getMarket;
    setMarket(market);
    checkMarketOwner(market);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetMarket();

    let createProductListener, deleteProductListener, updateProductListener;

    const activateProductListeners = async () => {
      createProductListener = API.graphql(
        graphqlOperation(onCreateProduct, { owner: (await getUser()).username })
      ).subscribe({
        next: (productData) => {
          console.log({ productData });
          const createdProduct = productData.value.data.onCreateProduct;

          setMarket((prevState) => {
            const prevProducts = prevState.products.items.filter(
              (item) => item.id !== createdProduct.id
            );
            const updatedProducts = [createdProduct, ...prevProducts];
            let updatedMarket = { ...prevState };
            updatedMarket.products.items = updatedProducts;
            return updatedMarket;
          });
        },
      });

      updateProductListener = API.graphql(
        graphqlOperation(onUpdateProduct, {
          owner: (await getUser()).username,
        })
      ).subscribe({
        next: (productData) => {
          const updatedProduct = productData.value.data.onUpdateProduct;

          let marketCopy = [...market];
          const updatedProducts = marketCopy.products.items.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item
          );

          marketCopy.products.items = updatedProducts;

          setMarket(marketCopy);
        },
      });

      deleteProductListener = API.graphql(
        graphqlOperation(onDeleteProduct, { owner: (await getUser()).username })
      ).subscribe({
        next: (productData) => {
          const deletedProduct = productData.value.data.onDeleteProduct;

          setMarket((prevState) => {
            const updatedProducts = prevState.products.items.filter(
              (item) => item.id !== deletedProduct.id
            );

            let updatedMarket = { ...prevState };
            updatedMarket.products.items = updatedProducts;
            return updatedMarket;
          });
        },
      });
    };

    activateProductListeners();

    return () => {
      // remove the listener on unmount

      createProductListener?.unsubscribe();
      updateProductListener?.unsubscribe();
      deleteProductListener?.unsubscribe();
    };

    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Loading fullScreen={true} />;
  }

  return (
    <>
      {/* Back button */}
      <Link className="link" to="/">
        Back to Markets List
      </Link>

      {/* Market Metadata */}
      <span className="items-center pt-2">
        <h2 className="mb-mr">{market.name}</h2> - {market.owner}
      </span>

      <div className="items-center pt-2">
        <span style={{ color: 'var(--lightSquidInk)', paddingBottom: '1em' }}>
          <Icon name="date" className="icon" />
          {market.createdAt}
        </span>
      </div>

      {/* New Product */}
      <Tabs type="border-card" value={isMarketOwner ? '1' : '2'}>
        {isMarketOwner && (
          <Tabs.Pane
            label={
              <>
                <Icon name="plus" className="icon" />
                Add Product
              </>
            }
            name="1">
            <NewProduct marketId={marketId} />
          </Tabs.Pane>
        )}

        {/* Products List */}
        <Tabs.Pane
          label={
            <>
              <Icon name="menu" className="icon" /> Products (
              {market.products?.items?.length || 0})
            </>
          }
          name="2">
          <div className="product-list">
            {market.products?.items?.map((product) => (
              <Product product={product} key={product.id} />
            ))}
          </div>
        </Tabs.Pane>
      </Tabs>
    </>
  );
}
