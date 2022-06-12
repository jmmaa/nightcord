import React from "react";

interface IAnimationContext {
  active: boolean;
  start: () => void;
  stop: () => void;
}

export const AnimationContext: React.Context<IAnimationContext> =
  React.createContext<IAnimationContext>({
    active: false,
    start: null,
    stop: null,
  });

export const useAnimation = (): IAnimationContext => {
  return React.useContext(AnimationContext);
};