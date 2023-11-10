import React, {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
} from "react";

export type StarState = "selected" | "unselected";

interface BasicHeadlessComponentProps extends PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
}

interface RatingContainerProps extends BasicHeadlessComponentProps {
  currentRating?: number | null;
  onChangeRating?: (newRating: number | null) => void;
  readonly?: boolean;
}

interface StarProps extends Omit<BasicHeadlessComponentProps, "className"> {
  label: string;
  className?: string | ((state: StarState, readonly: boolean) => string);
}

interface RatingContext {
  readonly currentRating: number | null | undefined;
  readonly currentSelection: number | null;
  readonly readonly: boolean | undefined;
  setCurrentRating: (newRating: number | null) => void;
  setCurrentSelection: (newSelection: number | null) => void;
}

const RatingContext = createContext<RatingContext | null>(null);
const StarContext = createContext<number | null>(null);

const RatingContainer = forwardRef(function Container(
  props: RatingContainerProps,
  ref: React.Ref<HTMLDivElement>
) {
  const [currentSelection, setCurrentSelection] = React.useState<number | null>(
    null
  );

  const ratingContext: RatingContext = {
    currentRating: props.currentRating,
    currentSelection,
    readonly: props.readonly,
    setCurrentRating: (newRating) => {
      props.onChangeRating && props.onChangeRating(newRating);
    },
    setCurrentSelection: (newSelection) => {
      setCurrentSelection(newSelection);
    },
  };

  const starChildren = React.Children.map(props.children, (child, i) => {
    return <StarContext.Provider value={i + 1}>{child}</StarContext.Provider>;
  });

  return (
    <RatingContext.Provider value={ratingContext}>
      <div className={props.className} style={props.style} ref={ref}>
        {starChildren}
      </div>
    </RatingContext.Provider>
  );
});

const Star = forwardRef(function Star(
  props: StarProps,
  ref: React.Ref<HTMLDivElement>
) {
  const context = useContext(RatingContext);
  const starIndex = useContext(StarContext);
  const [starState, setStarState] = React.useState<StarState>("unselected");

  const id = useId();
  const fullInternalId = `__hr__star-${id}`;

  const onClick = () => {
    !context?.readonly && context?.setCurrentRating(starIndex);
  };

  let finalClassName;
  if (typeof props.className === "function") {
    finalClassName = props.className(starState, !!context?.readonly);
  } else {
    finalClassName = props.className;
  }

  useEffect(() => {
    if (
      (context?.currentSelection ?? context?.currentRating ?? 0) >=
      (starIndex ?? 0)
    ) {
      setStarState("selected");
    } else {
      setStarState("unselected");
    }
  }, [
    context?.currentRating,
    starIndex,
    setStarState,
    context?.currentSelection,
  ]);

  const onMouseEnter = () => {
    !context?.readonly && context?.setCurrentSelection(starIndex);
  };

  const onMouseOut = () => {
    !context?.readonly && context?.setCurrentSelection(null);
  };

  return (
    <div
      role="radio"
      aria-label={props.label}
      aria-checked={starState === "selected"}
      aria-readonly={context?.readonly ? "true" : "false"}
      id={fullInternalId}
      className={finalClassName}
      style={props.style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

export const Rating = Object.assign(RatingContainer, {
  Star,
});
