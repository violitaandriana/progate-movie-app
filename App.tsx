/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/navigations/BottomTabNavigation";

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
