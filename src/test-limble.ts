// Quick test script to verify Limble API connection
import { testLimbleConnection, getEquipmentList } from './services/limble-service';

async function runTest() {
  console.log('🧪 Testing Limble API Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing connection...');
    const isConnected = await testLimbleConnection();
    console.log(isConnected ? '✅ Connected successfully!' : '❌ Connection failed');
    
    if (isConnected) {
      // Test 2: Fetch equipment
      console.log('\n2️⃣ Fetching equipment list...');
      const equipment = await getEquipmentList();
      console.log(`✅ Retrieved ${equipment.length} equipment items`);
      
      // Show first 3 items as sample
      console.log('\n📋 Sample equipment:');
      equipment.slice(0, 3).forEach((item: any, index: number) => {
        console.log(`${index + 1}. ${item.name} (ID: ${item.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
runTest();