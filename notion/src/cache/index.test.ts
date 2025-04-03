import { expect, test, describe, vi, beforeEach } from "vitest";
import { NotionCache } from "./index.js";

describe("NotionCache", () => {
  let cache: NotionCache;

  beforeEach(() => {
    // Create a new cache instance for each test
    cache = new NotionCache({ ttl: 1 }); // 1 second TTL for testing
  });

  test("should store and retrieve values", () => {
    const key = "test-key";
    const value = { data: "test-value" };

    cache.set(key, value);
    const retrieved = cache.get(key);

    expect(retrieved).toEqual(value);
  });

  test("should return null for non-existent keys", () => {
    const retrieved = cache.get("non-existent");
    expect(retrieved).toBeNull();
  });

  test("should expire items after TTL", async () => {
    const key = "test-key";
    const value = { data: "test-value" };

    cache.set(key, value);
    
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const retrieved = cache.get(key);
    expect(retrieved).toBeNull();
  });

  test("should respect maxSize limit", () => {
    const maxSize = 2;
    cache = new NotionCache({ ttl: 1, maxSize });

    // Add three items
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // First item should be removed
    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toEqual("value2");
    expect(cache.get("key3")).toEqual("value3");
  });

  test("should delete items", () => {
    const key = "test-key";
    const value = { data: "test-value" };

    cache.set(key, value);
    cache.delete(key);

    const retrieved = cache.get(key);
    expect(retrieved).toBeNull();
  });

  test("should clear all items", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    cache.clear();

    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBeNull();
  });

  test("should return correct size", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    expect(cache.size()).toBe(2);
  });
}); 