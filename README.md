# React Headless Rating component

Fully unstyled, accessable, rating component.

## Features

- Use any react element (e.g. SVG) to represent a "star"
- Style each element based on the selection state
- WCAG compliant (including keyboard activation)
- Zero dependencies

## Install

```bash
npm install react-headless-rating
```

```bash
yarn add react-headless-rating
```

## Code example

The following code example uses tailwindCSS to style the component.

```jsx
import { createRef, useState } from "react";
import { Rating, StarState } from "react-headless-rating";

function ratingClassName(state: StarState, readonly: boolean) {
  let defaultClassName = "text-gray-300 text-2xl pr-2 last:pr-0 transition-all";
  if (state === "selected") {
    defaultClassName += " text-yellow-500";
  }
  if (!readonly) {
    defaultClassName += " hover:scale-110";
  }
  return defaultClassName;
}

interface MyRatingProps {
  initialRating?: number;
  readonly?: boolean;
}

export function MyRating(props: MyRatingProps) {
  const [currentRating, setCurrentRating] = useState<number | null>(
    props.initialRating ?? null
  );

  const numberOfStars = 5;
  let elems = [];
  for (let i = 0; i < numberOfStars; i++) {
    elems.push(
      <Rating.Star label={`${i + 1} star`} className={ratingClassName} key={i}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </Rating.Star>
    );
  }

  const onChangeRating = (newRating: number | null) => {
    setCurrentRating(newRating);
  };

  const onClearRating = () => {
    setCurrentRating(null);
  };

  const classNameCursor = props.readonly ? "cursor-default" : "cursor-pointer";

  const ref = createRef<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4 p-10">
      <Rating
        className={`flex flex-row ${classNameCursor}`}
        currentRating={currentRating}
        onChangeRating={onChangeRating}
        readonly={props.readonly}
        ref={ref}
      >
        {elems}
      </Rating>
      Current rating: {currentRating}
      <div className="underline cursor-pointer" onClick={onClearRating}>
        Clear rating
      </div>
    </div>
  );
}
```