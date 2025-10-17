export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col p-8 [&_h1]:text-xl [&_h1]:font-bold gap-4 [&_h2]:text-l [&_h2]:font-bold">
      <div className="flex flex-col gap-2 border-b border-foreground/30 w-fit pr-2 pb-2 mb-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <h1 className="text-base font-normal">Last Updated: October 2025</h1>
      </div>

      <div className="flex flex-col gap-2">
        <h1>1. Introduction</h1>
        <div>
          DocuQuery values your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you use our website
          and services. DocuQuery allows users to upload PDF documents and
          interact with an AI chatbot powered by GPT-5-mini. Our goal is to
          collect as little personal information as possible, only what’s
          necessary to operate and improve our service.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1>2. Information We Collect</h1>
        <p>We collect two types of information depending on your account type:</p>
        <h2>Free Users</h2>
        <ul className="list-disc pl-8">
          <li>No personal information is required or stored.</li>
          <li>
            You may upload PDF files temporarily for AI analysis, but these files
            are not associated with any personal account.
          </li>
        </ul>

        <h2>Paid Users</h2>
        <p>To create and maintain an account, we collect:</p>
        <ul className="list-disc pl-8">
          <li>
            Name and email address (from you or your OAuth provider such as Google
            or GitHub)
          </li>
          <li>Authentication data provided by your OAuth provider</li>
          <li>
            Subscription and billing information, managed securely through Stripe
          </li>
        </ul>
        <p>
          We do not directly store or handle your credit card details — all payment
          data is processed by Stripe in compliance with their security and privacy
          standards.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>3. How We Use Your Information</h1>
        <ul className="list-disc pl-8">
          <li>Creating and managing user accounts</li>
          <li>Providing access to premium features</li>
          <li>Processing payments and subscriptions through Stripe</li>
          <li>Communicating account or service updates</li>
          <li>Improving system reliability and user experience</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h1>4. Data Retention</h1>
        <p>
          We retain account data (name, email, subscription status) while your
          account is active. If you delete your account or cancel your subscription,
          your personal data will be deleted within a reasonable period. Uploaded
          PDFs are only stored as needed to provide the service and may be
          automatically deleted after processing.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>5. Data Security</h1>
        <p>
          We take reasonable technical and organizational measures to protect your
          information. However, no system is completely secure, and by using
          DocuQuery, you acknowledge this inherent risk.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>6. Third-Party Services</h1>
        <p>We use trusted third-party services to operate DocuQuery:</p>
        <ul className="list-disc pl-8">
          <li>OpenAI – for AI model responses</li>
          <li>Stripe – for billing and subscription management</li>
          <li>OAuth providers (e.g., Google, GitHub) – for secure sign-in</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h1>7. Your Rights</h1>
        <p>You may:</p>
        <ul className="list-disc pl-8">
          <li>Request to view, update, or delete your account data</li>
          <li>Cancel your subscription at any time</li>
          <li>Contact us with any privacy-related concerns</li>
        </ul>
        <p>
          To make a request, please contact:{" "}
          <span className="font-semibold">support@docuquery.online</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1>8. Changes to This Policy</h1>
        <p>
          We may update this Privacy Policy as our service evolves. Significant
          updates will be communicated via the website or by email (for paid users).
        </p>
      </div>
    </div>
  );
}
