import { useState } from "react";
import { addSpreadsheet } from "../utils/api";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function AddSpreadsheet() {
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addSpreadsheet({ name });
        router.push("/");
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-6">
                <h1 className="text-2xl font-bold">Add Spreadsheet</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input type="text" placeholder="Spreadsheet Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" required />
                    <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </form>
            </div>
        </div>
    );
}
