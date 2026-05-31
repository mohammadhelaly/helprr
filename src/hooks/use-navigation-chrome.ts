import { sizes } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const stackHeaderContentHeight = sizes.sizing.sm;
const bottomTabBarHeight = sizes.sizing.lg;

const useNavigationChrome = () => {
  const insets = useSafeAreaInsets();
  const stackHeaderHeight = insets.top + stackHeaderContentHeight;

  return {
    bottomTabBarHeight,
    stackHeaderHeight,
    verticalChromeHeight: stackHeaderHeight + bottomTabBarHeight,
  };
};

export { useNavigationChrome };
