'use client';

import { useState, useEffect } from "react"
// ChakraUI
import { 
    Flex, Text, Button, Spinner,
     VStack, StackDivider, Box, Stack, 
     Radio, RadioGroup,
     StatGroup, Stat, StatLabel, StatNumber,
     Alert,
     AlertIcon,
     AlertDescription
    } from "@chakra-ui/react"
// Wagmi
import { useAccount, useReadContract, type BaseError, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import {  homeABI, homeAddress } from "@/constants"
import { formatEther } from "viem"
import { waitForTransactionReceipt } from "viem/actions";


const Home = () => {

}

export default Home