import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface AppShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const AppShell = ({ children, showFooter = true }: AppShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
