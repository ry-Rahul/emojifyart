import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">
            Back to home
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-gray-700">
          <p>
            Emoji Mosaic Generator is designed to let visitors create emoji-based artwork from
            images in a simple browser workflow. Uploaded images are processed for the purpose of
            generating the requested mosaic output.
          </p>
          <p>
            We may use analytics and operational monitoring to understand site performance,
            reliability, and usage trends. This helps us improve speed, stability, and user
            experience.
          </p>
          <p>
            If you contact us directly through LinkedIn or another external service, the privacy
            practices of that platform also apply to your communication there.
          </p>
          <p>
            If the site experience or data-handling approach changes materially in the future, this
            page should be updated so visitors can review the latest policy.
          </p>
        </div>
      </div>
    </main>
  );
}

