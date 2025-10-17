export default function TermsAndConditions() {
  return (
    <div className="flex flex-col p-8 [&_h1]:text-xl [&_h1]:font-bold gap-4 [&_h2]:text-l [&_h2]:font-bold">
      <div className="flex flex-col gap-2 border-b border-foreground/30 w-fit pr-2 pb-2 mb-2">
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        <h1 className="text-base font-normal">Last Updated: October 2025</h1>
      </div>

      <div className="flex flex-col gap-2">
        <h1>1. Acceptance of Terms</h1>
        <p>
          By using DocuQuery, you agree to these Terms of Service. If you do not
          agree, you must not use the platform.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>2. Description of Service</h1>
        <p>
          DocuQuery is an AI-powered document question-and-answer platform that
          allows users to upload PDF documents and query their contents using
          GPT-based models. Free users can use the service without an account, while
          paid users can access premium features through a registered account and an
          active subscription.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>3. User Accounts</h1>
        <ul className="list-disc pl-8">
          <li>Free users do not require an account.</li>
          <li>Paid users must create an account via OAuth (e.g., Google, GitHub).</li>
          <li>
            You are responsible for maintaining the security of your account
            credentials.
          </li>
          <li>
            You agree to provide accurate and current information when registering.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h1>4. Subscription and Payments</h1>
        <ul className="list-disc pl-8">
          <li>Paid features require a valid subscription managed through Stripe.</li>
          <li>
            You authorize Stripe to handle recurring payments according to your
            selected plan.
          </li>
          <li>We do not store or have access to your payment details.</li>
          <li>
            You may cancel your subscription at any time through your account
            settings or Stripe portal.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h1>5. Acceptable Use</h1>
        <p>By using DocuQuery, you agree not to:</p>
        <ul className="list-disc pl-8">
          <li>Upload or share illegal, copyrighted, or harmful content.</li>
          <li>Attempt to disrupt or misuse the service.</li>
          <li>Use the AI to generate or distribute prohibited content.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these
          terms.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>6. Intellectual Property</h1>
        <p>
          All code, branding, and design elements of DocuQuery are owned by the
          developer. Uploaded documents remain your property. AI-generated responses
          are provided for informational purposes and may not be factually perfect.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>7. Limitation of Liability</h1>
        <p>
          DocuQuery is provided “as is” without any warranties. We are not liable for
          any damages resulting from the use or inability to use the service.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>8. Termination</h1>
        <p>
          You may delete your account or cancel your subscription at any time. We
          reserve the right to suspend or terminate access for misuse or
          non-compliance with these Terms.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>9. Contact</h1>
        <p>
          For any questions about these Terms or your account, please contact:{" "}
          <span className="font-semibold">cameyer@gmail.com</span>
        </p>
      </div>
    </div>
  );
}
