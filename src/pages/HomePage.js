import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import NewMarket from './../components/NewMarket';
import MarketList from './../components/MarketList';
import { searchMarkets } from '../graphql/queries';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearch = async (e) => {
    try {
      setIsSearching(true);
      const result = await API.graphql(
        graphqlOperation(searchMarkets, {
          filter: {
            or: [
              { name: { match: searchTerm } },
              { owner: { match: searchTerm } },
              { tags: { match: searchTerm } },
            ],
          },
          sort: {
            field: 'createdAt',
            direction: 'desc', // most recent to oldest
          },
        })
      );
      console.log({ result });
      setSearchResults(result.data.searchMarkets.items);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NewMarket
        searchTerm={searchTerm}
        isSearching={isSearching}
        handleSearch={handleSearch}
        handleSearchChange={handleSearchChange}
        handleClearSearch={handleClearSearch}
      />
      <MarketList />
    </>
  );
}
