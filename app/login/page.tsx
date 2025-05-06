"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token, email } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      router.push("/basvuru");
    } else {
      alert("Giriş başarısız.");
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center sm:justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Sol Üst Logo */}
      <div className="absolute top-8 left-8 sm:left-4">
        <h1 className="text-4xl sm:text-3xl font-bold text-indigo-700">ExCap</h1>
      </div>

      {/* Sağdaki Login Kartı */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-4 sm:px-2"
      >
        <Card className="bg-blue-600 text-white rounded-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">GİRİŞ</CardTitle>
            <p className="text-center text-sm text-gray-200 mt-2">
              Hesabınıza giriş yapmak için aşağıya e-posta ve şifrenizi girin.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold" htmlFor="email">
                  E-Posta <span className="text-red-400">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-Posta"
                  className="bg-white text-black focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold" htmlFor="password">
                  Şifre <span className="text-red-400">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifre"
                  className="bg-white text-black focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-gray-200 hover:underline">
                  Şifremi unuttum.
                </a>
              </div>

              <Button
                type="submit"
                className="mt-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition duration-300"
              >
                Giriş
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
