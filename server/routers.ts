import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { files } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

// Admin Router
const adminRouter = router({
  // Get system health
  getHealth: publicProcedure.query(async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };
  }),

  // Get metrics
  getMetrics: publicProcedure.query(async () => {
    const memUsage = process.memoryUsage();
    return {
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }),

  // Get system info
  getSystemInfo: publicProcedure.query(async () => {
    return {
      version: '1.0.0',
      node: process.version,
      platform: process.platform,
      uptime: Math.round(process.uptime()),
      memory: process.memoryUsage(),
    };
  }),

  // Get user activity logs (stub)
  getUserActivity: publicProcedure
    .input(z.object({ 
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      return {
        activities: [],
        total: 0,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Get system statistics
  getStats: publicProcedure.query(async () => {
    return {
      totalUsers: 0,
      totalFiles: 0,
      apiRequests24h: 0,
      errors24h: 0,
      averageResponseTime: 0,
    };
  }),
});

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // File Storage procedures
  files: router({
    // List all files, optionally filtered by category
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const rows = await db
          .select()
          .from(files)
          .orderBy(desc(files.uploadedAt));
        if (input?.category && input.category !== "all") {
          return rows.filter(r => r.category === input.category);
        }
        return rows;
      }),

    // Upload a file — receives base64-encoded data from client
    upload: publicProcedure
      .input(z.object({
        name: z.string(),
        originalName: z.string(),
        mimeType: z.string(),
        size: z.number(),
        category: z.string().default("general"),
        dataBase64: z.string(), // base64-encoded file content
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Decode base64 to buffer
        const buffer = Buffer.from(input.dataBase64, "base64");

        // Upload to S3
        const safeKey = `lightning-energy/files/${Date.now()}-${input.originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { key, url } = await storagePut(safeKey, buffer, input.mimeType);

        // Save metadata to DB
        await db.insert(files).values({
          name: input.name,
          originalName: input.originalName,
          fileKey: key,
          url,
          mimeType: input.mimeType,
          size: input.size,
          category: input.category,
        });

        // Return the newly created record
        const [record] = await db
          .select()
          .from(files)
          .orderBy(desc(files.uploadedAt))
          .limit(1);

        return record;
      }),

    // Delete a file record (removes DB entry; S3 key becomes unreachable)
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        await db.delete(files).where(eq(files.id, input.id));
        return { success: true };
      }),

    // Update file name or category
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const updates: Record<string, string> = {};
        if (input.name) updates.name = input.name;
        if (input.category) updates.category = input.category;
        await db.update(files).set(updates).where(eq(files.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
