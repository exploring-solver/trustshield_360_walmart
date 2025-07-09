// BiometricAuthScreen.tsx - Mock implementation for demo
import React from 'react';

export default function BiometricAuthScreen({ onAuthSuccess, biometricSupported }: any) {
  // Mock biometric authentication
  setTimeout(() => {
    console.log('🔐 Biometric authentication simulated');
    onAuthSuccess();
  }, 2000);
  
  return null; // React Native components would be here
} 