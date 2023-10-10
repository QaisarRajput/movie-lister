import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Image,
  Heading,
  HStack,
  VStack,
  Text,
  Divider,
  Badge,
  Box,
  useColorModeValue,
  Wrap,
  Center,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import useAPIrequest from "../../adapters/useAPIrequest";
import { IoTime } from "react-icons/io5";
import { AiFillLike, AiFillStar } from "react-icons/ai";
import { FaDownload, FaLanguage } from "react-icons/fa";
import Trailer from "./Trailer";
import SuggestedMovies from "./SuggestedMovies";

const MovieDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const history = useHistory();

  const id = query.get("movie_id");

  useEffect(() => {
    if (id) {
      onOpen();
    }
  }, [query, id, onOpen]);

  const handleClose = () => {
    history.replace({
      search: "",
    });
    onClose();
  };

  const { response } = useAPIrequest(
    "https://yts.mx/api/v2/movie_details.json?movie_id=" + id,
  );

  const starColor = useColorModeValue("green.500", "green.200");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response]);

  useEffect(() => {
    setIsLoading(true);
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalContent mx={6}>
        <ModalHeader pb={6} />
        <ModalCloseButton />
        <ModalBody pb={3}>
          {response && (
            <VStack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                w="full"
                align="start"
                spacing={6}
              >
                <Image
                  width={{ base: "100%", sm: "200px" }}
                  rounded="md"
                  src={response.data.movie["large_cover_image"]}
                ></Image>
                <VStack spacing={3} w="full" align="start">
                  <Heading as="h1" align="left">
                    {response.data.movie["title_long"]}
                  </Heading>
                  <Divider />
                  <Wrap spacing={3} wrap="wrap" justify="flex-start" w="full">
                    {response.data.movie["genres"].map((val, key) => {
                      return <Badge key={key}>{val}</Badge>;
                    })}
                  </Wrap>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={AiFillStar} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["rating"] > 0
                        ? response.data.movie["rating"].toFixed(1) + " / 10"
                        : "No rating"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={AiFillLike} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["like_count"] > 0
                        ? response.data.movie["like_count"].toLocaleString()
                        : "No Likes"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={FaDownload} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["download_count"] > 0
                        ? response.data.movie["download_count"].toLocaleString()
                        : "No Downloads"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={FaLanguage} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["language"] !== ""
                        ? response.data.movie["language"].toUpperCase()
                        : "Unknown"}
                    </Text>
                  </HStack>
                  <HStack spacing={3} justify="flex-start" w="full">
                    <Box as={IoTime} fontSize="20px" color={starColor} />
                    <Text
                      whiteSpace="nowrap"
                      display="flex"
                      dir="row"
                      fontWeight="semibold"
                    >
                      {response.data.movie["runtime"] > 0
                        ? response.data.movie["runtime"] + " Minutes"
                        : "Unknown"}
                    </Text>
                  </HStack>
                </VStack>
              </Stack>
              {response.data.movie["yt_trailer_code"] !== "" && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Trailer
                  </Heading>
                  <Trailer ytID={response.data.movie["yt_trailer_code"]} />
                </>
              )}
              {response.data.movie["description_full"] && (
                <>
                  <Divider />
                  <Heading as="h3" fontSize="lg" align="left" w="full">
                    Description
                  </Heading>
                  <Text align="left" w="full">
                    {response.data.movie["description_full"]}
                  </Text>
                </>
              )}
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Torrents
              </Heading>
              <Wrap spacing={3} wrap="wrap" align="start" w="full">
                {response.data.movie["torrents"] &&
                  response.data.movie["torrents"].map((val, key) => {
                    return (
                      <Button
                        as="a"
                        href={val.url}
                        colorScheme="green"
                        leftIcon={<FaDownload />}
                        key={key}
                      >
                        {val.quality}.{val.type} ({val.size})
                      </Button>
                    );
                  })}
              </Wrap>
              <Divider />
              <Heading as="h3" fontSize="lg" align="left" w="full">
                Suggested Movies
              </Heading>
              <SuggestedMovies id={query.get("movie_id")} />
            </VStack>
          )}
          {isLoading && (
            <Center w="full" pb={3}>
              <Spinner />
            </Center>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MovieDetails;
