import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            Questionnaire App
          </Link>
          <div className="space-x-4">
            <Link href="/questionnaires/create" className="text-white">
              Create
            </Link>
            <Link href="/questionnaires/list" className="text-white">
              List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
