/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { EXPO_API_ACCESS_TOKEN } from "../constant";
import { Movie } from "../types/app";
import MovieItem from "../components/movies/MovieItem";

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
};

export default function MovieDetail({ route }: any): JSX.Element {
  const [movieDetail, setMovieDetail] = useState<Movie>([]);
  const [recommendations, setRecommendations] = useState<Movie>([]);

  useEffect(() => {
    getMovieDetail();
    getMovieRecommendation();
  }, []);
  // dapat id yg dikirim di MovieItem dr navigation?
  const { id } = route.params;
  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${EXPO_API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => setMovieDetail(response))
      .catch((err) => console.error(err));
  };

  const getMovieRecommendation = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${EXPO_API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => setRecommendations(response.results))
      .catch((err) => console.error(err));
  };

  return (
    <ScrollView>
      {/* image, title, & rate */}
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}`,
        }}
      >
        <Text style={styles.movieTitle}>{movieDetail.original_title}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="yellow" />
          <Text style={styles.rating}>{movieDetail.vote_average}</Text>
        </View>
      </ImageBackground>

      {/* description */}
      <View style={styles.descriptionContainer}>
        <Text>{movieDetail.overview}</Text>
        <View style={styles.criteriaContainer}>
          <Text style={styles.bold}>Original Language</Text>
          <Text>{movieDetail.original_language}</Text>
          <Text style={styles.bold}>Popularity</Text>
          <Text>{movieDetail.popularity}</Text>
          <Text style={styles.bold}>Release Date:</Text>
          <Text>{movieDetail.release_date}</Text>
          <Text style={styles.bold}>Vote Count</Text>
          <Text>{movieDetail.vote_count}</Text>
        </View>
      </View>

      {/* recommendation */}
      <View>
        <View style={styles.header}>
          <View style={styles.purpleLabel}></View>
          <Text style={styles.title}>Recommendation</Text>
        </View>

        <FlatList
          style={styles.movieList}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={recommendations}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={coverImageSize["poster"]}
              coverType="poster"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    // height: "64%"
    paddingBottom: 20,
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  movieTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
    marginTop: "44%",
    display: "flex",
    alignItems: "flex-end",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: 20,
  },
  rating: {
    color: "yellow",
    fontWeight: "700",
  },
  descriptionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  bold: {
    fontWeight: "bold",
    marginTop: 10,
  },
  header: {
    marginLeft: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8978A4",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 8,
    marginBottom: 40,
  },
});
