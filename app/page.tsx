"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {

   redirect("/login");
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Kapasite Raporu Uygulamasına Hoşgeldiniz</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Giriş Yap
        </Link>
        {/* <Link href="/register" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
          Kayıt Ol
        </Link> */}
      </div>
    </main>
  );
}
