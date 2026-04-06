import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">
            Back to home
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Terms of Use</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-gray-700">
          <p>
            Emoji Mosaic Generator is provided as a creative utility for lawful, personal,
            educational, and professional use. By using the site, you agree not to upload or
            process content that violates applicable law or the rights of others.
          </p>
          <p>
            You are responsible for the images you choose to upload and for how you use the
            resulting generated output. Make sure you have the necessary rights or permissions for
            the source material.
          </p>
          <p>
            We may update, improve, limit, or remove parts of the tool over time as the project
            evolves. Continued use of the site means you accept the latest version of these terms.
          </p>
          <p>
            If you notice a problem, policy concern, or copyright issue, please reach out through
            the contact information provided on the site so it can be reviewed.
          </p>
        </div>
      </div>
    </main>
  );
}
