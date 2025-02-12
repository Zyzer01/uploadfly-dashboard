import { ExtendedRequest } from "@/interfaces";
import authenticateToken from "@/middleware/auth";
import prisma from "@/prisma";
import { NextApiResponse } from "next";
import { allowMethods } from "next-method-guard";

const handler = async (req: ExtendedRequest, res: NextApiResponse) => {
  const log_id = req.query.log_id as string;
  const fly_id = req.query.fly_id as string;
  if (!log_id)
    return res.status(400).json({ message: "Log ID is missing in request." });

  const log = await prisma.log.findUnique({
    where: {
      uuid: log_id,
    },
    select: {
      created_at: true,
      ip_address: true,
      request_body: true,
      response_body: true,
      endpoint: true,
      method: true,
      status: true,
      uuid: true,
      fly_id: true,
    },
  });

  if (!log) return res.status(404).json({ message: "Log not found." });

  const fly = await prisma.fly.findUnique({
    where: {
      uuid: fly_id,
    },
  });

  if (fly?.uuid !== log?.fly_id)
    return res.status(404).json({ message: "Log not found." });

  res.status(200).json(log);
};

export default allowMethods(["GET"])(
  (req: ExtendedRequest, res: NextApiResponse) =>
    authenticateToken(req, res, () => handler(req, res))
);
