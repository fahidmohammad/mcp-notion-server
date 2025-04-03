import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testNotionSearch(query: string) {
  const token = process.env.NOTION_API_TOKEN;
  
  if (!token) {
    console.error('❌ Error: NOTION_API_TOKEN is not set in your environment');
    process.exit(1);
  }

  console.log(`🔍 Searching Notion for: "${query}"...`);
  
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query,
        sort: {
          direction: "descending",
          timestamp: "last_edited_time"
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error: API request failed');
      console.error('Status:', response.status);
      console.error('Error details:', error);
      process.exit(1);
    }

    const data = await response.json();
    console.log('\nSearch Results:');
    console.log('--------------');
    
    if (data.results.length === 0) {
      console.log('No results found.');
      return;
    }

    data.results.forEach((result: any, index: number) => {
      console.log(`\n[Result ${index + 1}]`);
      console.log('Type:', result.object);
      console.log('ID:', result.id);
      
      if (result.object === 'page') {
        // For pages, get the title from properties
        const titleProperty = Object.values(result.properties).find(
          (prop: any) => prop.type === 'title'
        ) as any;
        const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';
        console.log('Title:', title);
      } else if (result.object === 'database') {
        // For databases, title is directly in the object
        const title = result.title?.[0]?.plain_text || 'Untitled Database';
        console.log('Title:', title);
      }
      
      console.log('URL:', result.url);
    });
    
  } catch (error) {
    console.error('❌ Error: Failed to search Notion');
    console.error(error);
    process.exit(1);
  }
}

// Run the test with search query
const searchQuery = process.argv[2] || 'MongoQUI';
testNotionSearch(searchQuery); 