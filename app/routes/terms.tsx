import { getUserId } from "~/utils/session.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import PageHeading from "~/components/PageHeading";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  isUserLoggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return {
    isUserLoggedIn: Boolean(userId),
  };
};

export default function TermsScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <PageHeading>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Terms</span>
          </h1>
        </PageHeading>

        <div className="prose prose-slate mt-16 max-w-none px-12 md:prose-lg sm:mt-24">
          <p className="font-bold">Effective Date: [Date]</p>
          <h3>1. Acceptance of Terms</h3>
          <p>
            Welcome to [SaaS Software Name] ("Service"). By accessing or using
            the Service, you agree to be bound by these Terms of Service
            ("Terms"). If you do not agree with these Terms, please do not use
            the Service.
          </p>
          <h3>2. Use of the Service</h3>
          <h4>2.1 License</h4>
          <p>
            Subject to these Terms, [Company Name] grants you a non-exclusive,
            non-transferable, revocable license to use the Service for the
            purpose of tracking page views on websites owned or operated by you.
          </p>
          <h4>2.2 User Accounts</h4>
          <p>
            To access the Service, you may need to create an account. You are
            responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
          </p>
          <h3>3. Data Privacy</h3>
          <h4>3.1 Data Collection</h4>
          <p>
            The Service collects and stores data related to page views on your
            websites, including page URLs, browser information, and referring
            URLs.
          </p>
          <h4>3.2 Data Usage</h4>
          <p>
            [Company Name] will use the collected data solely for the purpose of
            providing the Service to you.
          </p>
          <h4>3.3 Data Security</h4>{" "}
          <p>
            [Company Name] employs industry-standard security measures to
            protect the data collected. However, no method of data transmission
            over the Internet or electronic storage is completely secure. You
            use the Service at your own risk.
          </p>
          <h3>4. Payment and Subscription</h3>
          <h4>4.1 Fees</h4>
          <p>
            The use of the Service may be subject to subscription fees. You
            agree to pay the fees as specified on the Service's pricing page.
            Fees are non-refundable.
          </p>
          <h4>4.2 Billing Cycle</h4>
          <p>
            Subscription fees are billed on a recurring basis (e.g., monthly,
            annually) and will be charged automatically using the payment method
            you provide.
          </p>
          <h3>5. Intellectual Property</h3>
          <h4>5.1 Ownership</h4>
          <p>
            [Company Name] retains all right, title, and interest in and to the
            Service, including all intellectual property rights.
          </p>
          <h4>5.2 User Content</h4>
          <p>
            You grant [Company Name] a non-exclusive, worldwide, royalty-free
            license to use, reproduce, modify, and display any content you
            submit to the Service for the purpose of providing the Service.
          </p>
          <h3>6. Termination</h3>
          <h4>6.1 Termination by You</h4>
          <p>
            You may terminate your use of the Service at any time by canceling
            your subscription.
          </p>
          <h4>6.2 Termination by [Company Name]</h4>
          <p>
            [Company Name] reserves the right to suspend or terminate your
            access to the Service at its sole discretion, with or without cause,
            and without notice.
          </p>
          <h3>7. Limitation of Liability</h3>
          <h4>7.1 Disclaimer</h4>
          <p>
            The Service is provided "as is" without any warranties of any kind,
            whether express or implied. [Company Name] disclaims all liability
            for any damages, including but not limited to direct, indirect,
            incidental, consequential, or punitive damages.
          </p>
          <h3>8. Governing Law</h3>
          <h4>8.1 Jurisdiction</h4>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of [Jurisdiction]. Any disputes arising from or in
            connection with these Terms shall be subject to the exclusive
            jurisdiction of the courts of [Jurisdiction].
          </p>
          <h3>9. Changes to Terms</h3>
          <h4>9.1 Modification</h4>
          <p>
            [Company Name] reserves the right to modify or update these Terms at
            any time. Changes will be effective upon posting to the Service.
            Your continued use of the Service after any changes constitutes
            acceptance of the revised Terms.
          </p>
          <h3>10. Contact Us</h3>
          <h4>10.1 Questions</h4>
          <p>
            If you have any questions about these Terms, please contact us at
            [Contact Email].
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
