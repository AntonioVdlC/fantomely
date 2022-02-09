import H2 from "~/components/SectionHeader";

export default function SettingsRoute() {
  return (
    <>
      <H2>Export data</H2>
      <p>
        If you want to export your data, please send an email to{" "}
        <a href="mailto:support@fantomely.com" className="underline">
          support@fantomely.com
        </a>
        .
      </p>

      <hr className="my-4" />

      <H2>Delete account</H2>
      <p>
        If you want to delete your account, please send an email to{" "}
        <a href="mailto:support@fantomely.com" className="underline">
          support@fantomely.com
        </a>
        .
      </p>
    </>
  );
}
