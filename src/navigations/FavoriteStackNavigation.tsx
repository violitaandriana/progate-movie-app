/* eslint-disable react/react-in-jsx-scope */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorite from "../screens/Favorite";
import MovieDetail from "../screens/MovieDetail";

const Stack = createNativeStackNavigator();

const FavoriteStackNavigation = (): JSX.Element => (
  <Stack.Navigator initialRouteName="Favorite">
    <Stack.Screen name="Favorite" component={Favorite} />
    <Stack.Screen name="MovieDetail" component={MovieDetail} />
  </Stack.Navigator>
);

export default FavoriteStackNavigation;
