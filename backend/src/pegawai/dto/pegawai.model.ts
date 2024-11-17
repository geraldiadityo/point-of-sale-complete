export class PegawaiRequestDTO {
    nik: string;
    nama_lengkap: string;
    alamat: string;
}

export class PegawaiCreateDTO {
    nk: string;
    nik: string;
    nama_lengkap: string;
    alamat: string
}

export class PegawaiResponse {
    id: number;
    nk: string;
    nik: string;
    nama_lengkap: string;
    alamat: string;
}