import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import EmailInputScreen from './src/screens/EmailInputScreen';
import ReturnsDashboardScreen from './src/screens/ReturnsDashboardScreen';
import ReturnDetailsScreen from './src/screens/ReturnDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  EmailInput: undefined;
  ReturnsDashboard: undefined;
  ReturnDetails: {returnId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'ReturnsRunner'}}
          />
          <Stack.Screen
            name="EmailInput"
            component={EmailInputScreen}
            options={{title: 'Forward Email'}}
          />
          <Stack.Screen
            name="ReturnsDashboard"
            component={ReturnsDashboardScreen}
            options={{title: 'My Returns'}}
          />
          <Stack.Screen
            name="ReturnDetails"
            component={ReturnDetailsScreen}
            options={{title: 'Return Details'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
