import { expect, test, describe } from "vitest";
import { NotionClientWrapper } from "./index.js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

describe("Notion API Connection", () => {
  test("should successfully connect to Notion API", async () => {
    // Get the API token from environment
    const notionToken = process.env.NOTION_API_TOKEN;
    
    if (!notionToken) {
      throw new Error("NOTION_API_TOKEN environment variable is not set");
    }

    // Create client instance
    const client = new NotionClientWrapper(notionToken);

    try {
      // Try to retrieve the bot user
      const response = await client.retrieveBotUser();
      
      // Verify the response
      expect(response).toBeDefined();
      expect(response.object).toBe("user");
      expect(response.type).toBe("bot");
      expect(response.id).toBeDefined();
      
      console.log("Connection successful!");
      console.log("Bot User ID:", response.id);
      console.log("Bot Name:", response.name);
      
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  });
}); 