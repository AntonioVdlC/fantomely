import { Fragment } from "react";
import { Link } from "remix";

import logo from "~/assets/logo.svg";
import logoText from "~/assets/logo_text.svg";

type Props = {
  withText?: boolean;
  withLink?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Logo({
  withText = false,
  withLink = false,
  size = "sm",
}: Props) {
  let classSize;
  switch (size) {
    case "lg":
      classSize = "h-14";
      break;
    case "md":
      classSize = "h-12";
      break;
    case "sm":
    default:
      classSize = "h-8 sm:h-10";
  }

  const Component = withLink ? Link : Fragment;

  return (
    <Component to="/">
      <span className="sr-only">Fantomely</span>
      <img
        className={`w-auto ${classSize}`}
        src={withText ? logoText : logo}
        alt="Fantomely"
      />
    </Component>
  );
}
