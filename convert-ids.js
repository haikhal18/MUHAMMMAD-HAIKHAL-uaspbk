// convert-ids.js
import fs from 'fs'; // Import modul Node.js File System

const dbPath = './db.json'; // Path ke file db.json Anda

// Fungsi rekursif untuk mengonversi ID di dalam objek atau array
function convertIdsToStrings(obj) {
    if (Array.isArray(obj)) {
        // Jika ini array, ulangi setiap item dan panggil fungsi ini lagi
        return obj.map(item => convertIdsToStrings(item));
    } else if (typeof obj === 'object' && obj !== null) {
        // Jika ini objek, buat objek baru untuk menghindari modifikasi langsung
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Periksa properti ID yang relevan dan konversi ke string
                if (
                    (key === 'id' || key === 'clientId' || key === 'assignedNinjaId') &&
                    (typeof obj[key] === 'number' || typeof obj[key] === 'string') // Pastikan itu number atau string yang bisa dikonversi
                ) {
                    newObj[key] = String(obj[key]); // Konversi ke string
                } else if (key === 'applicants' && Array.isArray(obj[key])) {
                    // Jika ini array applicants, konversi setiap ID di dalamnya ke string
                    newObj[key] = obj[key].map(id => String(id));
                } else {
                    // Untuk properti lain, panggil fungsi ini secara rekursif (misal untuk objek bersarang)
                    newObj[key] = convertIdsToStrings(obj[key]);
                }
            }
        }
        return newObj;
    } else {
        // Untuk nilai primitif (selain objek/array), kembalikan apa adanya
        return obj;
    }
}

// Bagian utama skrip
try {
    // Baca isi db.json
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Konversi semua ID di data yang dibaca
    const convertedDbData = convertIdsToStrings(dbData);

    // Tulis kembali data yang sudah dikonversi ke db.json (dengan format rapi)
    fs.writeFileSync(dbPath, JSON.stringify(convertedDbData, null, 2), 'utf8');

    console.log('✅ Semua ID di db.json telah berhasil dikonversi ke tipe data string.');
} catch (error) {
    console.error('❌ Gagal mengonversi ID di db.json:', error.message);
    if (error.code === 'ENOENT') {
        console.error('   Pastikan file db.json ada di root proyek Anda.');
    } else if (error instanceof SyntaxError) {
        console.error('   Pastikan db.json adalah file JSON yang valid (tidak ada kesalahan sintaks JSON).');
    }
}