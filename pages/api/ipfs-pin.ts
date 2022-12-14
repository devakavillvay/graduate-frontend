// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { pinataApi } from "utils/pinataApi";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

type Data = {
    name: any;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === "POST") {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files: any) => {
            const data = fs.readFileSync(files.file.filepath);
            fs.writeFileSync(
                `./public/${
                    files.file.newFilename +
                    "." +
                    files.file.originalFilename.split(".").slice(-1)
                }`,
                data
            );
            const formData = new FormData();
            formData.append(
                "file",
                fs.createReadStream(
                    `./public/${
                        files.file.newFilename +
                        "." +
                        files.file.originalFilename.split(".").slice(-1)
                    }`
                )
            );
            formData.append("pinataOptions", '{"cidVersion": 1}');
            const result = await pinataApi.post("/pinFileToIPFS", formData);
            fs.unlinkSync(
                `./public/${
                    files.file.newFilename +
                    "." +
                    files.file.originalFilename.split(".").slice(-1)
                }`
            );
            fs.unlinkSync(files.file.filepath);
            res.status(200).json(result.data);
        });
    } else {
        res.status(405).json("method not allowed");
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
