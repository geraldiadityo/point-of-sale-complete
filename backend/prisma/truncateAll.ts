import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function truncateAllTables() {
    const modelToTruncate = [
        'role',
        'pegawai',
        'pengguna'
    ];

    for (const item of modelToTruncate){
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${item} RESTART IDENTITY  CASCADE`);
    }

    console.log('All Table was successfully truncate');
    await prisma.$disconnect();
}

truncateAllTables()
    .catch((err) => {
        console.log('Error truncate table: ',err);
    })
    .finally(() => {
        process.exit(0);
    });

    