import Navbar from '@/components/Navbar';
import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Questionnaire App",
  description: "Create questionnaires",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar />
        <main className="container mx-auto mt-10">
          {children}
        </main>
      </body>
    </html>
  );
}

