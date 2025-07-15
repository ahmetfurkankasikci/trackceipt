import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import HomeScreen from './src/presentation/screens/HomeScreen/HomeScreen';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    console.log("girdim app")
  }, [])
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue',
  },
});

export default App;
