import { SyntheticEvent, useState } from "react";
import { useAccount, useContract, useSigner, useSignTypedData } from "wagmi";
import contractAbi from "@/contracts/VillvayCerts.json";
import Spinner from "../Spinner";

type Certificate = {
    studentAddress: string;
    name: string;
    qualification: string;
    major: string;
};

const Student = () => {
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [signature, setSignature] = useState<string>("");
    const contract = useContract({
        addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        contractInterface: contractAbi.abi,
        signerOrProvider: signer,
    });
    const [formData, setFormData] = useState<Certificate>({
        studentAddress: "",
        name: "",
        qualification: "",
        major: "",
    });

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        console.log("in grant");
        console.log(formData);
        const tx = await contract.verifyCert(formData, signature, {
            gasLimit: 500000,
        });
        alert(tx);
    };

    const handleChange = (e: any) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    console.log(formData);

    return (
        <>
            <h2 className="text-gray-800 text-center mt-10 font-extrabold text-3xl">
                Welcome Student
            </h2>
            <h2 className="text-gray-800 text-center mt-10 mb-5 text-3xl">
                Verify Certificate Details
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid place-items-center">
                    <input
                        required
                        placeholder="Student Address"
                        name="studentAddress"
                        value={formData.studentAddress}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Major"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <input
                        required
                        placeholder="Signature"
                        name="signature"
                        value={signature}
                        onChange={(e: any) => setSignature(e.target.value)}
                        className="text-center font-semibold text-lg mt-5 w-2/3 h-10 rounded bg-gray-700 text-indigo-200"
                    />
                    <button
                        type="submit"
                        className="mt-5 bg-gray-700 text-indigo-200 rounded px-10 py-1 text-lg font-semibold"
                    >
                        Verify
                    </button>
                </div>
            </form>
        </>
    );
};

export default Student;
