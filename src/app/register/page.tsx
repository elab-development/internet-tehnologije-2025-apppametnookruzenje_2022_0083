import Link from "next/link";

export default function RegisterPage() {
  return (
    <main>
      <h1>Registracija</h1>

      <p>Kreirajte nalog kako biste mogli da upravljate pametnim okruženjem.</p>

      <form>
        <div>
          <label>Ime i prezime</label>
          <br />
          <input type="text" placeholder="npr. Pera Peric" />
        </div>

        <div style={{ marginTop: "12px" }}>
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
          <button type="button">Registruj se</button>
        </div>
      </form>

      <p style={{ marginTop: "16px" }}>
        Već imaš nalog? <Link href="/login">Prijavi se</Link>
      </p>
    </main>
  );
}
