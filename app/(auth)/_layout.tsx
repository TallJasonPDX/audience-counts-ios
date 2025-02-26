
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          headerTitle: "Login",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          headerTitle: "Register",
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
