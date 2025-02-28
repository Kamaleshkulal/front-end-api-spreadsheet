import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between">
                <Link href="/" className="font-bold text-lg">Spreadsheet App</Link>
                <Link href="/add-spreadsheet" className="bg-white text-blue-600 px-3 py-1 rounded">+ Add Spreadsheet</Link>
            </div>
        </nav>
    );
}
