'use client';

import { Spacer, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const header = () => {
  return (
    <>
    <Flex
        justifyContent="space-between"
        
    >
        <Box>
            <Text>LOGO</Text>
        </Box>
        <Spacer />
        <ConnectButton />
    </Flex>
    </>
  )
}

export default header