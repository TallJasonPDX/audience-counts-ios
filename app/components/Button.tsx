// components/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (disabled) return colorScheme === "light" ? "#cbd5e1" : "#475569";

    switch (variant) {
      case "primary":
        return colors.tint;
      case "secondary":
        return "transparent";
      case "danger":
        return colors.error;
      default:
        return colors.tint;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colorScheme === "light" ? "#cbd5e1" : "#475569";

    switch (variant) {
      case "primary":
        return colors.tint;
      case "secondary":
        return colors.border;
      case "danger":
        return colors.error;
      default:
        return colors.tint;
    }
  };

  const getTextColor = () => {
    if (disabled) return colorScheme === "light" ? "#94a3b8" : "#94a3b8";

    switch (variant) {
      case "primary":
        return "#ffffff";
      case "secondary":
        return colors.text;
      case "danger":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "medium":
        return { paddingVertical: 12, paddingHorizontal: 20 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "secondary" ? 1 : 0,
          ...getPadding(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "secondary" ? colors.tint : "#ffffff"}
          size={size === "small" ? "small" : "small"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Button;