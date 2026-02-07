import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Pametno okruženje</h1>

      <p>
        Ova aplikacija omogućava upravljanje pametnim uređajima kao što su
        svetlo, klima uređaj i pametna brava.
      </p>

      <Link href="/login">Prijavi se</Link>
    </main>
  );
}
