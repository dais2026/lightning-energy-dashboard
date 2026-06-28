import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock the storage module
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key_abc12345.pdf", url: "/manus-storage/test-key_abc12345.pdf" }),
}));

import { getDb } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("files.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all files when no category filter is provided", async () => {
    const mockFiles = [
      {
        id: 1, name: "Test.pdf", originalName: "Test.pdf",
        fileKey: "test_abc.pdf", url: "/manus-storage/test_abc.pdf",
        mimeType: "application/pdf", size: 1024,
        category: "datasheets", uploadedAt: new Date(),
      },
    ];

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockFiles),
    };

    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const caller = appRouter.createCaller(createContext());
    const result = await caller.files.list({});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test.pdf");
  });

  it("filters files by category", async () => {
    const mockFiles = [
      { id: 1, name: "Sheet.pdf", originalName: "Sheet.pdf", fileKey: "k1", url: "/manus-storage/k1", mimeType: "application/pdf", size: 500, category: "datasheets", uploadedAt: new Date() },
      { id: 2, name: "Photo.jpg", originalName: "Photo.jpg", fileKey: "k2", url: "/manus-storage/k2", mimeType: "image/jpeg", size: 200, category: "images", uploadedAt: new Date() },
    ];

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockFiles),
    };

    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const caller = appRouter.createCaller(createContext());
    const result = await caller.files.list({ category: "datasheets" });

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("datasheets");
  });

  it("throws INTERNAL_SERVER_ERROR when database is unavailable", async () => {
    vi.mocked(getDb).mockResolvedValue(null as any);

    const caller = appRouter.createCaller(createContext());
    await expect(caller.files.list({})).rejects.toThrow("Database unavailable");
  });
});

describe("files.delete", () => {
  it("deletes a file record by id", async () => {
    const mockDb = {
      delete: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const caller = appRouter.createCaller(createContext());
    const result = await caller.files.delete({ id: 1 });

    expect(result).toEqual({ success: true });
    expect(mockDb.delete).toHaveBeenCalled();
  });
});
