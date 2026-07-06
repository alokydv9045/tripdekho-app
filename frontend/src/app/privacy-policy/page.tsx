export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-gray-800">
        <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your data.</p>
        <h2 className="text-2xl font-bold">1. Data Collection</h2>
        <p>We collect information you provide directly to us when you create an account, update your profile, or use our services.</p>
      </div>
    </div>
  );
}
