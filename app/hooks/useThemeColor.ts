/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */


import { useColorScheme } from './useColorScheme';

export default function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export default useThemeColor;