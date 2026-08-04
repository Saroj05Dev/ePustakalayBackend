/**
 * Migration Script: Clean Up Duplicate Progress Records
 * 
 * This script removes duplicate progress records for the same user+book combination,
 * keeping only the most recent one (by last_read_at).
 * 
 * Run with: node scripts/cleanupDuplicateProgress.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ReadingProgress = require('../src/schemas/Progress');

async function cleanupDuplicateProgress() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB\n');

        // Find all progress records
        const allProgress = await ReadingProgress.find({}).sort({ last_read_at: -1 });
        console.log(`Found ${allProgress.length} total progress records\n`);

        // Group by user + book
        const progressByUserBook = {};
        
        allProgress.forEach(progress => {
            const key = `${progress.user}-${progress.book}`;
            if (!progressByUserBook[key]) {
                progressByUserBook[key] = [];
            }
            progressByUserBook[key].push(progress);
        });

        // Find duplicates and remove them
        let duplicatesFound = 0;
        let recordsDeleted = 0;

        for (const [key, records] of Object.entries(progressByUserBook)) {
            if (records.length > 1) {
                duplicatesFound++;
                const [user, book] = key.split('-');
                
                // Keep the most recent one (first in sorted array)
                const keepRecord = records[0];
                const deleteRecords = records.slice(1);
                
                console.log(`\n📚 User: ${user}, Book: ${book}`);
                console.log(`   Found ${records.length} records (${deleteRecords.length} duplicates)`);
                console.log(`   Keeping: ${keepRecord._id} (${keepRecord.progress}%, last read: ${keepRecord.last_read_at})`);
                
                // Delete the duplicates
                for (const record of deleteRecords) {
                    console.log(`   Deleting: ${record._id} (${record.progress}%, last read: ${record.last_read_at})`);
                    await ReadingProgress.findByIdAndDelete(record._id);
                    recordsDeleted++;
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Cleanup Complete!');
        console.log(`   Total progress records: ${allProgress.length}`);
        console.log(`   User+Book combinations with duplicates: ${duplicatesFound}`);
        console.log(`   Duplicate records deleted: ${recordsDeleted}`);
        console.log(`   Remaining records: ${allProgress.length - recordsDeleted}\n`);

        // Verify no duplicates remain
        const remainingProgress = await ReadingProgress.find({});
        const verifyGroups = {};
        
        remainingProgress.forEach(progress => {
            const key = `${progress.user}-${progress.book}`;
            verifyGroups[key] = (verifyGroups[key] || 0) + 1;
        });

        const stillHasDuplicates = Object.values(verifyGroups).some(count => count > 1);
        
        if (stillHasDuplicates) {
            console.log('⚠️  Warning: Some duplicates still remain!');
        } else {
            console.log('✓ Verification: No duplicates remain. Each user has max 1 progress record per book.\n');
        }

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the cleanup
cleanupDuplicateProgress();
