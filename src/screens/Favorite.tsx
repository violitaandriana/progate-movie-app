/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MovieItem from "../components/movies/MovieItem";
import { Movie } from "../types/app";

const coverImageSize = {
  poster: {
    width: 100,
    height: 160,
  },
};

export default function Favorite(): JSX.Element {
  const [favoriteList, setFavoriteList] = useState<Movie>([]);

  // to get newest favoriteList every second
  useEffect(() => {
    const interval = setInterval(() => {
      getFavoriteList();
    }, 1000); 

    return () => clearInterval(interval); 
  }, []);

  const getFavoriteList = async (): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem("@FavoriteList");
      let favMovieList: Movie[] = [];

      // parse = convert JSON to object, to load the data
      if (initialData !== null) {
        favMovieList = JSON.parse(initialData);
      }
      setFavoriteList(favMovieList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.title}>Your Favorite Movies</Text>
      </View>
      {/* list of movies */}
      <FlatList
        style={styles.movieList}
        showsVerticalScrollIndicator={true}
        data={favoriteList}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={coverImageSize["poster"]}
            coverType="poster"
          />
        )}
        keyExtractor={(item) => item.id !== undefined ? item.id.toString() : Math.random().toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 20,
    marginBottom: 80,
  },
  listContainer: {
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  columnWrapper: {
    gap: 4,
  },
});
