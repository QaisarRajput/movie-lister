import {
  GridItem,
  Heading,
  Button,
  VStack,
  Box,
  Center,
  Spinner,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import MovieCard from "../../../components/MovieCard";
import useAPIrequest from "../../../adapters/useAPIrequest";
import { Link } from "react-router-dom";

const RecentlyAdded = () => {
  const { response } = useAPIrequest(
    "https://yts.mx/api/v2/list_movies.json?sort_by=date_added",
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (response && response !== null) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [response]);

  return (
    <VStack spacing={6} align="start" py={6}>
      <Stack
        w="full"
        spacing={{ base: 3, lg: 6 }}
        direction={{ base: "row", lg: "column" }}
        align={{ base: "center", sm: "start" }}
      >
        <Heading
          whiteSpace="nowrap"
          textTransform={{ base: "none", lg: "uppercase" }}
          as="h4"
          fontSize={{ base: "2xl", lg: "md" }}
        >
          Recently Added
        </Heading>
        <Box as="hr" w="full" />
      </Stack>
      <SimpleGrid
        columns={{ base: 1, xs: 2, sm: 3, lg: 1 }}
        spacing={6}
        w="full"
      >
        {response &&
          response.data.movies.slice(0, 6).map((val, key) => {
            return (
              <GridItem key={key} w="full">
                <MovieCard
                  img={val["background_image"]}
                  aspect={16 / 9}
                  title={val["title_english"]}
                  year={val["year"]}
                  isLoading={isLoading}
                  rating={val["rating"]}
                  id={val["id"]}
                />
              </GridItem>
            );
          })}
      </SimpleGrid>
      {response && (
        <Button as={Link} to="/movies/recent" w="full" colorScheme="green">
          View More
        </Button>
      )}
      {isLoading && (
        <Center w="full">
          <Spinner />
        </Center>
      )}
    </VStack>
  );
};

export default RecentlyAdded;
