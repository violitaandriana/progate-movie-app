import { View, Text, StyleSheet, Button } from 'react-native'

export default function Home({ navigation }: any): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Movie Page</Text>
      <Button
        title="PERGI KE MOVIE DETAIL"
        onPress={() => navigation.navigate("MovieDetail")}
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