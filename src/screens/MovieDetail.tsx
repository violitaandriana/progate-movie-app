/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // clearAllData();
    getMovieDetail();
    getMovieRecommendation();
    checkIsFavorite(id);
  }, []);

  // function clearAllData() {
  //   AsyncStorage.getAllKeys()
  //     .then((keys) => AsyncStorage.multiRemove(keys))
  //     .then(() => alert("success"));
  // }

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

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      // get all data from AsyncStorage
      const initialData: string | null =
        await AsyncStorage.getItem("@FavoriteList");

      let favMovieList: Movie[] = [];

      // parse = convert JSON to object, to load the data
      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      // save data to favMovieList
      // stringify = convert JS to JSON, to save the data
      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      // get all data from AsyncStorage
      const initialData: string | null =
        await AsyncStorage.getItem("@FavoriteList");

      let favMovieList: Movie[] = [];
      if (initialData !== null) {
        favMovieList = JSON.parse(initialData);
      }

      // delete movie from storage
      const updatedFavMovieList = favMovieList.filter(
        (movie) => movie.id !== id
      );

      await AsyncStorage.setItem(
        "@FavoriteList",
        JSON.stringify(updatedFavMovieList)
      );

      setIsFavorite(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFavorite = async (id: number): Promise<void> => {
    try {
      // get all data from AsyncStorage
      const initialData: string | null =
        await AsyncStorage.getItem("@FavoriteList");

      // setIsFavorite true if movie's id is in favMovieList
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const isFav = favMovieList.some((movie) => movie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
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
          <Text style={styles.rating}>
            {movieDetail.vote_average !== undefined
              ? movieDetail.vote_average.toFixed(1)
              : movieDetail.vote_average}
          </Text>
          <Pressable
            style={styles.favoriteIcon}
            onPress={() =>
              isFavorite ? removeFavorite(id) : addFavorite(movieDetail)
            }
          >
            <FontAwesome
              name={isFavorite ? "heart" : "heart-o"}
              size={20}
              color="white"
            />
          </Pressable>
        </View>
      </ImageBackground>

      {/* description */}
      <View style={styles.descriptionContainer}>
        <Text>{movieDetail.overview}</Text>
        <View>
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
    height: 200,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  movieTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    gap: 2,
  },
  rating: {
    color: "yellow",
    fontWeight: "700",
    marginLeft: 5,
  },
  favoriteIcon: {
    position: "absolute",
    top: 0,
    right: 14,
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
