import React, { useState, useRef, useEffect } from "react";

import { useGlobalState } from "../app/store";

const throttle = (cb, delay = 500) => {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    cb(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
};

export function SlideShow({ children, direction, width, height }) {
  const [currSlideIndex, setCurrSlideIndex] = useState(0);
  const [transformVal, setTransformVal] = useState(0);

  var breakpoints = [];
  const incrementedPoints = [];

  if (direction.toLowerCase() === "y") {
    children.map((e) => breakpoints.push(e.props.transformValueY));
  } else {
    children.map((e) => breakpoints.push(e.props.transformValueX));
  }

  var breakpoints = breakpoints.reduce((prevVal, currVal) => {
    const newVal = prevVal + currVal;

    incrementedPoints.push(-newVal);

    return newVal;
  }, 0);

  // console.log("breakpoints: ", breakpoints);
  // console.log("incremented: ", incrementedPoints);
  // console.log(transformVal);

  const slide = useRef(
    throttle((...args) => {
      setCurrSlideIndex(...args);
    }, 1000)
  );

  const handleWheel = (e) => {
    const index = incrementedPoints.length - 1;
    slide.current((state) => {
      if (e.deltaY === -100) {
        // console.log("up");

        const decrementedIndex = state - 1;

        if (decrementedIndex < 0) {
          return 0;
        } else {
          return decrementedIndex;
        }
      } else if (e.deltaY === 100) {
        // console.log("down");

        const incrementedIndex = state + 1;

        if (incrementedIndex > index) {
          return index;
        } else {
          return incrementedIndex;
        }
      }
    });
  };

  const { setSectionIndex } = useGlobalState();

  useEffect(() => {
    const newTransformValue = incrementedPoints[currSlideIndex];
    // console.log("slide index:", currSlideIndex);

    if (newTransformValue !== undefined) {
      setTransformVal(newTransformValue);
      setSectionIndex(currSlideIndex);
    }
  }, [currSlideIndex]);

  return (
    <div
      onWheel={handleWheel}
      style={{
        height: height,
        width: width,
        overflow: "hidden",
      }}
    >
      <div
        className={`flex flex-col transition-all duration-1000 ease-in-out animation-fill-forwards`}
        style={{
          transform: `translate${direction.toUpperCase()}(${transformVal}vh)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Slide({ children, className }) {
  return <div className={className}>{children}</div>;
}
