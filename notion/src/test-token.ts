import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testNotionToken() {
  const token = process.env.NOTION_API_TOKEN;
  
  if (!token) {
    console.error('❌ Error: NOTION_API_TOKEN is not set in your environment');
    process.exit(1);
  }

  console.log('🔍 Testing Notion API token...');
  
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error: API request failed');
      console.error('Status:', response.status);
      console.error('Error details:', error);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Success! Token is valid');
    console.log('\nBot User Details:');
    console.log('-----------------');
    console.log('Name:', data.name);
    console.log('ID:', data.id);
    console.log('Type:', data.type);
    console.log('Avatar URL:', data.avatar_url || 'None');
    console.log('Email:', data.email || 'None');
    
  } catch (error) {
    console.error('❌ Error: Failed to connect to Notion API');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testNotionToken(); 