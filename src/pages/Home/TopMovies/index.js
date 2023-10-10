import {
  Center,
  GridItem,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import MovieCard from "../../../components/MovieCard";
import TopMoviesHeader from "./TopMoviesHeader";
import useAPIrequest from "../../../adapters/useAPIrequest";

const TopMovies = ({ type }) => {
  const [page, setPage] = useState(1);

  const { response } = useAPIrequest(
    "https://yts.mx/api/v2/list_movies.json?sort_by=" +
      type +
      "&limit=6&page=" +
      page,
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
    <VStack py={6}>
      <TopMoviesHeader
        setPage={setPage}
        page={page}
        setIsLoading={setIsLoading}
        type={type}
      />
      <SimpleGrid
        w="full"
        columns={{ base: 1, xs: 2, sm: 3 }}
        row={2}
        spacing={6}
      >
        {response &&
          response.data.movies.map((val, key) => {
            return (
              <GridItem key={key}>
                <MovieCard
                  img={val["medium_cover_image"]}
                  title={val["title_english"]}
                  year={val["year"]}
                  isLoading={isLoading}
                  rating={val["rating"]}
                  id={val["id"]}
                />
              </GridItem>
            );
          })}
        {isLoading && (
          <GridItem as={Center} colSpan={3}>
            <Spinner />
          </GridItem>
        )}
      </SimpleGrid>
    </VStack>
  );
};

export default TopMovies;
