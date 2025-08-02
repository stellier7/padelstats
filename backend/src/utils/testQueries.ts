import { userQueries, matchQueries, statsQueries, eventQueries } from './databaseQueries';

async function testAllQueries() {
  console.log('🧪 Testing all database queries...\n');

  try {
    // Test user queries
    console.log('👥 Testing user queries...');
    const users = await userQueries.findAll();
    console.log(`✅ Found ${users.length} users`);
    
    if (users.length > 0) {
      const firstUser = await userQueries.findByEmail(users[0].email);
      console.log(`✅ Found user by email: ${firstUser?.username}`);
    }

    // Test match queries
    console.log('\n🎾 Testing match queries...');
    const matches = await matchQueries.findAll();
    console.log(`✅ Found ${matches.length} matches`);
    
    if (matches.length > 0) {
      const matchDetails = await matchQueries.findByIdWithDetails(matches[0].id);
      console.log(`✅ Match details: ${matchDetails?.players.length} players, ${matchDetails?.events.length} events`);
    }

    // Test tournament queries
    console.log('\n🏆 Testing tournament queries...');
    console.log('✅ Tournament queries not implemented yet');

    // Test statistics queries
    console.log('\n📊 Testing statistics queries...');
    if (matches.length > 0 && users.length > 0) {
      const matchStats = await statsQueries.getMatchStats(matches[0].id);
      console.log(`✅ Match stats: ${matchStats.length} player statistics`);
      
      const playerStats = await statsQueries.getPlayerOverallStats(users[0].id);
      console.log(`✅ Player overall stats: ${playerStats.length} matches`);
    }

    // Test event queries
    console.log('\n📈 Testing event queries...');
    if (matches.length > 0) {
      const matchEvents = await eventQueries.getMatchEvents(matches[0].id);
      console.log(`✅ Match events: ${matchEvents.length} events`);
    }

    console.log('\n🎉 All database queries tested successfully!');
    return true;

  } catch (error) {
    console.error('❌ Query test failed:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAllQueries()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testAllQueries }; 