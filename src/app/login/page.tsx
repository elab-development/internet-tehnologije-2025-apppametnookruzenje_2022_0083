import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>

      <p>Prijavite se na nalog kako biste pristupili dashboard-u.</p>

      <form>
        <div>
          <label>Email</label>
          <br />
          <input type="email" placeholder="npr. ime@email.com" />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Lozinka</label>
          <br />
          <input type="password" placeholder="Unesite lozinku" />
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="button">Prijavi se</button>
        </div>
      </form>

      <p style={{ marginTop: "16px" }}>
        Nemaš nalog? <Link href="/register">Registruj se</Link>
      </p>
    </main>
  );
}


