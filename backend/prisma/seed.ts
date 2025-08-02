import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.matchEvent.deleteMany();
  await prisma.matchPlayer.deleteMany();
  await prisma.playerStats.deleteMany();
  await prisma.match.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tournament.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('PadelUser2024!', 10),
        firstName: 'John',
        lastName: 'Doe'
      }
    }),
    prisma.user.create({
      data: {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('PadelUser2024!', 10),
        firstName: 'Jane',
        lastName: 'Smith'
      }
    }),
    prisma.user.create({
      data: {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: await bcrypt.hash('PadelUser2024!', 10),
        firstName: 'Mike',
        lastName: 'Wilson'
      }
    }),
    prisma.user.create({
      data: {
        username: 'sarah_jones',
        email: 'sarah@example.com',
        password: await bcrypt.hash('PadelUser2024!', 10),
        firstName: 'Sarah',
        lastName: 'Jones'
      }
    }),
    prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@padelstats.com',
        password: await bcrypt.hash('PadelAdmin2024!', 10),
        firstName: 'Admin',
        lastName: 'User'
      }
    })
  ]);

  console.log('👥 Created test users');

  // Create a tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Summer Padel Championship 2024',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      status: 'IN_PROGRESS'
    }
  });

  console.log('🏆 Created tournament');

  // Create matches
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        type: 'TOURNAMENT',
        phase: 'CUARTOS',
        status: 'COMPLETED',
        tournamentId: tournament.id
      }
    }),
    prisma.match.create({
      data: {
        type: 'FRIENDLY',
        status: 'IN_PROGRESS'
      }
    }),
    prisma.match.create({
      data: {
        type: 'TOURNAMENT',
        phase: 'SEMIFINAL',
        status: 'IN_PROGRESS',
        tournamentId: tournament.id
      }
    })
  ]);

  console.log('🎾 Created matches');

  // Add players to matches
  const matchPlayers = await Promise.all([
    // Match 1: Tournament match (completed)
    prisma.matchPlayer.create({
      data: {
        matchId: matches[0].id,
        userId: users[0].id,
        team: 1,
        position: 1
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[0].id,
        userId: users[1].id,
        team: 1,
        position: 2
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[0].id,
        userId: users[2].id,
        team: 2,
        position: 1
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[0].id,
        userId: users[3].id,
        team: 2,
        position: 2
      }
    }),

    // Match 2: Friendly match (in progress)
    prisma.matchPlayer.create({
      data: {
        matchId: matches[1].id,
        userId: users[0].id,
        team: 1,
        position: 1
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[1].id,
        userId: users[2].id,
        team: 1,
        position: 2
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[1].id,
        userId: users[1].id,
        team: 2,
        position: 1
      }
    }),
    prisma.matchPlayer.create({
      data: {
        matchId: matches[1].id,
        userId: users[3].id,
        team: 2,
        position: 2
      }
    })
  ]);

  console.log('👤 Added players to matches');

  // Create match events for the completed match
  const events = await Promise.all([
    // John's events (Team 1)
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[0].id,
        eventType: 'FIRST_SERVE_IN',
        observerId: users[4].id // Admin
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[0].id,
        eventType: 'POINT_WON_FIRST_SERVE',
        observerId: users[4].id
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[0].id,
        eventType: 'FIRST_SERVE_OUT',
        observerId: users[4].id
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[0].id,
        eventType: 'SECOND_SERVE_IN',
        observerId: users[4].id
      }
    }),

    // Jane's events (Team 1)
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[1].id,
        eventType: 'UNFORCED_ERROR',
        observerId: users[4].id
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[1].id,
        eventType: 'NET_ERROR',
        observerId: users[4].id
      }
    }),

    // Mike's events (Team 2)
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[2].id,
        eventType: 'POINT_WON_RETURN',
        observerId: users[4].id
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[2].id,
        eventType: 'SMASH_ERROR',
        observerId: users[4].id
      }
    }),

    // Sarah's events (Team 2)
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[3].id,
        eventType: 'FORCED_ERROR',
        observerId: users[4].id
      }
    }),
    prisma.matchEvent.create({
      data: {
        matchId: matches[0].id,
        playerId: users[3].id,
        eventType: 'EXIT_BY_3',
        observerId: users[4].id
      }
    })
  ]);

  console.log('📊 Created match events');

  // Create player statistics for the completed match
  const playerStats = await Promise.all([
    prisma.playerStats.create({
      data: {
        userId: users[0].id,
        matchId: matches[0].id,
        firstServePercentage: 75.0,
        pointsWonFirstServe: 3,
        pointsWonSecondServe: 1,
        unforcedErrors: 0,
        forcedErrors: 0,
        netErrors: 0,
        returnErrors: 0,
        smashErrors: 0,
        lobErrors: 0,
        pointsWonExit34: 0,
        pointsLostExit34: 0,
        pointsWonReturn: 0
      }
    }),
    prisma.playerStats.create({
      data: {
        userId: users[1].id,
        matchId: matches[0].id,
        firstServePercentage: 60.0,
        pointsWonFirstServe: 2,
        pointsWonSecondServe: 0,
        unforcedErrors: 1,
        forcedErrors: 0,
        netErrors: 1,
        returnErrors: 0,
        smashErrors: 0,
        lobErrors: 0,
        pointsWonExit34: 0,
        pointsLostExit34: 0,
        pointsWonReturn: 0
      }
    }),
    prisma.playerStats.create({
      data: {
        userId: users[2].id,
        matchId: matches[0].id,
        firstServePercentage: 80.0,
        pointsWonFirstServe: 4,
        pointsWonSecondServe: 2,
        unforcedErrors: 0,
        forcedErrors: 0,
        netErrors: 0,
        returnErrors: 0,
        smashErrors: 1,
        lobErrors: 0,
        pointsWonExit34: 0,
        pointsLostExit34: 0,
        pointsWonReturn: 1
      }
    }),
    prisma.playerStats.create({
      data: {
        userId: users[3].id,
        matchId: matches[0].id,
        firstServePercentage: 70.0,
        pointsWonFirstServe: 2,
        pointsWonSecondServe: 1,
        unforcedErrors: 0,
        forcedErrors: 1,
        netErrors: 0,
        returnErrors: 0,
        smashErrors: 0,
        lobErrors: 0,
        pointsWonExit34: 0,
        pointsLostExit34: 0,
        pointsWonReturn: 0
      }
    })
  ]);

  console.log('📈 Created player statistics');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Seeded Data Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Tournament: 1`);
  console.log(`- Matches: ${matches.length}`);
  console.log(`- Match Players: ${matchPlayers.length}`);
  console.log(`- Events: ${events.length}`);
  console.log(`- Player Stats: ${playerStats.length}`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@padelstats.com / PadelAdmin2024!');
  console.log('User: john@example.com / PadelUser2024!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 