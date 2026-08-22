<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budi = User::where('email', 'admin@gmail.com')->firstOrFail();
        $rina = User::where('email', 'author@gmail.com')->firstOrFail();
        $dewi = User::where('email', 'dewi@gmail.com')->firstOrFail();

        $categoryByName = Category::all()->keyBy('name');

        $posts = [
            [
                'title' => 'Memulai dengan Laravel',
                'category' => 'Technology',
                'user' => $budi,
                'status' => 'published',
                'featured' => true,
                'daysAgo' => 21,
                'content' => <<<'HTML'
                    <p>Laravel menjadi salah satu framework PHP paling populer, dan hal itu bukan tanpa alasan: framework ini menangani bagian-bagian repetitif dalam membangun aplikasi web &mdash; routing, autentikasi, migrasi basis data &mdash; sehingga Anda dapat fokus pada fitur yang benar-benar penting bagi pengguna.</p>
                    <h2>Mengapa Laravel?</h2>
                    <p>Jika Anda pernah menggunakan PHP sebelum era Laravel, Anda tentu tahu betapa banyaknya kode berulang yang dulu diperlukan bahkan untuk aplikasi CRUD sederhana. Eloquent ORM, routing yang ekspresif, dan tooling bawaan (Artisan) memangkas semua itu secara drastis.</p>
                    <ul>
                        <li>Sintaks elegan yang hampir seperti membaca bahasa Inggris biasa</li>
                        <li>Ekosistem yang kaya: Sanctum untuk autentikasi API, Cashier untuk penagihan, Horizon untuk antrean</li>
                        <li>Dokumentasi yang baik dan komunitas yang besar serta aktif</li>
                    </ul>
                    <p>Pada tulisan ini kita membahas cara menyiapkan proyek Laravel baru, menghubungkan koneksi basis data, dan menjalankan migration pertama. Jika Anda berasal dari framework lain, kurva belajarnya cukup landai &mdash; sebagian besar konsepnya mirip dengan yang sudah Anda kenal.</p>
                    HTML,
            ],
            [
                'title' => 'Memahami React Server Components',
                'category' => 'Technology',
                'user' => $dewi,
                'status' => 'published',
                'daysAgo' => 18,
                'content' => <<<'HTML'
                    <p>Server Components mengubah salah satu asumsi dasar yang banyak dipegang sejak awal kemunculan React: bahwa setiap komponen harus mengirim JavaScript ke browser.</p>
                    <p>Dengan Server Components, sebuah komponen dapat dirender sepenuhnya di server dan hanya mengirim hasil HTML-nya ke client &mdash; tanpa hydration, tanpa tambahan ukuran bundle. Ini merupakan perubahan besar untuk halaman yang padat konten seperti blog dan dashboard.</p>
                    <h2>Kapan sebaiknya digunakan?</h2>
                    <p>Server Components cocok untuk komponen pengambil data yang tidak memerlukan interaktivitas: daftar postingan, sidebar kategori, footer. Apa pun yang memiliki <strong>state</strong>, <strong>effect</strong>, atau event handler tetap harus menjadi Client Component.</p>
                    <p>Model mentalnya memerlukan sedikit waktu untuk dipahami, tetapi setelah dipahami, akan terasa sulit untuk kembali mengirim bundle JS berukuran besar untuk halaman yang sebagian besar isinya statis.</p>
                    HTML,
            ],
            [
                'title' => 'Panduan Praktis Generics di TypeScript',
                'category' => 'Technology',
                'user' => $rina,
                'status' => 'published',
                'daysAgo' => 12,
                'content' => <<<'HTML'
                    <p>Generics memiliki reputasi sebagai salah satu fitur TypeScript yang cukup menakutkan, tetapi pada dasarnya generics menyelesaikan masalah yang sangat sederhana: bagaimana caranya menulis fungsi atau tipe yang dapat bekerja dengan lebih dari satu tipe spesifik, tanpa kehilangan keamanan tipe (type safety)?</p>
                    <h2>Contoh sederhana</h2>
                    <p>Daripada menulis fungsi bertipe <code>any</code> dan kehilangan semua manfaat TypeScript, generic memungkinkan pemanggil fungsi "mengisi bagian yang kosong":</p>
                    <p><em>function firstItem&lt;T&gt;(items: T[]): T { return items[0] }</em></p>
                    <p>Sekarang <code>firstItem</code> dapat digunakan untuk array angka, string, atau tipe kustom Anda sendiri &mdash; dan TypeScript tetap mengetahui secara pasti apa yang dikembalikan.</p>
                    <p>Setelah memahami dasarnya, constraint (<code>T extends SomeType</code>) dan default type parameter membuka lebih banyak lagi API yang ekspresif tanpa mengorbankan keamanan tipe.</p>
                    HTML,
            ],
            [
                'title' => 'Mengapa Kami Bermigrasi ke PostgreSQL',
                'category' => 'Technology',
                'user' => $budi,
                'status' => 'draft',
                'daysAgo' => 2,
                'content' => <<<'HTML'
                    <p>Catatan draft: membahas alasan di balik kepindahan dari basis data lama kami &mdash; dukungan JSON yang lebih baik, pencarian teks case-sensitive yang lebih dapat diprediksi, dan free tier yang lebih murah hati pada hosting terkelola.</p>
                    <p>Masih perlu menuliskan langkah migrasi yang sebenarnya dan kendala apa saja yang kami temui sebelum tulisan ini siap dipublikasikan.</p>
                    HTML,
            ],
            [
                'title' => 'Lima Tips Bekerja dari Rumah',
                'category' => 'Business',
                'user' => $budi,
                'status' => 'published',
                'daysAgo' => 15,
                'content' => <<<'HTML'
                    <p>Bekerja jarak jauh terdengar sederhana di atas kertas &mdash; bekerja dari mana saja, kapan saja &mdash; tetapi menjalankannya dengan baik memerlukan beberapa kebiasaan yang disengaja. Berikut lima hal yang paling berpengaruh bagi tim kami.</p>
                    <ul>
                        <li><strong>Memiliki jam mulai dan selesai yang jelas.</strong> Tanpa perjalanan komute sebagai pembatas, pekerjaan mudah merembes ke hal lain.</li>
                        <li><strong>Komunikasikan konteks, bukan hanya status.</strong> Rekan kerja tidak dapat melihat isi kepala Anda &mdash; tuliskan "mengapa"-nya, bukan hanya "apa"-nya.</li>
                        <li><strong>Lindungi beberapa jam untuk deep work.</strong> Matikan notifikasi dan sisihkan waktu untuk tugas yang benar-benar memerlukan fokus.</li>
                        <li><strong>Berinvestasi pada perangkat kerja.</strong> Kursi yang layak dan monitor kedua akan terbayar hanya dalam waktu satu minggu.</li>
                        <li><strong>Selesai tepat waktu.</strong> Istirahat adalah bagian dari bekerja dengan baik, bukan kebalikannya.</li>
                    </ul>
                    HTML,
            ],
            [
                'title' => 'Cara Menentukan Harga Produk SaaS',
                'category' => 'Business',
                'user' => $dewi,
                'status' => 'published',
                'featured' => true,
                'daysAgo' => 9,
                'content' => <<<'HTML'
                    <p>Menentukan harga adalah salah satu keputusan paling berpengaruh yang akan Anda buat untuk produk SaaS, dan juga salah satu yang paling mudah dihindari untuk dipikirkan secara serius.</p>
                    <h2>Mulai dari nilai, bukan biaya</h2>
                    <p>Godaannya adalah menentukan harga berdasarkan biaya operasional ditambah margin. Titik awal yang lebih baik adalah: seberapa berharga hal ini bagi pelanggan? Dua pelanggan dapat memperoleh nilai yang sangat berbeda dari fitur yang sama.</p>
                    <p>Berbicaralah dengan pengguna Anda sebelum berbicara dengan spreadsheet. Tanyakan apa yang akan membuat mereka kecewa jika hilang, dan apa yang rela mereka bayar lebih mahal. Percakapan tersebut biasanya memberi tahu lebih banyak daripada kerangka kerja penetapan harga mana pun.</p>
                    HTML,
            ],
            [
                'title' => 'Membangun Budaya Startup yang Berkelanjutan',
                'category' => 'Business',
                'user' => $rina,
                'status' => 'draft',
                'daysAgo' => 1,
                'content' => <<<'HTML'
                    <p>Draft: menyusun pemikiran mengenai cara menghindari budaya burnout sambil tetap bergerak cepat. Diperlukan contoh dari tim yang telah berhasil melakukan hal ini sebelum dipublikasikan.</p>
                    HTML,
            ],
            [
                'title' => 'Minimalisme dalam Kehidupan Sehari-hari',
                'category' => 'Lifestyle',
                'user' => $dewi,
                'status' => 'published',
                'daysAgo' => 17,
                'content' => <<<'HTML'
                    <p>Minimalisme sering direduksi menjadi dinding putih dan rak kosong di banyak blog desain, tetapi intinya jauh lebih sederhana: memiliki lebih sedikit, sehingga yang dimiliki benar-benar berarti.</p>
                    <p>Hal itu berlaku sama untuk kalender dan kotak masuk Anda seperti halnya lemari pakaian. Lebih sedikit komitmen, yang dipilih dengan lebih sengaja, cenderung menyisakan lebih banyak ruang untuk hal-hal yang benar-benar penting.</p>
                    <p>Mulailah dari yang kecil: pilih satu laci, satu folder, atau satu rapat rutin, lalu tanyakan apakah hal tersebut pantas mendapatkan tempat.</p>
                    HTML,
            ],
            [
                'title' => 'Membangun Rutinitas Pagi yang Lebih Baik',
                'category' => 'Lifestyle',
                'user' => $rina,
                'status' => 'published',
                'daysAgo' => 7,
                'content' => <<<'HTML'
                    <p>Rutinitas pagi yang baik bukan soal bangun pukul 5 pagi atau menyempatkan meditasi selama satu jam &mdash; ini soal memulai hari dengan cara Anda sendiri, bukan bereaksi terhadap notifikasi pertama yang masuk.</p>
                    <h2>Yang benar-benar membantu</h2>
                    <ul>
                        <li>Menentukan tugas pertama hari itu sejak malam sebelumnya</li>
                        <li>Menjauhkan ponsel dari jangkauan selama 20&ndash;30 menit pertama</li>
                        <li>Melakukan satu hal kecil untuk diri sendiri, sebelum apa pun "untuk" pekerjaan</li>
                    </ul>
                    <p>Detailnya tidak sepenting konsistensinya. Kecil dan dapat diulang selalu mengalahkan ambisius namun ditinggalkan pada hari ketiga.</p>
                    HTML,
            ],
            [
                'title' => 'Seni Mengatakan Tidak',
                'category' => 'Lifestyle',
                'user' => $dewi,
                'status' => 'draft',
                'daysAgo' => 3,
                'content' => <<<'HTML'
                    <p>Draft: bagian pembuka ini masih perlu diperkuat. Tesisnya adalah bahwa mengatakan tidak dengan baik merupakan sebuah keterampilan, bukan hanya sifat bawaan &mdash; ingin memasukkan beberapa contoh kalimat konkret yang dapat langsung digunakan.</p>
                    HTML,
            ],
            [
                'title' => 'Liburan Akhir Pekan ke Pegunungan',
                'category' => 'Travel',
                'user' => $rina,
                'status' => 'published',
                'daysAgo' => 14,
                'content' => <<<'HTML'
                    <p>Beberapa perjalanan tidak memerlukan banyak perencanaan untuk terasa berharga. Kami mengemas mobil pada Jumat sore tanpa itinerary pasti selain "menuju tempat yang ada gunungnya", dan berakhir dengan salah satu akhir pekan terbaik tahun ini.</p>
                    <p>Beberapa hal yang membuat perjalanan ini berhasil: berangkat cukup pagi untuk menangkap sisa cahaya matahari di jalur pendakian, membawa camilan lebih banyak dari yang terasa wajar, dan tidak memesan penginapan sampai kami benar-benar tahu seberapa jauh kami ingin berkendara.</p>
                    <p>Terkadang rencana perjalanan terbaik adalah yang tidak terlalu ketat.</p>
                    HTML,
            ],
            [
                'title' => 'Menjelajahi Asia Tenggara dengan Budget Terbatas',
                'category' => 'Travel',
                'user' => $dewi,
                'status' => 'published',
                'daysAgo' => 10,
                'content' => <<<'HTML'
                    <p>Asia Tenggara memiliki reputasi sebagai salah satu kawasan terbaik di dunia untuk perjalanan hemat, dan setelah tiga bulan berpindah di lima negara, reputasi tersebut memang pantas didapatkan &mdash; dengan beberapa catatan.</p>
                    <h2>Yang membuat biaya tetap rendah</h2>
                    <ul>
                        <li>Bepergian lewat darat (bus dan kereta) alih-alih terbang di setiap perhentian</li>
                        <li>Makan di tempat penduduk lokal makan, bukan yang menunya dicetak dalam bahasa Inggris</li>
                        <li>Bepergian lebih perlahan &mdash; lebih sedikit tempat, tinggal lebih lama, lebih sedikit hari transit</li>
                    </ul>
                    <p>Semua ini tidak berarti harus hidup serba kekurangan. Sedikit kesabaran dalam mengurus logistik jauh lebih berpengaruh daripada anggaran yang lebih besar.</p>
                    HTML,
            ],
            [
                'title' => 'Sepuluh Barang Wajib untuk Penerbangan Jarak Jauh',
                'category' => 'Travel',
                'user' => $budi,
                'status' => 'published',
                'daysAgo' => 5,
                'content' => <<<'HTML'
                    <p>Setelah cukup sering melakukan penerbangan jarak jauh, daftar bawaan Anda berhenti menjadi tebakan dan mulai menjadi sebuah sistem. Berikut yang selalu mendapat tempat di dalam tas:</p>
                    <ul>
                        <li>Headphone noise-cancelling &mdash; sepadan dengan investasinya berkali-kali lipat</li>
                        <li>Botol minum isi ulang, diisi setelah melewati pemeriksaan keamanan</li>
                        <li>Kesabaran secukup perut kosong untuk makanan pesawat, ditambah satu camilan sungguhan</li>
                        <li>Bantal leher compression yang tidak memakan sepertiga tas</li>
                        <li>Bacaan yang bukan di layar, untuk saat lepas landas dan mendarat</li>
                    </ul>
                    <p>Tidak ada yang revolusioner di sini, tetapi jika sudah tepat, penerbangan sepuluh jam akan terasa jauh lebih singkat.</p>
                    HTML,
            ],
            [
                'title' => 'Prinsip Tipografi Web Modern',
                'category' => 'Design',
                'user' => $dewi,
                'status' => 'published',
                'featured' => true,
                'daysAgo' => 6,
                'content' => <<<'HTML'
                    <p>Tipografi yang baik tidak terlihat ketika bekerja dengan benar. Pembaca tidak memikirkan line height atau letter spacing &mdash; mereka hanya membaca dengan nyaman, selama yang mereka inginkan.</p>
                    <h2>Beberapa aturan praktis</h2>
                    <ul>
                        <li>Panjang baris sekitar 60&ndash;75 karakter membuat paragraf mudah diikuti</li>
                        <li>Line height (leading) sekitar 1,4&ndash;1,6 kali ukuran font untuk teks isi</li>
                        <li>Batasi diri pada dua typeface, biarkan weight dan ukuran yang mengerjakan sisanya</li>
                    </ul>
                    <p>Ini bukan aturan mutlak &mdash; ini titik awal. Ujian sebenarnya selalu: apakah seseorang dapat membaca ini dengan nyaman selama lima menit tanpa menyadari jenis hurufnya sama sekali?</p>
                    HTML,
            ],
            [
                'title' => 'Teori Warna untuk Developer',
                'category' => 'Design',
                'user' => $rina,
                'status' => 'published',
                'daysAgo' => 0,
                'content' => <<<'HTML'
                    <p>Anda tidak memerlukan gelar desain untuk memilih palet warna yang cocok &mdash; Anda memerlukan proses kecil yang dapat diulang. Berikut yang kami gunakan jika tidak ada desainer di dalam ruangan.</p>
                    <p>Mulailah dengan satu warna aksen yang sesuai dengan kesan yang ingin dicapai. Bangun skala netral (abu-abu, biasanya dengan sedikit rona dari warna aksen) untuk latar belakang, border, dan teks. Simpan warna aksen untuk beberapa hal yang memang harus menarik perhatian: tombol utama, tautan, active state.</p>
                    <p>Konsistensi jauh lebih berpengaruh daripada kecerdikan. Palet dengan tiga warna yang digunakan dengan baik selalu mengalahkan sepuluh warna yang digunakan secara tidak konsisten.</p>
                    HTML,
            ],
        ];

        foreach ($posts as $data) {
            Post::create([
                'title' => $data['title'],
                'content' => $data['content'],
                'status' => $data['status'],
                'is_featured' => $data['featured'] ?? false,
                'category_id' => $categoryByName[$data['category']]->id,
                'user_id' => $data['user']->id,
                'published_at' => $data['status'] === 'published'
                    ? Carbon::now()->subDays($data['daysAgo'])
                    : null,
            ]);
        }
    }
}
