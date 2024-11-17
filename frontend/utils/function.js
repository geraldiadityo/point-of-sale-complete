/**
 * Fungsi untuk memndingkan nilai a dan b.
 *
 * @param {number} a - Angka pertama.
 * @param {number} b - Angka kedua.
 * @param {string} - method -> asc, desc, none.
 *
 * @returns {number} - 1, 0, -1
 *
 * @example
 * const hasil = compareAandB(2, 3, 'asc');
 * console.log(hasil); // Output: -1
 */
export const compareAandB = (a, b, method) => {
    if (typeof a === "number") {
      if (method === "desc") return b - a;
      else return a - b;
    } else if (typeof a === "string") {
      const nameA = a.toUpperCase();
      const nameB = b.toUpperCase();
      if (method === "desc") {
        if (nameB < nameA) return -1;
        else if (nameB > nameA) return 1;
        else return 0;
      } else {
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
      }
    } else {
      return 0;
    }
  };
  
  /**
   * Generate array pagination based on lastPage and page
   * @param {number} page
   * @param {number} lastPage
   * @returns {Array}
   * @example
   * const arr = paginationArray(5, 56);
   * console.log(arr); //Output: ['prev', 1, '...',4, 5, 6, '...', 56, 'next']
   */
  export const paginationArray = (page, lastPage) => {
    let arr = [];
  
    if (page > 1) {
      arr.push("prev");
    }
  
    if (lastPage < 8) {
      for (let i = 1; i <= lastPage; i++) {
        arr.push(i);
      }
    } else {
      for (let i = 1; i < 7; i++) {
        if (page < 5) {
          if (i < 6) arr.push(i);
          else if (i != lastPage) arr.push("...");
        } else if (page > 4 && page + 4 <= lastPage) {
          if (i == 1) {
            arr.push(i);
          } else if (i == 2) {
            arr.push("...");
          } else if (i == 3) {
            arr.push(page - 1);
          } else if (i == 4) {
            arr.push(page);
          } else if (i == 5) {
            arr.push(page + 1);
          } else {
            arr.push("...");
          }
        } else {
          if (i == 1) {
            arr.push(i);
          } else if (i == 2) {
            arr.push("...");
          } else if (i == 3) {
            arr.push(lastPage - 4);
          } else if (i == 4) {
            arr.push(lastPage - 3);
          } else if (i == 5) {
            arr.push(lastPage - 2);
          } else {
            arr.push(lastPage - 1);
          }
        }
      }
      arr.push(lastPage);
    }
  
    if (page < lastPage) {
      arr.push("next");
    }
  
    return arr;
  };
  
  /**
   * Sanitize Pagination Value
   * @param {any} val - Value pagination: String -> 'prev', 'next', int -> any number
   * @param {number} page - Current page number.
   * @returns {number} Number after casting
   * @example
   * const menuPage = sanitizePagination('next', 2);
   * console.log(menuPage);
   * //Output: 3
   */
  export const sanitizePagination = (val, page) => {
    if (val === "next") return page + 1;
    else if (val === "prev") return page - 1;
    return val;
  };
  
  /**
   * Fungsi untuk mengambil nilai kadaluarsa
   */
  export const getLamaExpired = (expiredDateString, lastDate = Date.now()) => {
    const expiredDate = new Date(expiredDateString);
  
    const selisihDate = lastDate - expiredDate;
  
    const selisihHari = selisihDate / (1000 * 60 * 60 * 24);
  
    return Math.floor(selisihHari);
  };
  
  /**
   * Fungsi untuk mengambil nilai tanggal dari display tanggal
   * @todo
   *
   */
  export const getDateFromDisplayDate = (displayDate) => {};
  
  /**
   * Progress Simpan Data
   * @param {number} index - current index
   * @param {number} total - total data
   * @return {number} result in percentage
   * @example
   * const progress = getPercentage(1, 100)
   * console.log(progress);
   * //output 1
   */
  export const getPercentage = (index, total) => {
    const result = (index / total) * 100;
    return result.toFixed(2);
  };
  
  /**
   * Mengambil nilai from dan to untuk metadata table
   * @param {number} currentPage - Halaman Saat Ini
   * @param {number} pageSize - Ukuran Row Per halaman
   * @param {number} totalItem - Total Keseluruhan Row
   * @return {Array} [from, to] in number
   * @example
   * const [from, to] = useFromTo(1, 25, 160);
   * console.log(from, to);
   * //output 0 24
   */
  export const useFromTo = (currentPage, pageSize, totalItem) => {
    let from = 0;
    let to = 0;
  
    if (totalItem === 0) {
      from -= 1;
    }
  
    if (currentPage > 1) {
      from = (currentPage - 1) * pageSize;
    }
  
    if (totalItem < pageSize) {
      to = totalItem - 1;
    } else {
      if (from + pageSize > totalItem) {
        to = totalItem - 1;
      } else {
        to = from + pageSize - 1;
      }
    }
  
    return [from, to];
  };
  
  /**
   * Format Display Tanggal from Date
   * @param {string} date - tanggal format umum ex: "2023-10-19T00:00:00.000Z"
   * @return {string} result "1 Jan 2023"
   * @example
   * const tanggal = tanggalDisplay("2023-10-19T00:00:00.000Z");
   * console.log(tanggal);
   * //output "19 Okt 2023"
   */
  export const tanggalDisplay = (date, options) => {
    let tanggal = new Date(date);
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    if (options?.fullMonth) {
      monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
    }
  
    let day = tanggal.getDate();
    let month = monthNames[tanggal.getMonth()];
    let year = tanggal.getFullYear();
  
    const formatedDate = day + " " + month + " " + year;
  
    return formatedDate;
  };
  
  /**
   * Format Display Jam from Date
   * @param {string} date - tanggal format umum ex: "2023-10-19T00:00:00.000Z"
   * @param {object} options - {fullMonth: true} untuk menampilkan bulan penuh Jan menjadi Januari
   * @return {string} result "07:30"
   * @example
   * const jam = jamDisplay("2023-10-19T00:00:00.000Z");
   * console.log(tanggal);
   * //output "00:00"
   */
  export function jamDisplay(inputTanggal) {
    // Tanggal dan waktu awal
  
    // Buat objek Date dari string tanggal dan waktu
    var dateTime = new Date(inputTanggal);
  
    // Ambil jam dan menit dari objek Date
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
  
    // Format jam dan menit dalam bentuk string
    var formattedTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0");
  
    // Tampilkan hasilnya
    return formattedTime; // Output: 14:56
  }
  
  /**
   * Date Objek from jamDisplay
   * @param {string} jamDispay - jamDisplay dengan format: "07:00"
   * @return {date} result "date objek"
   * @example
   * const jam = jamToDateObjek("07:00");
   * console.log(jam);
   * //output "date objek"
   */
  export function jamToDateObjek(timeString) {
    // Split string menjadi array [jam, menit]
    var timeArray = timeString.split(":");
  
    // Buat objek Date dengan tanggal default dan menggunakan jam dan menit dari array
    var dateObject = new Date();
    dateObject.setHours(parseInt(timeArray[0], 10));
    dateObject.setMinutes(parseInt(timeArray[1], 10));
  
    // Tampilkan hasilnya
    return dateObject;
  }
  
  /**
   * Format Display Tanggal from Date
   * @param {string} inputTanggal - tanggal format umum ex: "2023-10-19T00:00:00.000Z"
   * @return {string} result "Minggu, 26 November 2023 pukul 20.57.15 WIB"
   * @example
   * const tanggal = tanggalDisplayLengkap("2023-10-19T00:00:00.000Z");
   * console.log(tanggal);
   * //output "Minggu, 26 November 2023 pukul 20.57.15 WIB"
   */
  export function tanggalDisplayLengkap(inputTanggal) {
    const options = {
      weekday: "long", // Nama hari
      day: "numeric", // Tanggal
      month: "long", // Nama bulan
      year: "numeric", // Tahun
      hour: "numeric", // Jam
      minute: "numeric", // Menit
      second: "numeric", // Detik
      timeZoneName: "short", // Nama zona waktu
    };
  
    const tanggal = new Date(inputTanggal);
    const formattedTanggal = tanggal.toLocaleDateString("id-ID", options);
  
    return formattedTanggal;
  }
  
  /**
   * Format Display Uang from number
   * @param {number} value - nilai uang integer atau number
   * @return {string} result "Rp. 20.000.000,00"
   * @example
   * const total_bayar = uangDisplay(10000000);
   * console.log(total_bayar);
   * //output "Rp 10.000.000,00"
   */
  export const uangDisplay = (value) => {
    // return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return new Intl.NumberFormat("id-ID").format(value);
  };
  
  /**
   * Format Display Jenis Kelamin from character symbol
   * @param {string} value - gender symbol (l / p);
   * @return {string} result "Laki-laki" or "Perempuan"
   * @example
   * const jenisKelamin = jenisKelaminDisplay("l");
   * console.log(jenisKelamin);
   * //output "Laki-laki"
   */
  export const jenisKelaminDisplay = (jk) => {
    if (jk === "p") {
      return "Perempuan";
    } else {
      return "Laki-laki";
    }
  };
  
  /**
   * Format Display umur from tanggal lahir
   * @param {string} tanggal_lahir "2023-11-12T17:00:00.000Z"
   * @return {string} result "2thn 9bln 9hr"
   * @example
   * const umur = getUmur("2023-11-12T17:00:00.000Z");
   * console.log(umur);
   * //output "2thn 9bln 9hr"
   */
  export const getUmur = (tanggal_lahir, options) => {
    const calc = _calculateAge(tanggal_lahir);
  
    // Return the age in years, months, and days
    if (options?.yearOnly) {
      return calc.years + " Tahun";
    }
    return calc.years + "thn " + calc.months + "bln " + calc.days + "hr";
  };
  
  function _calculateAge(birthdateString) {
    const birthdate = new Date(birthdateString);
    const currentDate = new Date();
  
    // Hitung perbedaan tahun, bulan, dan hari
    const yearDiff = currentDate.getFullYear() - birthdate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthdate.getMonth();
    const dayDiff = currentDate.getDate() - birthdate.getDate();
  
    // Jika tanggal lahir belum terjadi pada tahun ini
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return {
        years: yearDiff - 1,
        months: 12 + monthDiff,
        days:
          dayDiff +
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
          ).getDate(),
      };
    } else {
      return {
        years: yearDiff,
        months: monthDiff,
        days: dayDiff,
      };
    }
  }
  
  /**
   * Format Display status kunjungan pasien
   * @param {number} status "0 - 2"
   * @return {string} result "0: Dibatalkan, 1: Belum diteriima, 2:Diterima"
   * @example
   * const status = getStatusKunjunganPasien(2);
   * console.log(status);
   * //output: "Diterima"
   */
  export const getStatusKunjunganPasien = (status) => {
    let statusStr = "";
    switch (status) {
      case 0:
        statusStr = "Dibatalkan";
        break;
      case 1:
        statusStr = "Diterima / pasien sudah di ruangan";
        break;
      case 2:
        statusStr = "Diterima";
        break;
      default:
        statusStr = "Belum diterima";
    }
  
    return statusStr;
  };
  
  /**
   * Format Angka Terbilang
   * @param {number} value "0 - 1000000000"
   * @return {string} terbilang "0: Dibatalkan, 1: Belum diteriima, 2:Diterima"
   * @example
   * const terbilang = terbilang(123456789);
   * console.log(hasil); // Output: seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan
   */
  export function terbilang(value) {
    const teksAngka = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
      "sepuluh",
      "sebelas",
    ];
  
    if (value < 12) {
      return teksAngka[value];
    } else if (value < 20) {
      return terbilang(value % 10) + " belas";
    } else if (value < 100) {
      const satuan =
        terbilang(value % 10) !== "" ? " " + terbilang(value % 10) : "";
      return terbilang(Math.floor(value / 10)) + " puluh" + satuan;
    } else if (value < 200) {
      const puluhan =
        terbilang(value % 100) !== "" ? " " + terbilang(value % 100) : "";
      return "seratus" + puluhan;
    } else if (value < 1000) {
      const ratusan =
        terbilang(value % 100) !== "" ? " " + terbilang(value % 100) : "";
      return terbilang(Math.floor(value / 100)) + " ratus" + ratusan;
    } else if (value < 2000) {
      const ratusan =
        terbilang(value % 1000) !== "" ? " " + terbilang(value % 1000) : "";
      return "seribu" + ratusan;
    } else if (value < 1000000) {
      const ratusan =
        terbilang(value % 1000) !== "" ? " " + terbilang(value % 1000) : "";
      return terbilang(Math.floor(value / 1000)) + " ribu" + ratusan;
    } else if (value < 1000000000) {
      const ratusan =
        terbilang(value % 1000000) !== "" ? " " + terbilang(value % 1000000) : "";
      return terbilang(Math.floor(value / 1000000)) + " juta" + ratusan;
    } else if (value < 2147483647) {
      const ratusan =
        terbilang(value % 1000000000) !== ""
          ? " " + terbilang(value % 1000000000)
          : "";
      return terbilang(Math.floor(value / 1000000000)) + " miliar" + ratusan;
    }
  
    return "";
  }
  
  /**
   * Format Tanggal Tahun Bulan Tanggal
   * @param {Date} tanggal "Date"
   * @return {string} "2024-01-19"
   * @example
   */
  export function tanggalAngka(tanggal) {
    const tahun = tanggal.getFullYear();
    const bulan = (tanggal.getMonth() + 1).toString().padStart(2, "0"); // Perlu ditambah 1 karena indeks bulan dimulai dari 0
    const tanggalHari = tanggal.getDate().toString().padStart(2, "0");
  
    const formatTanggal = `${tahun}-${bulan}-${tanggalHari}`;
    return formatTanggal;
  }
  