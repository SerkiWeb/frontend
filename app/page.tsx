'use client';

import { useAccount } from "wagmi";
import { Layout } from "./component/layout";
import { Flex, Alert, AlertIcon, Text } from '@chakra-ui/react';

import NotConnected from "./component/notConnected"; 
import HomeSondage from "./component/home";

export default function Home() {

  const { address, isConnected } = useAccount();

  return (
    <Layout>
    { isConnected ? (
      <HomeSondage />
    ) : (
      <NotConnected />
    )}
    </Layout>
  );
}
