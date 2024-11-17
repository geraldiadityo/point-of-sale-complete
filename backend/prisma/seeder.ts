import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('seeder start...');
    await prisma.role.create({
        data: {
            nama_role: 'Admin'
        }
    });

    await prisma.pegawai.create({
        data: {
            nk: 'NK-00001',
            nik: '1572031901960002',
            nama_lengkap: 'Geraldi adityo',
            alamat: 'Simpang tiga rawang'
        }
    });

    await prisma.pengguna.create({
        data: {
            username: 'admin',
            password: bcrypt.hashSync('Ge@140019', 10),
            roleId: 1,
            pegawaiId: 1,
        }
    });

    console.log('seeder success!!');
}

main()
    .catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
