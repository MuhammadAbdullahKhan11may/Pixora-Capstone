export default async function HealthPage() {
  let data = null;
  let error = null;

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch health-check data.");
    }

    data = await response.json();
  } catch (err) {
    error = err.message;
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Health Check</h1>

      {error ? (
        <div className="mt-6">
          <p className="font-semibold text-red-600">Status: Error</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      ) : (
        <div className="mt-6">
          <p className="font-semibold text-green-600">Status: Online</p>

          <p className="mt-3 text-gray-600">
            Fetched data: {data?.title}
          </p>
        </div>
      )}
    </main>
  );
}