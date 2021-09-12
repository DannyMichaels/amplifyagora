import React from 'react';
import { useParams } from 'react-router-dom';
// import { Loading, Tabs, Icon } from "element-react";

export default function MarketPage() {
  const { marketId } = useParams();

  return <div>{marketId}</div>;
}
