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
import {  sondageABI, sondageAddress } from "@/constants"
import { formatEther } from "viem"
import { waitForTransactionReceipt } from "viem/actions";


const Sondage = () => {

    const [vote, setVote ] = useState<string>();
    const { address } = useAccount();
  
    const { data: question, isLoading: questionLoading } = useReadContract({
        address: sondageAddress,
        abi: sondageABI,
        functionName: 'getQuestion',
    })

    const { data: isOpen, isLoading: isOpenLoading, refetch: refetchIsOpen } = useReadContract({
        address: sondageAddress,
        abi: sondageABI,
        functionName: 'isOpen',
    })

    const { data: reponses, isLoading: reponsesLoading } = useReadContract({
        address: sondageAddress,
        abi: sondageABI,
        functionName: 'getChoixReponse',
     })

    const { data: getMontant, isLoading: getMontantLoading, refetch: refetchgetMontant } = useReadContract({
    address: sondageAddress,
    abi: sondageABI,
    functionName: 'getMontant',
    })

    const { data: resultats, isLoading: resultatsLoading, refetch: refetchgResultats } = useReadContract({
        address: sondageAddress,
        abi: sondageABI,
        functionName: 'getResultat',
        })

    const { data: hashVote, error: votingError, isPending: votePending, writeContract, isSuccess: isVoteSuccess } = useWriteContract();
    const submitVote = async(vote:string) => {
        writeContract({
            address: sondageAddress,
            abi:sondageABI,
            functionName: 'vote',
            account: address,
            args:([Number(vote)])
        });
    };
    const {isLoading: isConfirmingVote, isSuccess: isConfirmedVote  } = useWaitForTransactionReceipt({ 
        hash: hashVote,
    });

    const { data: hashGain, error: gainError, isPending: gainPending, isSuccess: isGainSuccess } = useWriteContract();
    const obtenirgain = async() => {
        writeContract({
            address: sondageAddress,
            abi:sondageABI,
            functionName: 'gain',
            account: address
        });
    };
    const {isLoading: isConfirmingGain, isSuccess: isConfirmedGain  } = useWaitForTransactionReceipt({ 
        hash: hashGain,
    });

    const formatMontant = (montant: bigint | undefined) => {
        if (montant !== undefined) {
          return formatEther(montant);
        }
        return "0";
      };
    const formatReponse = (rep :string[], indice : number) => {
        if(rep != undefined) {
            return rep[indice];
        }
        return "undefined";
    } 
    const formatResultat = (rep :bigint[], indice : number) => {
        if(rep != undefined) {
            return String(rep[indice]);
        }
        return "0";
    }

    useEffect(() => {
        if(hashVote || hashGain) {
            refetchgResultats();
            refetchgetMontant();
            refetchIsOpen();
        }
    });
  
    return (
        <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={6}
            align='stretch'
            width="100%"
        >
            <Box>
            <Text as="b">resultats : </Text>
                <StatGroup>
                    <Stat>
                        <StatLabel>{ formatReponse(reponses as string[], 0) }</StatLabel>
                        <StatNumber>{ formatResultat(resultats as bigint[], 0) }</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>{ formatReponse(reponses as string[], 1) }</StatLabel>
                        <StatNumber>{ formatResultat(resultats as bigint[], 1) }</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>{ formatReponse(reponses as string[], 2) }</StatLabel>
                        <StatNumber>{ formatResultat(resultats as bigint[], 2) }</StatNumber>
                    </Stat>
                    <Stat>
                        <StatLabel>{ formatReponse(reponses as string[], 3) }</StatLabel>
                        <StatNumber>{ formatResultat(resultats as bigint[], 3) }</StatNumber>
                    </Stat>
                </StatGroup>
            </Box>
            <Box
                justifyContent="center"       
            >
                <Text >{isOpen ? (
                        <Text as="b"> Sondage Ouvert</Text>
                    ):(
                        <Text as="b"> Sondage Clos</Text>
                    )}
                </Text>
            </Box>
            <Box>
            <Text>Question :<Text as="b">{question as string }</Text></Text>
                <RadioGroup onChange={setVote} value={vote}>
                    <Stack direction='row'>
                        <Radio value='0'>{ formatReponse(reponses as string[], 0) }</Radio>
                        <Radio value='1'>{ formatReponse(reponses as string[], 1) }</Radio>
                        <Radio value='2'>{ formatReponse(reponses as string[], 2) }</Radio>
                        <Radio value='3'>{ formatReponse(reponses as string[], 3) }</Radio>
                    </Stack>
                </RadioGroup>
            </Box>
            <Box justifyContent="space-between">
                <Button onClick={() => submitVote(vote as string)}>submit Vote</Button>
                <Button onClick={() => obtenirgain()}>{ gainPending ? 'Pending ...' : 'Obtenir votre gain' }</Button>
            </Box>    
            <Box>
                <Text><Text>Montant total a vous partagez : </Text><Text as="b">{formatMontant(getMontant as bigint | undefined)} ether</Text></Text>
            </Box>
            <Box>
                { gainError && (
                    <Alert status="error">
                        <AlertIcon/>
                        <AlertDescription> Error: {(gainError as BaseError).shortMessage || gainError.message}</AlertDescription>
                    </Alert>
                )}
                {votingError && (
                    <Alert status="error">
                        <AlertIcon/>
                        <AlertDescription> Error: {(votingError as BaseError).shortMessage || votingError.message}</AlertDescription>
                    </Alert>
                )}
                {(isConfirmingVote || isConfirmedGain) && (
                    <Alert status='success' mt="1rem">
                        <AlertIcon />
                        Waiting for confirmation...
                    </Alert>
                )} 
                { (isConfirmedVote || isConfirmedGain) && (
                    <Alert status='success' mt="1rem">
                        <AlertIcon />
                        { isConfirmedGain ? 'You received your reward !!' : 'thanks for voting , claim your reward' } 
                    </Alert>
              )} 
            </Box>
        </VStack>
  )
}

export default Sondage