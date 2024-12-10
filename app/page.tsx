import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">Appointments Dashboard</h1>
        </header>

        <section className="bg-white shadow-lg rounded-3xl overflow-hidden">
          <Dashboard />
        </section>
      </div>
    </main>
  );
}