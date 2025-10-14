import type { ReactNode } from "react";
import Header from "../components/Header";

interface BasePageProps {
  pageName: string;
  children: ReactNode;
}

export default function BasePage({ pageName, children }: BasePageProps) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}
