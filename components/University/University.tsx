import { SyntheticEvent, useState } from "react";
import { useContract, useSigner, useSignTypedData } from "wagmi";
import contractAbi from "@/contracts/VillvayCerts.json";
import { domain, types } from "./eip";
import Spinner from "../Spinner";
import Response from "../Response";
import axios from "axios";
import Image from "next/image";

type Certificate = {
    studentAddress: string;
    name: string;
    qualification: string;
    major: string;
};

const University = () => {
    const { data: signer } = useSigner();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const contract = useContract({
        addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        contractInterface: contractAbi.abi,
        signerOrProvider: signer,
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
    const [resultText, setResultText] = useState<string>("");
    const [ipfsHash, setIpfsHash] = useState<string>("");
    const [resultOpen, setResultOpen] = useState<boolean>(false);
    const [imageFormData, setImageFormData] = useState<FormData>();
    const [formData, setFormData] = useState<Certificate>({
        studentAddress: "",
        name: "",
        qualification: "",
        major: "",
    });
    const { data: signature, signTypedData } = useSignTypedData();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await axios.post("/api/ipfs-pin", imageFormData);
        setIsLoading(false);
        setIpfsHash(response.data.IpfsHash);
        signTypedData({
            domain,
            types,
            value: { ...formData, ipfsHash: response.data.IpfsHash },
        });
        try {
            const tx = await contract.grantCertificate(
                formData.studentAddress,
                { ...formData, ipfsHash: response.data.IpfsHash },
                { gasLimit: 500000 }
            );
            setIsLoading(true);
            await tx.wait();
            setIsLoading(false);
            setResultOpen(true);
            setResultText("Certificate Granted!");
            setFormData({
                studentAddress: "",
                name: "",
                qualification: "",
                major: "",
            });
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            setResultOpen(true);
            setResultText("An Error Occurred, Please Try Again Later");
        }
    };

    const handleChange = (e: any) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleImageUpload = async (e: any) => {
        if (e.target.files.length > 0) {
            const body = new FormData();
            body.append("file", e.target.files[0]);
            setImageFormData(body);
            setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };
    return (
        <>
            <h2 className="text-gray-800 text-center mt-10 font-extrabold text-3xl">
                Welcome Administrator
            </h2>
            <h2 className="text-gray-800 text-center mt-10 mb-5 text-3xl">
                Grant A Certificate
            </h2>
            <form className="w-full" onSubmit={handleSubmit}>
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
                    <label htmlFor="imageUpload" className="mt-5"></label>
                    <input
                        required
                        onChange={handleImageUpload}
                        type="file"
                        id="imageUpload"
                        className="text-sm text-grey-500 file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:cursor-pointer hover:file:bg-indigo-50 hover:file:text-indigo-700"
                    />
                    <button
                        type="submit"
                        className="mt-5 bg-gray-700 text-indigo-200 rounded px-10 py-1 text-lg font-semibold"
                    >
                        Grant
                    </button>
                    <p className="mt-10 text-center break-words w-2/3 font-semibold">
                        Signature : {signature}
                    </p>
                    <p className="mt-5 text-center break-words w-2/3 font-semibold">
                        IPFS Link : {ipfsHash}
                    </p>
                </div>
            </form>
            <div className="flex justify-center">
                {imagePreviewUrl && (
                    <Image
                        src={imagePreviewUrl as string}
                        alt=""
                        width={300}
                        height={300}
                        objectFit="contain"
                    />
                )}
            </div>
            <Spinner isOpen={isLoading} setIsOpen={setIsLoading} />
            <Response
                isOpen={resultOpen}
                setIsOpen={setResultOpen}
                text={resultText}
            />
        </>
    );
};

export default University;
