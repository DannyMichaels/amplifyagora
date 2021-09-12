import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import { Loading, Tabs, Icon } from 'element-react';
import { getMarket } from './../graphql/queries';
import { Link } from 'react-router-dom';
import { useStateValue } from '../context/currentUser';
import NewProduct from './../components/NewProduct';
import Product from './../components/Product';

export default function MarketPage() {
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketOwner, setIsMarketOwner] = useState(false);
  const { currentUser } = useStateValue();
  const { marketId } = useParams();

  const checkMarketOwner = async (market) => {
    if (currentUser) {
      setIsMarketOwner(currentUser.username === market?.owner);
    }
  };

  useEffect(() => {
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
    handleGetMarket();

    // eslint-disable-next-line
  }, [marketId]);

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
            <NewProduct />
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
          {/* <div className="product-list">
            {market.product.items?.map((product) => (
              <Product product={product} />
            ))}
          </div> */}
        </Tabs.Pane>
      </Tabs>
    </>
  );
}
