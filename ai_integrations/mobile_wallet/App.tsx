import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';

import WalletScreen from './src/screens/WalletScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import BiometricAuthScreen from './src/screens/BiometricAuthScreen';

const Stack = createStackNavigator();

// Walmart brand theme
const walmartTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#004c91',
    secondary: '#ffc220',
    surface: '#ffffff',
    background: '#f8f9fa',
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricSupported(compatible && enrolled);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <PaperProvider theme={walmartTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#004c91',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen
              name="BiometricAuth"
              options={{ 
                title: 'TrustShield Wallet',
                headerShown: false
              }}
            >
              {(props) => (
                <BiometricAuthScreen
                  {...props}
                  onAuthSuccess={handleAuthSuccess}
                  biometricSupported={biometricSupported}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="Wallet"
                component={WalletScreen}
                options={{ title: '🔒 TrustShield Wallet' }}
              />
              <Stack.Screen
                name="Transaction"
                component={TransactionScreen}
                options={{ title: 'Send Payment' }}
              />
              <Stack.Screen
                name="QRScan"
                component={QRScanScreen}
                options={{ title: 'Scan QR Code' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 