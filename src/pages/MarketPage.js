import React, { useEffect, useState } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import { Loading, Tabs, Icon } from 'element-react';
// import { getMarket } from './../graphql/queries';

import { Link } from 'react-router-dom';
import { useStateValue } from '../context/currentUser';
import NewProduct from './../components/NewProduct';
import Product from './../components/Product';
import { formatProductDate } from './../utils/index';

import useFetchMarketData from './../hooks/useFetchMarketData';
// need to add subscriptions so we don't have to refresh to see updated state
// they will execute after the mutations

export default function MarketPage() {
  const { currentUser } = useStateValue();
  const { marketId } = useParams();

  const { market, isMarketOwner, isLoading } = useFetchMarketData({
    userAttributes: currentUser.attributes,
    user: currentUser,
    marketId,
  });

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
          {formatProductDate(market.createdAt)}
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
