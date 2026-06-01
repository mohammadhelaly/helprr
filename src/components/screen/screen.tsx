import type { PropsWithChildren } from "react";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  className?: string;
  topInset?: boolean;
}>;

const Screen = (props: Props) => {
  const { children, className = "", topInset = false } = props;
  const edges: Edge[] = topInset ? ["top", "left", "right"] : ["left", "right"];

  return (
    <SafeAreaView
      className={`flex-1 bg-background dark:bg-background-dark ${className}`}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

export { Screen };
