import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const CustomeTabBtn = ({children, onPress}) => (
  <TouchableOpacity
    activeOpacity={1}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <LinearGradient
      colors={['#7221ff', '#219fff', '#a221ff']}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#62A9FF',
        borderWidth: 10,
        borderColor: '#2a374d',
      }}>
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: 'black',
          borderTopColor: '#2a374d',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarActiveTintColor: '#62A9FF',
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                borderBottomWidth: focused ? 2 : 0,
                borderColor: color,
                paddingVertical: 10,
              }}>
              <FontAwesome5 name="home" color={color} size={25} />
            </View>
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                borderBottomWidth: focused ? 2 : 0,
                borderColor: color,
                paddingVertical: 10,
              }}>
              <AntDesign name="heart" color={color} size={25} />
            </View>
          ),
        }}
        name="Heart"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: () => (
            <AntDesign name="search1" color="white" size={35} />
          ),
          tabBarButton: props => <CustomeTabBtn {...props} />,
        }}
        name="Search"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                borderBottomWidth: focused ? 2 : 0,
                borderColor: color,
                paddingVertical: 10,
              }}>
              <Ionicons name="library" color={color} size={25} />
            </View>
          ),
        }}
        name="Lib"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                borderBottomWidth: focused ? 2 : 0,
                borderColor: color,
                paddingVertical: 10,
              }}>
              <FontAwesome5 name="user-alt" color={color} size={25} />
            </View>
          ),
        }}
        name="User"
        component={HomeScreen}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return <HomeScreen />;
};

export default App;
