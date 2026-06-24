import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AxiosInstance } from "axios";
import { createHttpService } from "./crudService";

interface TestItem {
  id: string;
  name: string;
}

function createFakeClient() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance;
}

describe("createHttpService", () => {
  let fakeClient: ReturnType<typeof createFakeClient>;
  let service: ReturnType<typeof createHttpService<TestItem>>;

  beforeEach(() => {
    fakeClient = createFakeClient();
    service = createHttpService<TestItem>("items", fakeClient);
  });

  it("getAll calls GET /items and returns data", async () => {
    const mockData: TestItem[] = [{ id: "1", name: "Pasta" }];
    (fakeClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.getAll();

    expect(fakeClient.get).toHaveBeenCalledWith("/items");
    expect(result).toEqual(mockData);
  });

  it("getById calls GET /items/:id and returns data", async () => {
    const mockItem: TestItem = { id: "1", name: "Pasta" };
    (fakeClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockItem,
    });

    const result = await service.getById("1");

    expect(fakeClient.get).toHaveBeenCalledWith("/items/1");
    expect(result).toEqual(mockItem);
  });

  it("create calls POST /items with payload and returns data", async () => {
    const newItem = { name: "Rice" };
    const createdItem: TestItem = { id: "2", name: "Rice" };
    (fakeClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: createdItem,
    });

    const result = await service.create(newItem);

    expect(fakeClient.post).toHaveBeenCalledWith("/items", newItem);
    expect(result).toEqual(createdItem);
  });

  it("update calls PUT /items/:id with payload and returns data", async () => {
    const updatePayload = { name: "Rice (updated)" };
    const updatedItem: TestItem = { id: "2", name: "Rice (updated)" };
    (fakeClient.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: updatedItem,
    });

    const result = await service.update("2", updatePayload);

    expect(fakeClient.put).toHaveBeenCalledWith("/items/2", updatePayload);
    expect(result).toEqual(updatedItem);
  });

  it("remove calls DELETE /items/:id", async () => {
    (fakeClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

    await service.remove("2");

    expect(fakeClient.delete).toHaveBeenCalledWith("/items/2");
  });
});
