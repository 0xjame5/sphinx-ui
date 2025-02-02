import Head from "next/head";
import {Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, VStack,} from "@chakra-ui/react";

import {useRouter} from 'next/router'
import React, {ChangeEvent, useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";
import {ContractContextProvider} from "../ContractContextProvider";
import { Duration, InstantiateMsg, Coin } from "../../codegen/CwLotto.types";
import { StdFee } from "@cosmjs/stargate";

import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  useToast,
  Text,
  useClipboard
} from "@chakra-ui/react";

const CreateLayout = () => {
  useRouter();
  const {address, status, getSigningCosmWasmClient} = useChain(chainName);
  
  // Form state
  const [inputAddress, setAddress] = useState<string>("juno1gw037d4duftfqe9p5gyurdzduamw00q7tw5tvv");
  const [ticketAmount, setTicketAmount] = useState<string>("1000");
  const [ticketDenom, setTicketDenom] = useState<string>("ujunox");
  const [inputDuration, setDuration] = useState<number>(600);
  const [houseFee, setHouseFee] = useState<string>("100");

  // Form handlers
  const handleAdressChange =  (e: ChangeEvent<HTMLInputElement>) =>  setAddress(e.target.value);
  const handleTicketAmountChange = (value: string) => setTicketAmount(value);
  const handleTicketDenomChange = (e: ChangeEvent<HTMLInputElement>) => setTicketDenom(e.target.value);
  const handleDurationChange = (value: string) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setDuration(parsed);
    }
  };
  // const handleDurationChange = (value: number) => setDuration(value);
  const handleHouseFeeChange = (value: string) => setHouseFee(value);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const toast = useToast();

  const handleButtonClick = async () => {
    let signingCwClient = await getSigningCosmWasmClient();
    if (signingCwClient && address) {
      let duration: Duration = { time: inputDuration }
      let ticketCost: Coin = { amount: ticketAmount, denom: ticketDenom }
      let lotteryInstantiate: InstantiateMsg = {
        admin: address,
        house_fee: parseInt(houseFee),
        lottery_duration: duration,
        ticket_cost: ticketCost,
      };

      // Hardcode since instantiate requires a lot of gas.
      let coins: Coin[] = [{ amount: "1000000", denom: "ujunox" }]
      let stdFee: StdFee = { amount: coins, gas: "200000" }

      let response = await signingCwClient.instantiate(
        address,
        3896,
        lotteryInstantiate,
        "new-game",
        stdFee,
        undefined
      );
      setContractAddress(response.contractAddress);
      setIsModalOpen(true);
    }
  };

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Sphinx | Create </title>
      </Head>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>Contract Owner</FormLabel>
          <Input value={inputAddress} onChange={handleAdressChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Ticket Cost Amount</FormLabel>
          <NumberInput value={ticketAmount} onChange={handleTicketAmountChange}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Ticket Denomination</FormLabel>
          <Input value={ticketDenom} onChange={handleTicketDenomChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Duration (seconds)</FormLabel>
          <NumberInput value={inputDuration} onChange={handleDurationChange}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>House Fee (basis points)</FormLabel>
          <NumberInput value={houseFee} onChange={handleHouseFeeChange}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button onClick={handleButtonClick} colorScheme="blue">
          Create Lottery
        </Button>
      </VStack>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lottery Created Successfully!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>Contract Address:</Text>
            <Text fontFamily="mono" mb={4}>
              {contractAddress}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default function CreatePage() {
  return (<ContractContextProvider>
    <CreateLayout />
  </ContractContextProvider>)
}
