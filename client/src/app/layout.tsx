import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Questionnaire App",
  description: "Create questionnaires",
};

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <main className="container mx-auto pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
