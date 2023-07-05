import prisma from "@/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { allowMethods } from "next-method-guard";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.cookies.access_token;
    const fly_id = req.query.fly_id;
    if (!token) {
      return res.status(400).json({ message: "Token is missing in request" });
    }

    if (!fly_id) {
      return res.status(400).json({ message: "Fly id is missing in request" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      uuid: string;
    };

    const user_id = decoded.uuid;

    if (!user_id)
      return res.status(400).json({ message: "Missing user id in payload" });

    const isUser = await prisma.user.findUnique({
      where: {
        uuid: user_id,
      },
    });

    if (!isUser) return res.status(400).json({ message: "Invalid user id" });

    const fly = await prisma.fly.findFirst({
      where: {
        uuid: fly_id as string,
        user_id: user_id,
      },
    });

    if (!fly) return res.status(400).json({ message: "Invalid fly id" });

    const files = await prisma.file.count({
      where: {
        fly_id: fly_id as string,
      },
    });

    return res.status(200).json({
      files,
      used_storage: Number(fly.used_storage),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default allowMethods(["GET"])(handler);
