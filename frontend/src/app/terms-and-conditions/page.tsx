export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-gray-800">
        <p>Welcome to TripDekho. By accessing our application, you agree to be bound by these terms and conditions...</p>
        <h2 className="text-2xl font-bold">1. Use of Service</h2>
        <p>You must use this service responsibly and in accordance with all applicable laws.</p>
      </div>
    </div>
  );
}
