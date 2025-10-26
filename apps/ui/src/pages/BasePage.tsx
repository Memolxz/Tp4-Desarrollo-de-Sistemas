import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface BasePageProps {
  pageName: string;
  children: ReactNode;
}

export default function BasePage({ pageName, children }: BasePageProps) {
  return (
    <>
      <Header />
      <main className="text-geist">
        {children}
      </main>
      <Footer />
    </>
  );
}
