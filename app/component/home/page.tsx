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
import { Address, Log, parseEther  } from "viem"
import MiniaturePage from "../miniaturePage";


const HomeSondage = () => {

    interface SondageData {
        questionContrat: string
        addressContrat: Address
        reponsesContrat: Array<string>
        nbrReponsePayantes : number
        montantPartager: BigInt
    }

    interface SondageCreation {
        amount : BigInt
        sondage : Address
    }

    const [sondagesData, setSondagesData] = useState<SondageData[]>([]);
    const [ reponses, setReponses] = useState<string[]>([]);
    const [ question, setQuestion ] = useState<string>("");
    const [ reponsesPayante, setReponsesPayante] = useState<number>();
    const [ etherValue , setEtherValue ] = useState<BigInt>();
    const [ newSondages, setSondages ] = useState<string[]>([])

    const { data: sondages, isLoading: isSondagesLoading, refetch: refetchSondages } = useReadContract({
        address: homeAddress,
        abi: homeABI,
        functionName: 'sondages',
    })

    const { status, data: creationOK, error: creationError, isPending: creationPending, writeContract } = useWriteContract();
    const creerSondage = async() => {
        if (etherValue != undefined){
            writeContract({
                address: homeAddress,
                abi:homeABI,
                functionName: 'createSondage',
                args:([question, reponses, 10]),
                value: parseEther(etherValue.toString())
            });
        }
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
            const log : SondageCreation = logs[0].args; 
            if (!newSondages.includes(log.sondage) && etherValue != undefined) {
                const nvxSondage : SondageData = {
                    questionContrat: question,
                    addressContrat: log.sondage,
                    reponsesContrat: reponses,
                    nbrReponsePayantes: Number(reponsesPayante), 
                    montantPartager : parseEther(etherValue.toString()),
                };
                setSondages([...newSondages, log.sondage])
                setSondagesData([...sondagesData, nvxSondage])
            }
               
        }
    });

    const updateReponses = (e :  React.ChangeEvent<HTMLInputElement>, index: number) => {   
        const updatedQuestions = [...reponses];
        updatedQuestions[index] = e.target.value;
        setReponses(updatedQuestions);
    }

    const changeEtherValue = (event :  React.ChangeEvent<HTMLInputElement>) => {
        const value = BigInt(event.target.value);
        setEtherValue(value);
    }

    return (
        <VStack>
            <HStack>
                { sondagesData.map(elt => (
                    <>
                    <MiniaturePage 
                        questionContract = {elt.questionContrat} 
                        addressContrat   = {elt.addressContrat}
                        reponsesContrat  = {elt.reponsesContrat}
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
                <Input type='number' value={reponsesPayante} onChange={(e) => setReponsesPayante(Number(e.target.value))} />
                <FormLabel>ether</FormLabel>
                <Input required type='number' onChange={changeEtherValue} value={etherValue as number | undefined}/>
                <Button onClick={()=> creerSondage() }>crée sondage</Button>
            </FormControl>
            </Flex>
        </VStack>
    )
}

export default HomeSondage