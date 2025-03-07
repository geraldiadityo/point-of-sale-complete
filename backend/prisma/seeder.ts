import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
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

    const medicineNames = [
        'Paracetamol',
        'Ibuprofen',
        'Amoxicillin',
        'Cetirizine',
        'Metformin',
        'Omeprazole',
        'Losartan',
        'Simvastatin',
        'Salbutamol',
        'Diclofenac',
        'Amlodipine',
        'Ranitidine',
        'Clopidogrel',
        'Dexamethasone',
        'Hydrochlorothiazide',
      ];

    const getRandomMedicineName = (): string => {
        return faker.helpers.arrayElement(medicineNames)
    }

    const kategori = await prisma.kategori_barang.createMany({
        data: ['Alkes','Injeksi', 'Obat'].map((name) => ({
            nama_kategori: name
        }))
    });

    const satuan = await prisma.satuan_barang.createMany({
        data: ['PCS', 'BOX', 'LAPIK', 'BOTOL'].map((name) => ({
            nama_satuan: name
        }))
    });

    const kategoriList = await prisma.kategori_barang.findMany();
    const satuanList = await prisma.satuan_barang.findMany();

    await prisma.barang.createMany({
        data: Array.from({ length: 20 }, () => {
            const kategori = faker.helpers.arrayElement(kategoriList);
            const satuan = faker.helpers.arrayElement(satuanList);
            const kodeBarang = `${kategori.nama_kategori.substring(0, 3).toUpperCase()}-${faker.string.alphanumeric(4).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`;

            return {
                kode_barang: kodeBarang,
                nama_barang: getRandomMedicineName(),
                satuanId: satuan.id,
                kategoriId: kategori.id
            }
        })
    });

    await prisma.supplier.createMany({
        data: Array.from({ length: 10 }, () => ({
            nama_supplier: faker.company.name(),
            nomor_telp: faker.phone.number(),
            alamat: faker.location.streetAddress(),
        }))
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
