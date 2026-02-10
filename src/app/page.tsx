import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex justify-center pt-16 px-4">
      <div className="w-full max-w-3xl text-center">
        
        <h1 className="text-3xl font-bold mb-4">
          Pametno okruženje
        </h1>

        <p className="text-gray-700 mb-8">
          Ova aplikacija omogućava upravljanje pametnim uređajima kao što su
          svetlo, klima uređaj i pametna brava putem veb interfejsa.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-900 text-white px-6 py-3 font-semibold hover:bg-indigo-800 transition"
          >
            Prijavi se
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-indigo-900 text-indigo-900 px-6 py-3 font-semibold hover:bg-indigo-50 transition"
          >
            Registruj se
          </Link>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/60 p-4 shadow">
            <h3 className="font-semibold mb-1">💡 Pametno svetlo</h3>
            <p className="text-sm text-gray-600">
              Uključivanje i isključivanje rasvete.
            </p>
          </div>

          <div className="rounded-xl bg-white/60 p-4 shadow">
            <h3 className="font-semibold mb-1">❄️ Klima uređaj</h3>
            <p className="text-sm text-gray-600">
              Kontrola temperature prostora.
            </p>
          </div>

          <div className="rounded-xl bg-white/60 p-4 shadow">
            <h3 className="font-semibold mb-1">🔒 Pametna brava</h3>
            <p className="text-sm text-gray-600">
              Zaključavanje i otključavanje vrata.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

