import logo from "~/assets/logo.svg";
import logoWhite from "~/assets/logo_white.svg";
import logoText from "~/assets/logo_text.svg";
import logoTextWhite from "~/assets/logo_text_white.svg";
import { Link } from "@remix-run/react";

type Props = {
  withText?: boolean;
  withLink?: boolean;
  white?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
};

export default function Logo({
  withText = false,
  withLink = false,
  white = false,
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
      classSize = "h-8 sm:h-10";
      break;
    case "xs":
      classSize = "h-8";
      break;
    default:
      classSize = "h-8 sm:h-10";
  }

  let src;
  if (withText) {
    src = logoText;
    if (white) {
      src = logoTextWhite;
    }
  } else {
    src = logo;
    if (white) {
      src = logoWhite;
    }
  }

  return withLink ? (
    <Link to="/">
      <span className="sr-only">Fantomely</span>
      <img className={`w-auto ${classSize}`} src={src} alt="Fantomely" />
    </Link>
  ) : (
    <div>
      <span className="sr-only">Fantomely</span>
      <img className={`w-auto ${classSize}`} src={src} alt="Fantomely" />
    </div>
  );
}
