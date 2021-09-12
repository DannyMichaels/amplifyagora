import React, { useState } from 'react';
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchTerm);
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
