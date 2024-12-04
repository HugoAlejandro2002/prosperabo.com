import { PrismaClient } from "@prisma/client";
import { enviorment } from "../services/config";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (enviorment === "development") global.prisma = prisma;

export default prisma;
