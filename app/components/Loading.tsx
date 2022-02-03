import Logo from "~/components/Logo";

type Props = {
  text?: string;
};

export default function Loading({ text }: Props) {
  return (
    <>
      <div className="animate-ping">
        <Logo size="md" />
      </div>
      {text ? <p className="mt-12 text-slate-900">{text}</p> : null}
    </>
  );
}
