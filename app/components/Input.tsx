// components/Input.tsx
import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Input({
  label,
  error,
  icon,
  containerStyle,
  inputStyle,
  labelStyle,
  ...rest
}: InputProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: colors.subtitle }, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.inputBg,
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={colors.icon}
            style={styles.icon}
          />
        ) : null}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.placeholder}
          {...rest}
        />
      </View>

      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  icon: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
