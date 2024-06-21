/* eslint-disable react/react-in-jsx-scope */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import MovieDetail from "../screens/MovieDetail";

const Stack = createNativeStackNavigator();

const HomeStackNavigation = (): JSX.Element => (
  // <NavigationContainer> // ga perlu krn sdh di App.tsx
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="MovieDetail" component={MovieDetail} />
  </Stack.Navigator>
  // </NavigationContainer>
);

export default HomeStackNavigation;
