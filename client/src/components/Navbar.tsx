import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-600 p-4 text-white w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Questionnaires</Link>
        <div className="space-x-4">
          <Link href="/questionnaires" className="text-lg"></Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
