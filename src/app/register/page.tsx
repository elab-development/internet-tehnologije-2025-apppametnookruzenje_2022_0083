import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex justify-center pt-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/50 backdrop-blur-md shadow-lg p-7">
        
        <h1 className="text-2xl font-bold mb-1">Registracija</h1>
        <p className="text-sm text-gray-700 mb-5">
          Kreirajte nalog kako biste mogli da upravljate pametnim okruženjem.
        </p>

        <form className="space-y-4">
          
          <div>
            <label className="block font-medium">Ime i prezime</label>
            <input
              type="text"
              placeholder="npr. Pera Perić"
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="npr. ime@email.com"
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block font-medium">Lozinka</label>
            <input
              type="password"
              placeholder="Unesite lozinku"
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="button"
            className="w-full mt-2 rounded-xl bg-indigo-900 text-white py-3 font-semibold hover:bg-indigo-800 transition"
          >
            Registruj se
          </button>

        </form>

        <p className="text-sm mt-4">
          Već imaš nalog?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-900 hover:underline"
          >
            Prijavi se
          </Link>
        </p>

      </div>
    </main>
  );
}