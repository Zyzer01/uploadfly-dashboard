import { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import { ExtendedRequest, UserModel } from "@/interfaces";

const authenticateToken = async (
  req: ExtendedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Token is missing in request" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
    uuid: string;
  };

  const user_id = decoded.uuid;

  if (!user_id)
    return res.status(400).json({ message: "Missing user id in payload" });

  const user = (await prisma.user.findUnique({
    where: {
      uuid: user_id,
    },
  })) as UserModel;

  req.user = user;

  next();
};

export default authenticateToken;
