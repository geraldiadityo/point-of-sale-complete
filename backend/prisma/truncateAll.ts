import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function truncateAllTables() {
    const modelToTruncate = [
        'role',
        'pegawai',
        'pengguna',
        'satuan_barang',
        'katori_barang',
        'barang',
        'supplier',
        'stok',
        'transaksi',
        'detail_transaksi',
        'batch_barang',

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

    