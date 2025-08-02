import prisma from '../services/databaseService';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test user query
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);
    
    // Test match query
    const matchCount = await prisma.match.count();
    console.log(`✅ Match count: ${matchCount}`);
    
    // Test complex query with relations
    const matchesWithPlayers = await prisma.match.findMany({
      include: {
        players: {
          include: {
            user: true
          }
        },
        events: {
          include: {
            player: true
          }
        },
        playerStats: {
          include: {
            user: true
          }
        }
      }
    });
    
    console.log(`✅ Complex query successful: ${matchesWithPlayers.length} matches with relations`);
    
    // Test tournament query
    const tournaments = await prisma.tournament.findMany({
      include: {
        matches: true
      }
    });
    
    console.log(`✅ Tournament query successful: ${tournaments.length} tournaments`);
    
    console.log('🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
} 