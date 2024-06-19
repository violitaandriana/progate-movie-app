/* eslint-disable react/react-in-jsx-scope */
import { View, Text, StyleSheet, Button } from 'react-native';
import { EXPO_API_URL, EXPO_API_ACCESS_TOKEN } from '../constant';

export default function MovieDetail({ navigation }: any): JSX.Element {
  const fetchData = (): void => {
    if (EXPO_API_URL == null || EXPO_API_ACCESS_TOKEN == null) {
      throw new Error('ENV not found');
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${EXPO_API_ACCESS_TOKEN}`
      }
    };
    
    fetch(EXPO_API_URL, options)
      .then(async (response) => await response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }
  

  return (
    <View style={styles.container}>
      <Text>Movie Detail Page</Text>
      <Button
        title="Fetch Data"
        onPress={() => fetchData()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
