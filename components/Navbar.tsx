import {Box, Flex, HStack, Link, useColorModeValue, useDisclosure,} from '@chakra-ui/react';
import {ReactNode} from "react";
import {WalletSection} from "./wallet";


export default function Navbar() {
    return (
        <Box>
            <Flex
                minH={'60px'}
                py={{base: 2}}
                px={{base: 4}}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                alignItems={'center'} justifyContent={'space-between'}>
                <HStack alignContent={'center'}>
                    <Box>Logo</Box>
                </HStack>
                <Flex alignItems={'center'}>
                    <HStack
                        as={'nav'}
                        display={{base: 'none', md: 'flex'}}>
                        {Links.map((link) => (
                            <NavLink key={link}>{link}</NavLink>
                        ))}
                    </HStack>
                    <WalletSection/>
                </Flex>
            </Flex>
        </Box>
    );
}

const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = ({children}: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);