'use client';

import { useState, useEffect } from "react"
// ChakraUI
import { 
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
    Flex,
    FormControl, FormLabel, Input,
    Button,
    VStack,
    Spacer,
    HStack
    } from "@chakra-ui/react"
// Wagmi
import { useAccount, useWatchContractEvent, useReadContract, type BaseError, useWriteContract, useWaitForTransactionReceipt  } from "wagmi"
import {  homeABI, homeAddress } from "@/constants"
import { formatEther } from "viem"
import { waitForTransactionReceipt } from "viem/actions";
import Sondage from "./sondage";


const HomeSondage = () => {

    const [ reponses, setReponses] = useState<string[]>([]);
    const [ question, setQuestion ] = useState<string>("");
    const [ reponsesPayante, setReponsesPayante] = useState();
    const [ etherValue , setEtherValue ] = useState();
    const [ newSondages, setSondages ] = useState<string[]>([])

    const { data: sondages, isLoading: isSondagesLoading, refetch: refetchSondages } = useReadContract({
        address: homeAddress,
        abi: homeABI,
        functionName: 'sondages',
    })

    const { status, data: creationOK, error: creationError, isPending: creationPending, writeContract } = useWriteContract();
    const creerSondage = async() => {
        console.log("creeation sondage")
        writeContract({
            address: homeAddress,
            abi:homeABI,
            functionName: 'createSondage',
            args:([question, reponses, 10]),
            value: BigInt(1)
        });
    };
    
    const {data , isLoading: ConfirmingCreation, isSuccess: creationSuccess, error: transactionError,   } = useWaitForTransactionReceipt({ 
        hash: creationOK,
    });

    const test = useWatchContractEvent(
    {
        address: homeAddress,
        abi: homeABI,
        eventName: 'Sondagecreation',
        onLogs: logs => {
            console.log(logs[0].args)
            console.log(newSondages);
            if (!newSondages.includes(logs[0].args.sondage)) {
                setSondages([...newSondages, logs[0].args.sondage])
                
            } 
        }
    });

    const updateReponses = (e, index: number) => {
        const updatedQuestions = [...reponses];
        updatedQuestions[index] = e.target.value;
        setReponses(updatedQuestions);
    }

    const formatNewSondages = () => {

    }
      
    return (
        <VStack>
            <HStack>
                { newSondages.map(e => (
                    <>
                    <Flex>address : {e}</Flex>
                    <Sondage 
                        questionContrat={question}
                        addressContrat= {e}
                        reponsesContrat={reponses} 
                    />
                    </>
                ))}
            </HStack>
            <HStack>
                <Flex>status : <Flex as="b">{status}</Flex></Flex>
                <Flex>error message : <Flex as="b">{creationError?.message }</Flex></Flex>!
            </HStack>    
            <Flex>
            <FormControl>
                <FormLabel>Question</FormLabel>
                <Input type='text' value={question}  onChange={(e) => setQuestion(e.target.value)}/>
                <FormLabel>Reponses possibles</FormLabel>
                <Input type='text' onChange={(e) => updateReponses(e,0)} />
                <Input type='text' onChange={(e) => updateReponses(e,1)} />
                <Input type='text' onChange={(e) => updateReponses(e,2)} />
                <Input type='text' onChange={(e) => updateReponses(e,3)} />
                <FormLabel>nombre de reponses payantes</FormLabel>
                <Input type='number' value={reponsesPayante}  />
                <FormLabel>ether</FormLabel>
                <Input type='number' value={etherValue} />
                <Button onClick={()=> creerSondage() }>crée sondage</Button>
            </FormControl>
            </Flex>
        </VStack>
    )
}

export default HomeSondage