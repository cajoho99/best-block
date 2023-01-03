import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";


export const blocksRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.block.findMany();
    }),

})
