import { Link } from "remix";

import logo from "~/assets/logo.svg";
import logoText from "~/assets/logo_text.svg";

type Props = {
  withText?: boolean;
};

export default function Logo({ withText = false }: Props) {
  return (
    <Link to="/">
      <span className="sr-only">Fantomely</span>
      <img
        className="h-8 w-auto sm:h-10"
        src={withText ? logoText : logo}
        alt="Fantomely"
      />
    </Link>
  );
}
