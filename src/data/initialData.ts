import { 
  CourseSchedule, 
  AssignmentTask, 
  TaskTypeConfig,
  ExpenseItem, 
  DailyHabit, 
  GoalItem, 
  SealedLetter, 
  MilestoneLetter,
  WeeklyQuestion,
  AIPromptTemplate, 
  LoveNoteEntry,
  RomanticAffirmation,
  CampusPortalLink
} from '../types';

export const OFFICIAL_UPI_KRS: CourseSchedule[] = [
  {
    id: "DK306",
    day: "Kamis",
    time: "13:00 - 15:30",
    name: "STRATEGI PEMBELAJARAN",
    sks: 3,
    category: "[Pedagogi]",
    room: "Ruang B-303 FPMIPA B Lt.3",
    lecturer: "Dr. Wawan Wahyu, M.Pd.",
    notes: "Mata kuliah keahlian pedagogi calon pendidik kimia UPI."
  },
  {
    id: "KI151",
    day: "Kamis",
    time: "07:00 - 09:30",
    name: "KIMIA DASAR 1",
    sks: 3,
    category: "[Teori/Lab]",
    room: "Ruang Kuliah FPMIPA (E-406) Gedung JICA FPMIPA A Lt.4",
    lecturer: "Drs. Ali Kusrijadi, M.Si.",
    notes: "Stokiometri, Termokimia, Struktur Atom, dan Ikatan Kimia."
  },
  {
    id: "KI152",
    day: "Senin",
    time: "13:00 - 15:30",
    name: "KIMIA DASAR 2",
    sks: 3,
    category: "[Teori/Lab]",
    room: "Ruang S-302 Gedung JICA FPMIPA A Lt.3",
    lecturer: "Drs. Ali Kusrijadi, M.Si.",
    notes: "Kinetika, Kesetimbangan, Asam-Basa, dan Elektrokimia."
  },
  {
    id: "KI399",
    day: "Selasa",
    time: "07:00 - 08:40",
    name: "MATEMATIKA UNTUK KIMIA",
    sks: 2,
    category: "[Teori]",
    room: "Lab Kimia Dasar & Analitik N-405 Gedung JICA A Lt.4",
    lecturer: "H. Budiman Anwar, S.Si., M.Si.",
    notes: "Kalkulus diferensial, integral, dan matriks aplikasi kimia."
  },
  {
    id: "KU100",
    day: "Rabu",
    time: "16:20 - 18:00",
    name: "PENDIDIKAN AGAMA ISLAM",
    sks: 2,
    category: "[Umum]",
    room: "Ruang S-302 Gedung JICA FPMIPA A Lt.3",
    lecturer: "Achmad Faqihuddin, S.Pd., M.Pd.",
    notes: "Mata Kuliah Umum Universitas."
  },
  {
    id: "KU105",
    day: "Rabu",
    time: "10:20 - 12:00",
    name: "PENDIDIKAN KEWARGANEGARAAN",
    sks: 2,
    category: "[Umum]",
    room: "Ruang B-405 FPMIPA B Lt.4",
    lecturer: "Prof. Dr. Ridwan Effendi, M.Ed.",
    notes: "Mata Kuliah Umum Wajib Nasional."
  },
  {
    id: "KU106",
    day: "Jumat",
    time: "07:00 - 08:40",
    name: "PENDIDIKAN BAHASA INDONESIA",
    sks: 2,
    category: "[Umum]",
    room: "Ruang C-302 FPMIPA C Lt.3",
    lecturer: "Rika Widawati, SS, M.Pd.",
    notes: "Kaidah penulisan karya ilmiah & artikel akademik."
  },
  {
    id: "PT400",
    day: "Selasa",
    time: "09:30 - 12:00",
    name: "KETERAMPILAN BERBAHASA INGGRIS",
    sks: 3,
    category: "[Pedagogi]",
    room: "Ruang S-305 Gedung JICA FPMIPA A Lt.3",
    lecturer: "Miarti Khikmatun Nais, S.Pd., M.Pd.",
    notes: "Academic English presentation & journal reading."
  }
];

export const INITIAL_TASK_TYPES: TaskTypeConfig[] = [
  {
    id: "type-laptrak",
    name: "Laptrak & Jurnal Lab",
    color: "#9f1239",
    bgLight: "#ffe4e6",
    description: "Laporan praktikum kimia, responsi, dan data observasi lab",
    iconName: "FlaskConical"
  },
  {
    id: "type-kuliah",
    name: "Tugas Kuliah & Makalah",
    color: "#0369a1",
    bgLight: "#e0f2fe",
    description: "Makalah, tugas harian, resume jurnal, dan slide presentasi",
    iconName: "BookOpen"
  },
  {
    id: "type-organisasi",
    name: "Organisasi & Kepanitiaan",
    color: "#c2410c",
    bgLight: "#ffedd5",
    description: "Rapat prodi, kepanitiaan HMK FPMIPA, dan kegiatan kampus",
    iconName: "Users"
  },
  {
    id: "type-pribadi",
    name: "Pengingat Pribadi & Kos",
    color: "#047857",
    bgLight: "#d1fae5",
    description: "Laundry kos, beli vitamin, beres-beres kamar, dan self-care",
    iconName: "Sparkles"
  },
  {
    id: "type-kencan",
    name: "Kencan & Janji Berdua",
    color: "#be123c",
    bgLight: "#ffe4e6",
    description: "Rencana jalan-jalan, makan mie ayam bareng Mas, dan nonton film",
    iconName: "Heart"
  },
  {
    id: "type-belanja",
    name: "Kebutuhan Lab & Belanja",
    color: "#4338ca",
    bgLight: "#e0e7ff",
    description: "Fotokopi modul, milimeter blok, kacamata goggle, dan logistik",
    iconName: "ShoppingBag"
  }
];

// Bank of 30 Authentic Messages from Mas Mie Ayam
export const DAILY_SUPPORT_MESSAGES: string[] = [
  "Semangat buat hari ini, Sayang! Mas yakin kamu bisa lewatin semuanya dengan lancar.",
  "Jangan lupa makan, ya. Perutnya diisi dulu biar nggak kelaparan pas nugas.",
  "Kalau lagi pusing, rehat 5 menit dulu ya. Merem sebentar, tarik napas, terus senyum lagi.",
  "Makasih ya, udah selalu berusaha ngasih yang terbaik. Mas bangga banget sama kamu.",
  "Pengingat malam ini: matiin HP-nya, tarik selimut yang hangat, terus mimpi indah, Sayang.",
  "Nanti kalau ada waktu senggang, kita mabar lagi, ya! Mas kangen denger ketawa kamu pas main bareng.",
  "Kamu itu selalu jauh lebih hebat dan lebih kuat dari yang kamu bayangin. Semangat, Sayang!",
  "Hari ini makan mie ayam enak kali, ya? Pokoknya jaga kesehatan terus, Sayang.",
  "Senyum dulu dong hari ini! Biar harimu terasa lebih ringan dan manis.",
  "Nggak apa-apa kalau hari ini rasanya capek. Yang penting, kamu udah berjuang sehebat ini.",
  "Mas di sini bakal selalu dukung kamu, dalam kondisi apa pun dan kapan pun kamu butuh.",
  "Kirim peluk hangat dari jauh, buat Sayangku yang lagi berjuang dan capek nugas.",
  "Udah minum air putih belum hari ini? Ayo minum dulu sekarang, ya!",
  "Inget ya, Sayang, kamu nggak pernah sendirian. Ada Mas yang selalu siap dengerin cerita kamu.",
  "Apa pun hasil dari usaha kamu hari ini, kamu tetap orang paling keren di mata Mas.",
  "Kalau kepala lagi penuh banget sama tugas, istirahat dulu ya. Jangan terlalu dipaksain.",
  "Mas cuma mau bilang: sayang banget sama kamu, hari ini, besok, dan seterusnya.",
  "Makasih ya udah hadir dan bikin hari-hari Mas jadi jauh lebih warna-warni.",
  "Jangan lupa apresiasi diri sendiri hari ini, ya. Kamu udah bertahan sejauh ini, hebat banget!",
  "Nanti malam, kalau nggak bisa tidur atau lagi kepikiran banyak hal, langsung kabarin Mas ya.",
  "Tugas kuliah emang suka bikin emosi, tapi tetap senyum dan tenang ya, Sayangku.",
  "Obrolan sama kamu selalu jadi tempat istirahat paling nyaman buat Mas, di tengah capeknya hari.",
  "Jangan pernah ragu sama kemampuan kamu sendiri, ya. Mas percaya 100% sama kamu.",
  "Semoga hari ini bisa lebih bahagia dari kemarin, ya, Sayang!",
  "Kangen, deh... semoga harimu manis dan menyenangkan ya, Sayangku!",
  "Coba tarik napas pelan-pelan dulu. Dunia nggak bakal runtuh cuma karena kamu rehat sejenak hari ini.",
  "Kamu udah berusaha semaksimal ini, kok. Terus semangat, Sayangku!",
  "Jangan terlalu keras sama diri sendiri, ya. Pelan-pelan aja, yang penting tetap jalan.",
  "Mas selalu bangga sama kamu, di setiap proses kecil yang kamu lewatin.",
  "Tetap semangat hari ini, ya! Nanti kalau semua urusannya udah kelar, kita santai bareng lagi."
];

// 12 Authentic Reasons Why Mas Trusts You
export const REASONS_TO_TRUST: string[] = [
  "Cara kamu selalu jujur dan terbuka sama aku, baik soal hal sekecil apa pun atau yang sebesar apa pun. Aku nggak pernah perlu menebak-nebak isi hati kamu.",
  "Tanggung jawab kamu ke apa pun yang kamu kerjakan itu jarang aku temuin di orang lain. Sekecil apa pun tugasnya, kamu selalu ngerjain dengan sepenuh hati.",
  "Ketulusan kamu memperlakukan orang lain, bahkan di saat-saat kamu sendiri lagi capek, itu salah satu hal yang paling bikin aku yakin sama kamu.",
  "Berapa kali pun capeknya, kamu nggak pernah benar-benar berhenti. Kamu selalu nemuin cara buat bangkit lagi.",
  "Obrolan kita selalu terasa setara, saling dengar, saling hargai. Rasanya aku bisa cerita apa aja tanpa takut dihakimi.",
  "Kamu orang yang benar-benar berusaha menepati apa yang kamu ucapkan. Buat aku, itu bukan hal kecil.",
  "Kamu mau dengerin masukan dariku dengan kepala dingin, bahkan waktu itu nggak enak buat didengar. Nggak semua orang bisa begitu.",
  "Cara kamu terus berproses jadi versi terbaik dari diri kamu sendiri, pelan-pelan tapi nggak pernah berhenti, itu bikin aku kagum tiap kali aku memerhatikan.",
  "Ada di dekat kamu, walau cuma lewat telepon, selalu bikin aku merasa tenang. Rasa aman itu susah aku temuin di tempat lain.",
  "Aku tahu persis seberapa tulus hati kamu. Dan itu alasan terbesar kenapa aku percaya 100% sama kamu, nggak setengah-setengah.",
  "Kamu konsisten sama prinsip dan nilai yang kamu pegang, bahkan waktu nggak ada yang lihat.",
  "Tiap kali ada masalah di antara kita, kamu selalu pilih cari jalan keluar bareng-bareng, bukan saling menyalahkan. Itu bukan hal yang semua orang bisa lakuin."
];

// Authentic Grand Birthday Letter (16 Agustus)
export const BIRTHDAY_LETTER = {
  date: "16 Agustus",
  title: "Surat Ulang Tahun Utama",
  recipient: "Untuk Seseorang yang Selalu Berhasil Mencerahkan Setiap Hariku",
  content: `Untuk Seseorang yang Selalu Berhasil Mencerahkan Setiap Hariku,

Selamat ulang tahun, Sayang!

Di hari yang spesial ini, aku mau berhenti sejenak dari segala keriuhan rutinitasku: dari kodingan yang bikin pusing, tugas kuliah yang menumpuk, dan harian yang padat, khusus untuk merayakan hadirnya kamu di dunia ini. Kamu yang awalnya cuma teman mabar yang nggak sengaja ketemu, perlahan-lahan berubah jadi salah satu sosok paling berarti yang pernah ada di hidupku.

Kalau ada satu hal yang paling aku kagumi dari kamu, itu adalah caramu berjuang. Aku ingat betul gimana kamu terus berproses, belajar tanpa kenal lelah, dan selalu mengusahakan yang terbaik untuk masa depanmu sendiri.

Aku tahu jalan yang kamu lewati nggak selalu mudah. Tapi tahu nggak? Di mataku, setiap proses yang kamu jalani nggak pernah sedikit pun mengurangi seberapa keren dan berharganya kamu. Kamu itu tangguh, Sayang. Cara kamu bangkit, merapikan kembali semangatmu, lalu jalan lagi ke depan. Itu bukti seberapa kuatnya kamu sebenarnya, bahkan di saat kamu sendiri mungkin nggak merasa begitu.

Makasih ya, sudah selalu ada. Buat setiap obrolan santai di sela waktu belajar dan ngerjain tugas, tawa lepas pas mabar walau lagi susah menang, candaan stiker receh kita, sampai sesi saling dengerin keluh kesah. Buat orang lain mungkin itu cuma chat biasa atau sekadar main bareng. Tapi buatku, tiap momen ngobrol sama kamu selalu jadi tempat istirahat paling nyaman, bahkan di tengah hari yang paling melelahkan sekalipun. Entah gimana caranya, kamu selalu berhasil bikin aku tersenyum.

Di usia barumu ini, ada beberapa doa tulus dariku buat kamu.

Semoga tiap langkahmu dimudahkan, dan jalan apa pun yang kamu tempuh nanti membawamu pulang ke kebahagiaan yang selama ini kamu perjuangkan. Semoga kamu selalu sehat dan tenang hatinya. Jangan terlalu keras sama diri sendiri ya, jangan lupa istirahat, makan teratur, dan jaga diri baik-baik, fisik maupun hati. Dan semoga dunia terus kasih kamu alasan buat tersenyum, bahkan di hari-hari yang terasa berat.

Apa pun yang terjadi ke depan, suka maupun duka, senang maupun pusing, ingat ya, kamu nggak pernah sendirian. Aku di sini. Jadi pendukung nomor satumu, teman mabar sekaligus pendengar setia curhatanmu, atau sekadar orang yang siap menghibur waktu kepalamu rasanya mau pecah.

Makasih sudah lahir ke dunia ini, dan jadi sosok yang begitu baik, manis, dan bikin aku pengen jadi versi lebih baik dari diriku sendiri.

Selamat ulang tahun sekali lagi, Sayangku. Semoga tahun ini bawa jutaan alasan baru buat kamu bahagia.

Dengan segala doa dan rasa sayang,
Mas Mie Ayam kamu🤍`
};

// 7 Authentic "Open When..." Letters
export const SEVEN_SEALED_LETTERS: SealedLetter[] = [
  {
    id: "letter-1",
    number: "01",
    title: "Buka Saat Kamu Lagi Kangen Aku",
    subtitle: "Ketika rindu tak tertahan dan jarak terasa begitu jauh",
    openWhen: "Kamu lagi kangen aku",
    icon: "Heart",
    isOpen: false,
    content: `Hai Sayang,

Kalau kamu lagi buka surat ini, berarti kamu lagi kangen aku, ya?

Kebetulan banget, soalnya hampir pasti, di saat yang sama, aku juga lagi kangen kamu. Rasanya pengen langsung spam chat, kirim stiker receh, atau ngajakin mabar bentar, walau sebenarnya cuma pengen dengar suara kamu doang.

Inget ya, sejauh apa pun jaraknya, seribuk apa pun kita masing-masing, kamu selalu ada di tempat paling depan dalam pikiran aku. Kalau kangennya udah nggak tertahan, langsung chat atau telepon aja. Begitu aku senggang, pasti langsung aku bales.

Makasih udah kangenin aku sebanyak ini. Peluk hangat dari jauh, ya.

Dengan kasih,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-2",
    number: "02",
    title: "Buka Saat Kamu Lagi Capek dan Stres Nugas",
    subtitle: "Dosis ketenangan saat tugas dan laptrak menumpuk di kepala",
    openWhen: "Kamu lagi capek & stres nugas",
    icon: "Coffee",
    isOpen: false,
    content: `Halo Sayangku,

Coba tarik napas dulu, dalam-dalam. Tahan sebentar. Terus embusin pelan-pelan.

Aku tahu rasanya waktu tugas dan beban kuliah numpuk semua jadi satu di kepala. Pasti capek banget. Tapi di tengah semua itu, aku cuma mau ingetin satu hal: berhenti sebentar itu boleh. Kamu nggak harus maksain diri terus-terusan, Sayang.

Dunia nggak akan runtuh kalau kamu rehat sebentar. Minum air putih, makan makanan favorit kamu, atau sekadar rebahan lima menit tanpa mikirin apa-apa. Kamu udah berusaha sekeras ini sampai sejauh sini, dan itu udah lebih dari cukup buat bikin aku bangga.

Kalau butuh cerita, aku selalu ada. Kalau cuma butuh ditemenin diam-diam juga nggak apa. Yang penting, jaga diri kamu ya.

Semangat terus, Sayang.
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-3",
    number: "03",
    title: "Buka Saat Kamu Lagi Sedih atau Mau Nangis",
    subtitle: "Tempat aman untuk bersandar dan melepaskan sesak di dada",
    openWhen: "Kamu lagi sedih atau mau nangis",
    icon: "CloudRain",
    isOpen: false,
    content: `Sayang,

Sini dulu, sandarin kepala kamu. Kalau hari ini berat banget dan dadamu rasanya sesak, nangis aja. Nggak apa-apa. Nangis bukan tanda kamu lemah. Itu bukti kamu udah bertahan dan berjuang sekeras ini sampai sekarang.

Aku di sini. Mungkin nggak bisa langsung usap air mata kamu, tapi rasa sayang aku ada, penuh, buat nemenin kamu dari sini. Kamu nggak perlu pura-pura kuat di depan aku. Capek boleh kelihatan, kapan pun kamu butuh.

Nanti kalau udah agak tenang, cerita ya. Aku siap dengerin semuanya, tanpa menghakimi sedikit pun.

Kamu nggak pernah sendirian, Sayang.

Peluk erat dari jauh,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-4",
    number: "04",
    title: "Buka Saat Kamu Lagi Ragu Sama Diri Sendiri",
    subtitle: "Pengingat betapa tangguh dan berharganya dirimu",
    openWhen: "Kamu lagi ragu sama diri sendiri",
    icon: "Sparkles",
    isOpen: false,
    content: `Sayangku yang paling keren,

Coba dengerin Mas baik-baik, ya. Kalau hari ini ada yang bikin kamu berkecil hati atau ragu sama kemampuan sendiri, Mas mau ingetin satu hal: kamu jauh lebih hebat dan lebih kuat dari apa pun yang kamu bayangkan soal diri kamu sendiri.

Coba tengok ke belakang sebentar. Udah banyak banget proses dan tantangan berat yang berhasil kamu lewatin sampai hari ini. Kamu itu tangguh, gigih, dan selalu, selalu punya cara buat bangkit lagi, walau kadang butuh waktu.

Jangan biarin satu momen sulit bikin kamu lupa seberapa berharganya diri kamu. Kalau susah percaya sama diri sendiri hari ini, pinjam dulu aja kepercayaan Mas ke kamu. Soalnya di mata Mas, kamu itu sosok yang luar biasa, titik, tanpa syarat.

Terus jalan ya, Sayang. Mas akan selalu jadi pendukung nomor satu kamu.

Selalu bangga sama kamu,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-5",
    number: "05",
    title: "Buka Saat Kamu Nggak Bisa Tidur",
    subtitle: "Untuk malam-malam di mana pikiran terasa begitu ramai",
    openWhen: "Kamu nggak bisa tidur",
    icon: "Moon",
    isOpen: false,
    content: `Hai Sayang,

Belum bisa merem juga, ya? Pikiran kamu pasti lagi rame banget malam ini.

Coba miringin badan ke posisi paling nyaman. Matiin layar HP setelah baca ini, pejamkan mata pelan-pelan, dan bayangin hal-hal yang bikin tenang. Nggak usah dulu mikirin hal-hal buat besok. Biarin malam ini jadi waktu penuh buat tubuh dan pikiran kamu istirahat.

Bayangin aku lagi di sebelah kamu, ngelus rambut kamu pelan-pelan, bisikin kalau semuanya bakal baik-baik aja.

Semoga tidurnya nyenyak dan mimpinya indah, Sayang. Sampai ketemu besok pagi.

Selamat tidur, Sayangku.
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-6",
    number: "06",
    title: "Buka Saat Kamu Lagi Senang atau Berhasil Meraih Sesuatu",
    subtitle: "Merayakan setiap pencapaian dan kebahagiaanmu",
    openWhen: "Kamu lagi senang atau meraih pencapaian",
    icon: "Trophy",
    isOpen: false,
    content: `HOREEE! Selamat, Sayangku! 🎉

Aku belum tahu detailnya, hal baik apa yang baru aja terjadi atau pencapaian apa yang berhasil kamu raih. Tapi yang jelas, aku ikut seneng banget, sampai rasanya pengen langsung loncat buat rayain ini bareng kamu.

Kamu benar-benar pantas dapetin kebahagiaan ini, setelah semua kerja keras dan usaha yang kamu curahkan. Jangan lupa apresiasi diri kamu sendiri juga, ya. Kamu keren banget, dan itu fakta, bukan basa-basi.

Nanti ceritain detailnya ke aku, aku mau dengerin semua kebahagiaan kamu, sekecil apa pun itu. Nanti kita rayain bareng ya, minimal makan mie ayam favorit kita dulu, walau dari jauh.

Sekali lagi, selamat, Sayang. Aku bangga banget sama kamu.

Dengan penuh rasa bangga,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "letter-7",
    number: "07",
    title: "Buka Saat Kamu Lagi Kesel atau Marah Sama Aku",
    subtitle: "Ruang tulus untuk saling memaafkan dan mendengarkan",
    openWhen: "Kamu lagi kesel atau marah sama Mas",
    icon: "HeartHandshake",
    isOpen: false,
    content: `Hai Sayang,

Pertama-tama, aku mau minta maaf, kalau ada ucapan, sikap, atau hal apa pun dariku yang bikin kamu kesel, kecewa, atau sakit hati. Jujur, nggak pernah ada niat sedikit pun di hati aku buat bikin kamu sedih atau marah.

Kalau kamu masih butuh waktu buat nenangin diri dulu, nggak apa-apa, ambil waktu kamu. Tapi begitu kamu siap, tolong kasih tahu aku, salahnya di mana. Aku mau dengerin dan berusaha lebih baik lagi buat kamu.

Hubungan kita jauh lebih berharga daripada ego aku. Jadi tolong jangan dipendam sendirian, Sayang. Ngobrol sama aku pelan-pelan aja, kapan pun kamu udah siap.

Aku sayang banget sama kamu.

Maaf, Sayang.
Mas Mie Ayam kamu🤍`
  }
];

// 4 Milestone Letters for the Future
export const MILESTONE_LETTERS: MilestoneLetter[] = [
  {
    id: "mile-1",
    title: "Pertama Kali Ketemuan Langsung / Jalan Bareng",
    scenario: "Buka Saat Kita Pertama Kali Ketemuan Langsung / Jalan Bareng 🍦",
    icon: "IceCream",
    isOpen: false,
    content: `Hai Sayang,

Akhirnya, hari yang kita tunggu-tunggu ini sampai juga.

Setelah sekian lama cuma lewat chat, telepon, dan mabar bareng dari layar masing-masing, sekarang kita benar-benar bisa tatap muka. Rasanya campur aduk, Mas seneng, tapi juga deg-degan nggak karuan.

Yang paling utama, Mas bersyukur akhirnya bisa lihat senyum kamu langsung, bukan cuma dari foto. Dengar ketawa kamu tanpa lewat speaker HP. Jalan bareng kamu, beneran, bukan cuma bayangan.

Semoga hari ini jadi salah satu momen yang bakal terus kita ingat, bertahun-tahun dari sekarang. Nikmatin waktunya sepuasnya ya, Sayang. Jarak udah cukup lama menyita banyak momen kayak gini dari kita.

Dengan sayang,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "mile-2",
    title: "Berhasil Melewati Minggu Paling Berat Kamu",
    scenario: "Buka Saat Kamu Berhasil Melewati Minggu Paling Berat Kamu 🌈",
    icon: "Sun",
    isOpen: false,
    content: `Halo Sayangku,

Selamat, ya. Minggu ini rasanya kayak ngambil semua tenaga, pikiran, dan emosi kamu sekaligus. Mas tahu itu.

Tapi coba lihat diri kamu sekarang: kamu berhasil ngelewatinnya. Bukan dengan cara instan, tapi dengan cara kamu sendiri: pelan-pelan, capek, tapi tetap jalan terus. Itu yang bikin Mas selalu yakin dari awal, kamu bakal sanggup.

Sekarang giliran kamu istirahat total. Lepasin semua beban di kepala buat sementara, makan yang enak, tidur yang cukup. Nggak usah dulu mikirin apa-apa. Mas bangga banget, lebih dari yang bisa Mas ungkapin lewat kata-kata.

Dengan penuh rasa bangga,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "mile-3",
    title: "Akhirnya Beli Barang Impian yang Diidamkan",
    scenario: "Buka Saat Kamu Akhirnya Beli Barang yang Udah Lama Kamu Pikirin 🎁",
    icon: "Gift",
    isOpen: false,
    content: `Hai Sayang,

Selamat! Mas ikut seneng banget waktu tahu kamu akhirnya berhasil dapetin barang yang udah lama banget kamu incer.

Mas tahu ini bukan hal yang datang tiba-tiba. Kamu memperjuangkannya pelan-pelan sampai akhirnya kesampaian. Pasti rasanya puas dan lega banget, ya?

Semoga barang ini nemenin hari-harimu, bikin kamu makin semangat, dan tiap kali kamu pakai, jadi pengingat kecil kalau usaha kamu nggak pernah sia-sia.

Nikmatin hadiah buat diri sendiri ini ya, Sayang. Kamu pantas dapetin itu.

Dengan bangga,
Mas Mie Ayam kamu🤍`
  },
  {
    id: "mile-4",
    title: "Menyelesaikan Urusan Penting yang Bikin Pusing",
    scenario: "Buka Saat Kamu Berhasil Menyelesaikan Urusan Penting yang Bikin Pusing 🎯",
    icon: "Target",
    isOpen: false,
    content: `Halo Sayangku,

Plong banget rasanya, kan? Mas tahu urusan ini sempat bikin kamu kepikiran terus, pusing, dan menguras banyak energi belakangan ini.

Tapi lihat sekarang, kamu berhasil menyelesaikannya, dan dengan cara yang baik. Bukan asal selesai, tapi selesai dengan kamu tetap jadi diri kamu yang sabar dan nggak gampang goyah. Kamu selalu punya cara sendiri buat menghadapi tantangan, ya begini ini caranya.

Satu beban di kepala kamu udah berkurang. Sekarang giliran kamu dinginin kepala, rileks sebentar, dan benar-benar nikmatin rasa leganya, Sayang.

Mas selalu bangga sama kamu,
Mas Mie Ayam kamu🤍`
  }
];

// Authentic Entry 1: Our Story
export const OUR_STORY_FIRST_ENTRY = {
  title: "Bagian Awal yang Nggak Pernah Disangka",
  date: "15 Agustus 2026",
  author: "Mas Mie Ayam",
  content: `Kalau dipikir-pikir lagi, lucu juga ya membayangkan gimana awalnya kita bisa sedekat ini. Siapa sangka, dari sekadar teman mabar dan obrolan random yang santai, sekarang kamu jadi orang paling penting di hidup Mas.

Awalnya Mas cuma mikir kita bakal jadi teman mabar biasa, sesekali ngobrol kalau lagi senggang, ya sudah. Tapi entah gimana, obrolan kita makin hari makin nyambung. Dari yang cuma bahas strategi game dan saling kirim stiker receh, pelan-pelan berubah jadi kebiasaan tukar cerita soal hari masing-masing: tugas kuliah yang numpuk, hal-hal kecil yang bikin pusing, sampai hal-hal random yang tiba-tiba bikin ketawa sendiri.

Ada banyak momen sederhana yang diam-diam bikin Mas makin yakin sama kamu. Hari yang paling capek sekalipun rasanya bisa lebih ringan cuma karena dengerin cerita kamu, atau mabar bareng sebentar. Kamu punya cara sendiri bikin suasana jadi tenang, tanpa perlu diusahakan berlebihan. Itu yang bikin beda.

Entry pertama ini Mas tulis khusus buat nyimpen titik awal perjalanan kita. Mas bersyukur banget takdir mempertemukan kita lewat cara yang sesederhana ini, tapi ternyata jadi salah satu hal paling berarti yang pernah terjadi. Makasih ya, Sayang, udah membuka pintu itu dan bikin hari-hari Mas jauh lebih berwarna sejak ada kamu.

Ini baru halaman pertama. Mas nggak sabar nulis lembar-lembar berikutnya bareng kamu. Yang paling seru, kita berdua belum tahu ceritanya bakal jadi seindah apa.`
};

// Weekly Connection Ritual (Menu Obrolan LDR)
export const WEEKLY_QUESTIONS: WeeklyQuestion[] = [
  { id: "q1", question: "Momen apa minggu ini yang paling bikin kamu senyum sendiri?", category: "Kenangan" },
  { id: "q2", question: "Kalau kamu jadi guru kimia SMA besok, eksperimen pertama apa yang mau kamu tunjukin ke murid?", category: "Kimia & Kuliah" },
  { id: "q3", question: "Hal kecil apa yang pengen aku tahu soal harimu, tapi belum sempat kamu ceritain?", category: "Refleksi" },
  { id: "q4", question: "Kalau kita lagi makan mie ayam berdua sekarang, topping apa yang bakal kamu rebut dari mangkok Mas?", category: "Lucu & Ringan" },
  { id: "q5", question: "Di antara semua materi kuliah minggu ini, materi apa yang paling bikin kepala berasap?", category: "Kimia & Kuliah" },
  { id: "q6", question: "Tempat mana di Bandung yang paling pengen kamu kunjungi bareng Mas pertama kali nanti?", category: "Mimpi & Masa Depan" },
  { id: "q7", question: "Lagu apa yang paling sering kamu putar minggu ini pas ngerjain laptrak?", category: "Kenangan" },
  { id: "q8", question: "Apa satu hal yang paling kamu syukuri dari diri kamu sendiri minggu ini?", category: "Refleksi" }
];

export const INITIAL_ROMANTIC_AFFIRMATIONS: RomanticAffirmation[] = [
  {
    id: "aff-1",
    category: "Cinta & Sayang",
    text: "Memilikimu dalam hidupku adalah anugerah terindah. Cinta kita tumbuh semakin kuat di setiap senyuman dan perjuangan yang kita lewati bersama.",
    author: "Mas Mie Ayam",
    isFavorite: true
  },
  {
    id: "aff-2",
    category: "Penyemangat Kuliah",
    text: "Sayangku punya kecerdasan dan hati yang luar biasa. Di setiap lembar tugas dan praktikum di UPI, ingatlah bahwa Mas selalu percaya sepenuhnya pada potensimu.",
    author: "Mas Mie Ayam",
    isFavorite: true
  },
  {
    id: "aff-3",
    category: "Ketenangan Hati",
    text: "Kamu tidak perlu menjadi sempurna untuk dicintai. Kamu apa adanya sudah lebih dari cukup, dan Mas akan selalu menjadi tempatmu pulang paling tenang.",
    author: "Mas Mie Ayam",
    isFavorite: false
  },
  {
    id: "aff-4",
    category: "Masa Depan Bersama",
    text: "Setiap langkah kecil yang kita ambil hari ini adalah fondasi indah untuk masa depan impian kita berdua. Mas bangga melangkah di sampingmu.",
    author: "Mas Mie Ayam",
    isFavorite: true
  },
  {
    id: "aff-5",
    category: "Rasa Syukur",
    text: "Terima kasih sudah menjadi sosok yang begitu penuh kasih, tulus, dan sabar. Bersamamu, hal-hal sederhana berubah jadi kenangan paling berharga.",
    author: "Mas Mie Ayam",
    isFavorite: false
  }
];

export const INITIAL_ASSIGNMENTS: AssignmentTask[] = [
  {
    id: "task-1",
    title: "Laptrak Kimia Dasar 1: Titrasi Asam Basa & Kadar Cuka",
    typeId: "type-laptrak",
    categoryName: "Laptrak & Jurnal Lab",
    course: "KIMIA DASAR 1",
    deadline: "Besok, 23:59",
    priority: "Tinggi",
    isDone: false,
    notes: "Lengkapi data pengamatan titrasi indikator PP dan perhitungan konsentrasi NaOH.",
    subtasks: [
      { id: "sub-1", title: "Tuliskan Bab Dasar Teori & Persamaan Stoikiometri", isDone: true },
      { id: "sub-2", title: "Hitung rata-rata volume titran duplo", isDone: false },
      { id: "sub-3", title: "Selesaikan Pembahasan & Sumber Kesalahan", isDone: false }
    ],
    createdAt: "2026-08-14"
  },
  {
    id: "task-2",
    title: "Makalah Strategi Pembelajaran Kimia Berbasis PjBL",
    typeId: "type-kuliah",
    categoryName: "Tugas Kuliah & Makalah",
    course: "STRATEGI PEMBELAJARAN",
    deadline: "Jumat, 10:00",
    priority: "Sedang",
    isDone: false,
    notes: "Fokus pada sintaks Project-Based Learning untuk topik Ikatan Kimia SMA.",
    subtasks: [
      { id: "sub-4", title: "Cari 3 referensi jurnal SINTA / Scopus", isDone: true },
      { id: "sub-5", title: "Buat sintaks modul ajar diferensiasi", isDone: false }
    ],
    createdAt: "2026-08-13"
  },
  {
    id: "task-3",
    title: "Latihan Soal Matematika Kimia: Persamaan Termodinamika",
    typeId: "type-kuliah",
    categoryName: "Tugas Kuliah & Makalah",
    course: "MATEMATIKA UNTUK KIMIA",
    deadline: "Selasa Depan, 07:00",
    priority: "Sedang",
    isDone: false,
    notes: "Kerjakan Bab 3 halaman 45-48 di buku kerja.",
    createdAt: "2026-08-12"
  },
  {
    id: "task-4",
    title: "Ambil Laundry Kos & Beli Vitamin",
    typeId: "type-pribadi",
    categoryName: "Pengingat Pribadi & Kos",
    deadline: "Hari Ini, 18:00",
    priority: "Santai",
    isDone: true,
    notes: "Jangan lupa ambil nota laundry di dompet.",
    createdAt: "2026-08-15"
  },
  {
    id: "task-5",
    title: "Makan Mie Ayam Bareng Mas Sepulang Kuliah",
    typeId: "type-kencan",
    categoryName: "Kencan & Janji Berdua",
    deadline: "Kamis Sore, 16:30",
    priority: "Tinggi",
    isDone: false,
    notes: "Mas yang jemput di lobi Gedung JICA FPMIPA UPI.",
    createdAt: "2026-08-15"
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    title: "Makan Siang (Kantin FPMIPA UPI)",
    amount: 15000,
    category: "Makan",
    date: "2026-08-15",
    time: "12:30",
    notes: "Nasi, ayam suwir, kangkung, es teh"
  },
  {
    id: "exp-2",
    title: "Kopi Susu Penyemangat Lab",
    amount: 18000,
    category: "Kopi/Nongkrong",
    date: "2026-08-15",
    time: "15:15",
    notes: "Biar gak ngantuk ngetik laptrak"
  },
  {
    id: "exp-3",
    title: "Print Laptrak & Kertas Milimeter Blok",
    amount: 12000,
    category: "Alat Lab/Print",
    date: "2026-08-15",
    time: "08:00",
    notes: "Print warna cover & kertas grafik"
  }
];

export const INITIAL_HABITS: DailyHabit[] = [
  { id: "h1", label: "Minum Air Putih 2 Liter", category: "Kesehatan", iconName: "Droplets", isDone: true },
  { id: "h2", label: "Review Catatan Kuliah 15 Menit", category: "Pikiran", iconName: "BookOpen", isDone: true },
  { id: "h3", label: "Tidur Sebelum Jam 23:00", category: "Istirahat", iconName: "Moon", isDone: false },
  { id: "h4", label: "Catat Pengeluaran Kos Hari Ini", category: "Keuangan", iconName: "Wallet", isDone: true },
  { id: "h5", label: "Ngobrol Santai sama Mas / Teman Kos", category: "Sosial", iconName: "Heart", isDone: true }
];

export const INITIAL_GOALS: GoalItem[] = [
  { id: "g1", title: "Makan mie ayam bareng Mas sepulang praktikum titrasi", isDone: false, category: "Kuliner" },
  { id: "g2", title: "Jalan-jalan sore di Taman Isola UPI", isDone: false, category: "Kencan" },
  { id: "g3", title: "Mabar santai sampai menang bareng Mas", isDone: true, category: "Kencan" },
  { id: "g4", title: "Raih IPK 3.80+ Semester 1 Pendidikan Kimia UPI", isDone: false, category: "Kuliah Bareng" },
  { id: "g5", title: "Wisuda bareng dengan predikat Cumlaude!", isDone: false, category: "Mimpi Bersama" }
];

export const CAMPUS_PORTAL_LINKS: CampusPortalLink[] = [
  {
    id: "spot-upi",
    title: "SPOT UPI (LMS)",
    url: "https://spot.upi.edu",
    category: "Akademik UPI",
    description: "Pengumpulan tugas, materi kuliah dosen, dan diskusi daring UPI.",
    badge: "Utama"
  },
  {
    id: "siakad-upi",
    title: "SIAKAD UPI",
    url: "https://siakad.upi.edu",
    category: "Akademik UPI",
    description: "KRS online, nilai KHS, dan status akademik resmi.",
    badge: "Resmi"
  },
  {
    id: "perpus-upi",
    title: "Perpustakaan Digital UPI",
    url: "https://perpustakaan.upi.edu",
    category: "Perpustakaan",
    description: "Akses jurnal kimia, repository skripsi, dan e-book.",
    badge: "Literatur"
  },
  {
    id: "notebooklm",
    title: "NotebookLM (AI Hub)",
    url: "https://notebooklm.google.com",
    category: "Ruang Kolaborasi",
    description: "Upload PDF jurnal dosen & generate sintesis dasar teori otomatis.",
    badge: "AI Study"
  }
];

export const LAPTRAK_UPI_9_FORMATS = [
  {
    step: 1,
    name: "Cover / Halaman Judul",
    desc: "Judul Praktikum, Nomor Percobaan, Identitas Mahasiswa (Nama, NIM, Kelas/Kelompok), Nama Dosen & Asisten Lab, Pendidikan Kimia FPMIPA UPI.",
    template: `LAPORAN PRAKTIKUM KIMIA DASAR\nPERCOBAAN KE-...\nJUDUL: [JUDUL PERCOBAAN]\n\nDisusun Oleh:\nNama: [Nama Lengkap Sayang]\nNIM: [NIM Mahasiswi UPI]\nKelompok: [Nomor Kelompok]\nProgram Studi: Pendidikan Kimia\n\nDosen Pengampu: [Nama Dosen]\nAsisten Praktikum: [Nama Asisten]\n\nDEPARTEMEN PENDIDIKAN KIMIA\nFAKULTAS PENDIDIKAN MATEMATIKA DAN ILMU PENGETAHUAN ALAM\nUNIVERSITAS PENDIDIKAN INDONESIA\n2026`
  },
  {
    step: 2,
    name: "Tujuan Percobaan",
    desc: "Poin-poin spesifik mengenai pembuktian konsep dan keterampilan instrumen laboratorium.",
    template: `A. TUJUAN PERCOBAAN\n1. Memahami prinsip dasar [topik praktikum].\n2. Menentukan nilai [parameter yang diukur] melalui metode [metode analisis].\n3. Terampil dalam mengoperasikan alat laboratorium [nama alat].`
  },
  {
    step: 3,
    name: "Dasar Teori",
    desc: "Landasan ilmiah, mekanisme reaksi, dan persamaan stoikiometri (dapat digenerate via NotebookLM).",
    template: `B. DASAR TEORI\n[Tuliskan penjelasan komprehensif mengenai konsep teoritis, persamaan reaksi stoikiometri, dan hukum kimia yang mendasari percobaan ini beserta sitasi ilmiah (Nama, Tahun)].`
  },
  {
    step: 4,
    name: "Alat dan Bahan",
    desc: "Daftar alat gelas, spesifikasi ketelitian, dan bahan kimia beserta fasanya.",
    template: `C. ALAT DAN BAHAN\n1. Alat:\n   - Buret 50 mL (1 buah)\n   - Erlenmeyer 250 mL (3 buah)\n   - Pipet Volume 10 mL (1 buah)\n   - Statif & Klem (1 set)\n2. Bahan:\n   - Larutan Standar NaOH 0.1 M\n   - Larutan Asam Cuka Komersial\n   - Indikator Fenolftalein (PP)\n   - Akuades`
  },
  {
    step: 5,
    name: "Prosedur Kerja & Diagram Alir",
    desc: "Langkah kerja kalimat pasif dan diagram alir (flowchart).",
    template: `D. PROSEDUR KERJA\n1. Pembuatan Larutan Standar:\n   - Sebanyak X gram zat ditimbang teliti menggunakan neraca analitik.\n   - Zat dilarutkan ke dalam labu ukur hingga tanda batas kemudian dihomogenkan.\n2. Prosedur Titrasi:\n   - Sampel dimasukkan ke Erlenmeyer, ditambah 3 tetes indikator PP...\n   - Larutan dititrasi hingga terjadi perubahan warna merah muda seulas.`
  },
  {
    step: 6,
    name: "Data Pengamatan",
    desc: "Tabel pencatatan kuantitatif dan kualitatif sebelum dan setelah reaksi.",
    template: `E. DATA PENGAMATAN\n| No | Perlakuan / Percobaan | Sebelum | Setelah | Catatan Khusus |\n|---|---|---|---|---|\n| 1 | Titrasi Duplo 1 | Bening tak berwarna | Merah muda seulas | V_NaOH = ... mL |\n| 2 | Titrasi Duplo 2 | Bening tak berwarna | Merah muda seulas | V_NaOH = ... mL |`
  },
  {
    step: 7,
    name: "Pengolahan Data & Pembahasan",
    desc: "Perhitungan matematis stoikiometri, galat relatif, dan interpretasi fenomena ilmiah.",
    template: `F. PENGOLAHAN DATA DAN PEMBAHASAN\n1. Perhitungan:\n   M1 x V1 = M2 x V2\n   [Tuliskan kalkulasi lengkap beserta satuan].\n\n2. Pembahasan Analitis:\n   [Bahas fenomena yang teramati, bandingkan dengan literatur, evaluasi faktor galat praktikum].`
  },
  {
    step: 8,
    name: "Kesimpulan",
    desc: "Jawaban tegas dan ringkas yang menjawab tujuan percobaan.",
    template: `G. KESIMPULAN\nBerdasarkan praktikum yang telah dilakukan, dapat disimpulkan bahwa:\n1. Konsentrasi larutan sampel terukur sebesar [X] M.\n2. Titik akhir titrasi ditandai oleh perubahan warna indikator PP menjadi merah muda konstan.`
  },
  {
    step: 9,
    name: "Daftar Pustaka",
    desc: "Rujukan buku teks dan jurnal ilmiah standar APA Style.",
    template: `H. DAFTAR PUSTAKA\nChang, R., & Goldsby, K. A. (2016). Chemistry (12th ed.). McGraw-Hill Education.\nTim Dosen Kimia Dasar FPMIPA UPI. (2026). Panduan Praktikum Kimia Dasar. UPI.`
  }
];

export const CHEMISTRY_AI_PROMPTS: AIPromptTemplate[] = [
  {
    id: "p1",
    title: "1. Sintesis Dasar Teori Laptrak",
    category: "Laptrak & Lab",
    description: "Ekstrak konsep kimia utama, persamaan reaksi, dan definisi penting untuk dasar teori laptrak.",
    promptText: `Ekstrak konsep kimia utama, persamaan reaksi yang terlibat, dan definisi penting dari dokumen PDF ini untuk disusun menjadi Dasar Teori laporan praktikum kimia yang sistematis dan akademis.`
  },
  {
    id: "p2",
    title: "2. Analogi Mengajar Konsep Kimia",
    category: "Pendidikan Kimia",
    description: "Jelaskan konsep kimia abstrak dengan analogi kehidupan sehari-hari untuk siswa SMA.",
    promptText: `Jelaskan materi [nama konsep, contoh: Ikatan Kovalen / Kesetimbangan Dinamis] dari materi ini menggunakan 2 analogi kehidupan sehari-hari yang sederhana dan menarik agar mudah dipahami oleh siswa SMA.`
  },
  {
    id: "p3",
    title: "3. Rangkuman Keselamatan Bahan (MSDS)",
    category: "Laptrak & Lab",
    description: "Daftarkan sifat fisik, bahaya utama GHS, dan cara penanganan bahan kimia laboratorium.",
    promptText: `Daftarkan semua bahan kimia yang disebutkan dalam dokumen ini beserta sifat fisik, bahaya utama (GHS), dan cara penanganan amannya di laboratorium kimia FPMIPA UPI.`
  },
  {
    id: "p4",
    title: "4. Pembikin Latihan Soal HOTS Kimia",
    category: "Pedagogi & RPP",
    description: "Buatkan 5 soal pilihan ganda tingkat HOTS beserta kunci jawaban dan pembahasan langkah demi langkah.",
    promptText: `Buatkan 5 butir soal pilihan ganda tingkat HOTS (Higher Order Thinking Skills) beserta kunci jawaban dan penjelasan langkah demi langkah berdasarkan isi materi kimia ini.`
  },
  {
    id: "p5",
    title: "5. Flashcard Generator untuk Active Recall",
    category: "Pendidikan Kimia",
    description: "Ubah konsep kunci menjadi 10 pasangan flashcard tanya-jawab singkat.",
    promptText: `Ubah konsep-konsep kunci dari dokumen ini menjadi 10 pasangan flashcard tanya-jawab singkat untuk latihan active recall sebelum kuis atau responsi lab.`
  },
  {
    id: "p6",
    title: "6. Penyederhana Jurnal Bahasa Inggris",
    category: "Studi Literatur",
    description: "Terjemahkan dan sederhanakan poin utama jurnal kimia ke bahasa Indonesia yang mudah dipahami.",
    promptText: `Terjemahkan dan sederhanakan poin-poin utama jurnal bahasa Inggris ini ke Bahasa Indonesia yang mudah dipahami mahasiswa semester awal, tanpa menghilangkan istilah kimia pentingnya.`
  },
  {
    id: "p7",
    title: "7. Persiapan Pre-Test Praktikum",
    category: "Laptrak & Lab",
    description: "Rangkuman poin yang sering ditanyakan saat pre-test praktikum lab kimia.",
    promptText: `Buatkan ringkasan poin-poin penting yang biasanya ditanyakan saat pre-test praktikum berdasarkan prosedur di dokumen ini, termasuk fungsi alat gelas, reagen, dan keselamatan kerja.`
  }
];

export const GHS_SAFETY_DATA = [
  {
    code: 'GHS01',
    symbol: '💥 Mudah Meledak (Explosive)',
    risk: 'Zat padat/cair tidak stabil yang dapat meledak oleh panas, gesekan, atau benturan mendadak.',
    examples: 'Pikrat, Nitrogliserin, TNT, Logam Natrium (Na) terkena air dalam wadah tertutup, Logam Kalium (K)',
    action: 'Hindari gesekan, benturan, dan sumber panas. Simpan dalam minyak parafin/minyak tanah di lemari khusus tahan ledakan.'
  },
  {
    code: 'GHS02',
    symbol: '🔥 Mudah Terbakar (Flammable)',
    risk: 'Zat cair/gas mudah menguap & menyala pada suhu ruangan atau terkena percikan api/panas.',
    examples: 'Etanol, Aseton, Dietil Eter, Metanol, Heksana, Kloroform, Gas LPG/Butana',
    action: 'Jauhkan dari nyala api bunsen langsung, simpan di lemari asam atau wadah tahan api.'
  },
  {
    code: 'GHS03',
    symbol: '⚡ Pengoksidasi (Oxidizing)',
    risk: 'Menghasilkan oksigen melimpah yang memicu atau mempercepat kebakaran hebat bahan organik.',
    examples: 'KMnO4 padat, H2O2 pekat (>30%), KClO3, Asam Nitrat HNO3 pekat, Perklorat',
    action: 'Simpan terpisah dari pelarut organik atau bahan yang mudah terbakar, hindari gesekan mekanis.'
  },
  {
    code: 'GHS04',
    symbol: '🛢️ Gas Bertekanan (Gas Under Pressure)',
    risk: 'Gas dalam tabung bertekanan tinggi yang dapat meledak jika dipanaskan atau bocor secara tiba-tiba.',
    examples: 'Tabung Gas N2, Gas Ar, Tabung CO2, Oksigen murni, Asetilen untuk AAS',
    action: 'Rantai tabung gas ke dinding/dudukan kokoh, jauhkan dari paparan sinar matahari langsung dan sumber panas.'
  },
  {
    code: 'GHS05',
    symbol: '⚠️ Korosif (Corrosive)',
    risk: 'Dapat merusak jaringan kulit seketika, menyebabkan luka bakar kimia parah & merusak logam.',
    examples: 'HCl pekat (12 M), H2SO4 pekat (18 M), HNO3 pekat, NaOH padat/pekat, KOH, Asam Asetat Glasial',
    action: 'Wajib kenakan jas lab kancing penuh, sarung tangan nitril & goggle. Jika terkena kulit, bilas air mengalir minimal 15 menit.'
  },
  {
    code: 'GHS06',
    symbol: '☠️ Toksik / Beracun Akut (Acute Toxicity)',
    risk: 'Dapat menyebabkan keracunan fatal atau kematian mendadak meski terpapar dalam jumlah sangat kecil via inhalasi/kontak.',
    examples: 'Garam Timbal Pb(NO3)2, Merkuri HgCl2, Kalium Sianida KCN, Formalin pekat, Arsen Trioksida As2O3',
    action: 'Wajib bekerja di lemari asam (fume hood), dilarang menghirup uap langsung atau menyentuh tanpa sarung tangan khusus.'
  },
  {
    code: 'GHS07',
    symbol: '❗ Iritasi & Bahaya Toksik Ringan (Harmful / Irritant)',
    risk: 'Dapat menyebabkan iritasi saluran pernapasan, mata merah, pusing, alergi kulit, atau narkotik ringan.',
    examples: 'Isopropanol, Kalsium Klorida CaCl2, Indikator Fenolftalein (PP), Na2CO3, Natrium Benzoat',
    action: 'Gunakan masker dan sarung tangan standar, hindari kontak langsung dengan kulit dan mata, gunakan ventilasi lab yang baik.'
  },
  {
    code: 'GHS08',
    symbol: '🧬 Bahaya Kesehatan Kronis / Karsinogenik (Health Hazard)',
    risk: 'Dapat memicu mutasi genetik, kanker (karsinogen), toksisitas reproduksi, atau kerusakan organ jangka panjang.',
    examples: 'Benzena, Asbes, Formaldehida, Diklorometana (DCM), Fenol murni, Etidium Bromida',
    action: 'Gunakan respirator khusus, sarung tangan nitril tebal, dan bekerjalah selalu di lemari asam bertutup mika kaca.'
  },
  {
    code: 'GHS09',
    symbol: '🌱 Berbahaya bagi Lingkungan Akuatik (Environmental Hazard)',
    risk: 'Bersifat racun jangka panjang bagi ekosistem perairan dan organisme air.',
    examples: 'Tembaga(II) Sulfat CuSO4, Limbah fenol, Kromat CrO4(2-), Logam berat Timbal & Merkuri',
    action: 'Dilarang keras membuang limbah ke wastafel! Buang ke jerigen limbah B3 khusus di pojok lab FPMIPA UPI.'
  }
];

export const UPI_SURVIVAL_NOTES = [
  {
    id: "sn-1",
    title: "Fotokopi & Print Laptrak Kilat",
    category: "Perlengkapan Kuliah",
    content: "Tersedia print warna cepat, jilid mika laptrak, dan kertas milimeter blok. Datang sebelum jam 07:00 pagi saat hari praktikum agar tidak antre panjang.",
    location: "Gerlong Hilir & Ledeng dekat Kampus UPI"
  },
  {
    id: "sn-2",
    title: "Poliklinik Pratama UPI & Obat Darurat",
    category: "Kesehatan",
    content: "Sedia pertolongan pertama, obat pusing/maag, dan penanganan luka bakar ringan lab. Gratis untuk mahasiswa UPI dengan menunjukkan KTM.",
    location: "Gedung Poliklinik UPI"
  },
  {
    id: "sn-3",
    title: "Spot Belajar Wifi Eduroam Terkencang",
    category: "Tempat Belajar",
    content: "Perpustakaan Pusat UPI Lantai 2 dan Lobi Timur FPMIPA memiliki colokan melimpah, AC sejuk, dan koneksi stabil untuk download jurnal ilmiah.",
    location: "Perpustakaan Pusat & FPMIPA UPI"
  },
  {
    id: "sn-4",
    title: "Tips Komunikasi dengan Dosen & Asisten Lab",
    category: "Etika Akademik",
    content: "Kirim pesan WA di jam kerja (08:00 - 16:30), awali salam sopan, sebutkan Nama + NIM + Kelas Pendidikan Kimia '26, dan sampaikan keperluan secara ringkas.",
    location: "Etika WhatsApp UPI"
  },
  {
    id: "sn-5",
    title: "Warung Makan Sehat & Hemat Anak Kos",
    category: "Kuliner & Kos",
    content: "Kantin FPMIPA dan Warung Nasi Gerlong menyajikan aneka sayur segar, lauk tahu tempe telur bergizi dengan harga terjangkau (Rp 12.000 - Rp 18.000).",
    location: "Kantin FPMIPA & Sekitar Gerlong"
  },
  {
    id: "sn-6",
    title: "Peminjaman Alat Gelas Laboratorium",
    category: "Laboratorium Kimia",
    content: "Periksa keutuhan buret dan labu ukur sebelum praktikum dimulai. Catat di bon alat dan laporkan jika ada retak agar tidak terkena denda ganti alat di akhir semester.",
    location: "Laboratorium Kimia Dasar Gedung JICA FPMIPA"
  }
];

export const CHEMISTRY_TEACHING_IDEAS = [
  {
    id: "ti-1",
    title: "Demonstrasi Reaksi Redoks Bunglon (Permanganat)",
    topic: "Reaksi Redoks & Perubahan Warna",
    level: "Kelas X / XI SMA",
    description: "Perubahan warna dramatis dari ungu (MnO4-) menjadi hijau (MnO4 2-) lalu kuning/oranye (MnO2) menggunakan larutan gula pasir dan soda api.",
    materials: "KMnO4 (PK), Gula pasir, NaOH/Soda api, Air hangat, Pengaduk kaca."
  },
  {
    id: "ti-2",
    title: "Indikator Asam-Basa Alami Ekstrak Kol Ungu",
    topic: "Asam-Basa & Derajat Keasaman (pH)",
    level: "Kelas XI SMA",
    description: "Antosianin dalam kol ungu berubah menjadi merah cerah di lingkungan asam (cuka/lemon) dan hijau-kuning di lingkungan basa (sabun/detergen).",
    materials: "Ekstrak kol ungu, Cuka dapur, Air sabun, Air kapur, Tabung reaksi."
  },
  {
    id: "ti-3",
    title: "Model Molekul 3D Plastisin & Tusuk Gigi",
    topic: "Bentuk Molekul & Teori VSEPR",
    level: "Kelas X SMA",
    description: "Membuat model tetrahedral (CH4), trigonal bipiramida (PCl5), dan oktahedral (SF6) untuk visualisasi sudut ikatan secara langsung.",
    materials: "Plastisin warna-warni, Tusuk gigi atau sedotan plastik, Busur derajat."
  },
  {
    id: "ti-4",
    title: "Lava Lamp Sederhana Uji Massa Jenis & Gas CO2",
    topic: "Massa Jenis & Reaksi Pembentukan Gas",
    level: "Kelas X SMA",
    description: "Reaksi tablet effervescent (CDR/Redoxon) dalam campuran minyak dan air berwarna menghasilkan gelembung gas CO2 yang bergerak estetik.",
    materials: "Gelas ukur/botol bening, Minyak goreng, Air + pewarna makanan, Tablet effervescent."
  },
  {
    id: "ti-5",
    title: "Kromatografi Kertas Spidol Warna-Warni",
    topic: "Pemisahan Campuran & Kepolaran",
    level: "Kelas X SMA",
    description: "Pemisahan pigmen tinta spidol hitam/cokelat menjadi berbagai komponen warna berdasarkan perbedaan afinitas terhadap fase diam (kertas) dan fase gerak (air).",
    materials: "Kertas saring/filter kopi, Spidol aneka warna, Gelas kimia, Pelarut air/alkohol."
  }
];

export const SURVIVAL_NOTES_UPI = [
  {
    category: "Tempat Fotokopi & Print Laptrak",
    location: "Daerah Gerlong & Ledeng dekat UPI",
    notes: "Tersedia print warna kilat, jilid mika laptrak, dan kertas milimeter blok. Datang sebelum jam 07:00 pagi saat hari praktikum biar nggak antre panjang."
  },
  {
    category: "Apotek & Klinik 24 Jam",
    location: "Klinik Pratama Poliklinik UPI / Apotek Gerlong",
    notes: "Sedia paracetamol, obat maag, vitamin C, dan plester luka bakar ringan lab. Hubungi 118/119 jika butuh ambulans darurat."
  },
  {
    category: "Spot Belajar Tenang",
    location: "Perpustakaan Pusat UPI Lt. 2 & Lobi Timur FPMIPA",
    notes: "Wi-Fi Eduroam kencang, banyak colokan charger, dan suasana kondusif untuk ngetik laptrak atau diskusi kelompok."
  },
  {
    category: "Warung Makan Hemat Kos",
    location: "Kantin Kejujuran FPMIPA & Warung Nasi Gerlong Hilir",
    notes: "Pilihan sayur lengkap, lauk bergizi, dan harga ramah kantong anak kos (Rp 12.000 - Rp 18.000 per porsi)."
  }
];

export const DEFAULT_MAS_PHONE = '6283849708166';
export const DEFAULT_MAS_PHONE_DISPLAY = '0838-4970-8166';

export const INITIAL_LAPTRAK_TEMPLATES: import('../types').LaptrakTemplate[] = [
  {
    id: "tpl-upi-standard",
    title: "Format 9 Bab Standar UPI (Kimia Dasar & Umum)",
    subtitle: "Format baku sesuai pedoman Departemen Pendidikan Kimia FPMIPA UPI",
    tag: "Standar UPI",
    sections: LAPTRAK_UPI_9_FORMATS
  },
  {
    id: "tpl-organik",
    title: "Template Kimia Organik (Sintesis & Mekanisme Reaksi)",
    subtitle: "Format khusus sintesis organik, isolasi bahan alam, refluks & titik leleh",
    tag: "Organik",
    sections: [
      {
        step: 1,
        name: "Cover & Skema Reaksi Sintesis",
        desc: "Judul percobaan sintesis, persamaan reaksi umum, struktur molekul reaktan dan produk.",
        template: `LAPORAN PRAKTIKUM KIMIA ORGANIK\nPERCOBAAN: SINTESIS SENYAWA ORGANIK\n\nPersamaan Reaksi:\nReaktan A + Reaktan B --(Katalis/Panas)--> Produk C + Produk Samping\n\nDisusun Oleh:\nNama / NIM: [Nama Mahasiswi / NIM]\nKelas / Kelompok: Pendidikan Kimia '26 / Kelompok [X]`
      },
      {
        step: 2,
        name: "Tujuan Percobaan",
        desc: "Poin pemahaman reaksi substitusi/adisi/eliminasi dan teknik isolasi zat.",
        template: `1. Mempelajari mekanisme reaksi [jenis reaksi: e.g. Esterifikasi Fischer/Substitusi Nukleofilik].\n2. Melakukan sintesis senyawa [nama produk] melalui metode refluks.\n3. Menentukan persen rendemen (% yield) dan uji kemurnian dengan titik leleh/kromatografi.`
      },
      {
        step: 3,
        name: "Mekanisme Reaksi & Dasar Teori",
        desc: "Langkah penyerangan nukleofil/elektrofil, resonansi intermediet, dan kinetika reaksi.",
        template: `Mekanisme Reaksi Tahap demi Tahap:\n1. Protonasi gugus karbonil oleh katalis asam kuat.\n2. Serangan nukleofilik oleh pasangan elektron bebas alkohol.\n3. Transfer proton dan eliminasi molekul air membentuk kation stabil.\n4. Deprotonasi menghasilkan ester murni.`
      },
      {
        step: 4,
        name: "Tabel Sifat Fisika, Toksisitas & MSDS",
        desc: "Mr, titik didih/leleh, densitas, dan simbol bahaya GHS bahan yang digunakan.",
        template: `| Nama Bahan | Mr (g/mol) | Titik Didih (°C) | Densitas (g/mL) | Bahaya GHS & K3 |\n|---|---|---|---|---|\n| Asam Salisilat | 138.12 | 211 (sublim) | 1.44 | Korosif, Iritan |\n| Metanol | 32.04 | 64.7 | 0.792 | Mudah Terbakar, Toksik |\n| H2SO4 Pekat | 98.08 | 337 | 1.84 | Sangat Korosif, Eksoterm |`
      },
      {
        step: 5,
        name: "Rangkaian Alat & Prosedur Kerja",
        desc: "Deskripsi perakitan kondensor refluks/distilasi dan tahapan sintesis.",
        template: `Rangkaian Alat: Labu alas bulat, pendingin Liebig/Allihn, selang air masuk-keluar, penangas air/minyak.\n\nProsedur Kerja:\n1. Sebanyak X gram reaktan dimasukkan ke dalam labu alas bulat.\n2. Ditambahkan katalis asam tetes demi tetes sambil digoyang perlahan di lemari asam.\n3. Campuran direfluks selama 60 menit pada suhu penangas 80-90°C.`
      },
      {
        step: 6,
        name: "Data Hasil & Perhitungan Rendemen (% Yield)",
        desc: "Massa teoritis, massa hasil kristal/cairan, dan kalkulasi persen perolehan.",
        template: `Perhitungan Rendemen:\n- Mol Pereaksi Pembatas = massa / Mr = ... mol\n- Massa Teoritis Produk = mol pembatas x Mr produk = ... gram\n- Massa Produk Percobaan = ... gram\n\n% Rendemen = (Massa Percobaan / Massa Teoritis) x 100% = ... %`
      },
      {
        step: 7,
        name: "Pembahasan & Analisis Spektra / Uji Karakterisasi",
        desc: "Interpretasi perubahan warna, bau khas ester, uji titik leleh, atau spektrum IR.",
        template: `Pembahasan Analitis:\n- Reaksi ditandai munculnya aroma wangi khas ester [nama ester].\n- Rendemen yang diperoleh sebesar ...% dipengaruhi oleh kesetimbangan reaksi dan efisiensi kristalisasi.\n- Uji titik leleh menunjukkan rentang leleh ...°C yang sesuai dengan pustaka (kemurnian tinggi).`
      },
      {
        step: 8,
        name: "Kesimpulan",
        desc: "Konfirmasi keberhasilan sintesis dan persen perolehan rendemen.",
        template: `1. Senyawa [nama produk] berhasil disintesis melalui reaksi refluks selama 60 menit.\n2. Diperoleh rendemen produk sebesar ...% dengan titik leleh ...°C.`
      },
      {
        step: 9,
        name: "Daftar Pustaka",
        desc: "Buku rujukan kimia organik standar (Fessenden, Wade, Vogel).",
        template: `Fessenden, R. J., & Fessenden, J. S. (2010). Dasar-Dasar Kimia Organik. Erlangga.\nVogel, A. I. (1989). Vogel's Textbook of Practical Organic Chemistry (5th ed.). Longman.`
      }
    ]
  },
  {
    id: "tpl-fisik",
    title: "Template Kimia Fisik & Termokimia (Grafik & Error Analysis)",
    subtitle: "Format untuk praktikum kalorimetri, laju reaksi, kesetimbangan & termodinamika",
    tag: "Kimia Fisik",
    sections: [
      {
        step: 1,
        name: "Cover & Identitas Praktikum",
        desc: "Judul modul kimia fisik, kelompok, tanggal pengukuran suhu/waktu.",
        template: `LAPORAN PRAKTIKUM KIMIA FISIK\nMODUL: PENENTUAN ENTALPI REAKSI NETRALISASI (KALORIMETRI)\n\nDisusun Oleh: Kelompok [X] Pendidikan Kimia '26`
      },
      {
        step: 2,
        name: "Tujuan Percobaan",
        desc: "Penentuan tetapan kalorimeter, kapasitas kalor, dan entalpi reaksi (ΔH).",
        template: `1. Menentukan tetapan kalorimeter (W / C_kalorimeter).\n2. Menentukan perubahan entalpi reaksi netralisasi asam kuat-basa kuat (ΔH_netralisasi).\n3. Mengevaluasi hukum kekekalan energi kalor (Q_lepas = Q_terima).`
      },
      {
        step: 3,
        name: "Dasar Teori & Penurunan Persamaan",
        desc: "Rumus q = m.c.ΔT, q_reaksi = -(q_larutan + q_kalorimeter), dan persamaan termokimia.",
        template: `Persamaan Dasar Termokimia:\nQ_lepas = Q_terima\nQ_reaksi = -(m_campuran . c_larutan . ΔT + C_kalorimeter . ΔT)\nΔH_reaksi = Q_reaksi / mol_terbatas (kJ/mol)`
      },
      {
        step: 4,
        name: "Alat, Kalibrasi & Bahan",
        desc: "Kalorimeter bom/sederhana, termometer digital ketelitian 0.1°C, larutan HCl & NaOH.",
        template: `Alat: Kalorimeter termos, termometer digital, stopwatch, gelas ukur 50 mL.\nBahan: HCl 1.0 M, NaOH 1.0 M, akuades dingin & panas.`
      },
      {
        step: 5,
        name: "Data Primer Pengukuran Suhu vs Waktu",
        desc: "Tabel pencatatan suhu setiap selang waktu 15 detik hingga suhu konstan.",
        template: `| Waktu (detik) | Suhu Air Dingin (°C) | Suhu Air Panas (°C) | Suhu Campuran (°C) |\n|---|---|---|---|\n| 0 | 26.0 | 50.0 | - |\n| 15 | 26.0 | 49.5 | 37.2 |\n| 30 | 26.0 | 49.0 | 37.0 |\n| 60 | 26.0 | 48.5 | 36.8 |`
      },
      {
        step: 6,
        name: "Pengolahan Data Grafik & Regresi Linier",
        desc: "Grafik ekstrapolasi suhu terhadap waktu (T vs t) dan kalkulasi ΔH.",
        template: `Ekstrapolasi Grafik Suhu:\n- T_awal larutan rata-rata = ... °C\n- T_akhir hasil ekstrapolasi = ... °C\n- ΔT = T_akhir - T_awal = ... °C\n- Q_larutan = (100 g) x (4.184 J/g.°C) x ΔT = ... J\n- ΔH Netralisasi = ... kJ/mol`
      },
      {
        step: 7,
        name: "Pembahasan & Analisis Galat (Error Analysis)",
        desc: "Perbandingan dengan literatur (-57.3 kJ/mol), perhitungan % Galat relatif dan sumber kebocoran kalor.",
        template: `Analisis Galat:\n% Galat Relatif = |(ΔH_percobaan - ΔH_literatur) / ΔH_literatur| x 100% = ... %\n\nSumber Kesalahan Praktikum:\n1. Kebocoran kalor ke lingkungan melalui tutup kalorimeter yang kurang rapat.\n2. Keterlambatan pencatatan termometer saat pencampuran larutan.`
      },
      {
        step: 8,
        name: "Kesimpulan",
        desc: "Nilai tetapan kalorimeter dan entalpi reaksi netralisasi terukur.",
        template: `1. Tetapan kalorimeter terukur sebesar ... J/°C.\n2. Nilai entalpi netralisasi HCl + NaOH adalah sebesar ... kJ/mol dengan galat relatif ...%.`
      },
      {
        step: 9,
        name: "Daftar Pustaka",
        desc: "Atkins Physical Chemistry, Castellan, dan Buku Ajar Kimia Fisik UPI.",
        template: `Atkins, P., & de Paula, J. (2014). Physical Chemistry (10th ed.). Oxford University Press.`
      }
    ]
  },
  {
    id: "tpl-analitik",
    title: "Template Kimia Analitik & Titrimetri",
    subtitle: "Format untuk titrasi asam-basa, permanganometri, iodometri & gravimetri",
    tag: "Kimia Analitik",
    sections: [
      {
        step: 1,
        name: "Cover & Metode Analisis",
        desc: "Judul modul analisis kuantitatif, nama larutan baku primer & sekunder.",
        template: `LAPORAN PRAKTIKUM KIMIA ANALITIK KUANTITATIF\nMODUL: STANDARDISASI LARUTAN NAOH DAN PENENTUAN ASAM CUKA PASARAN\n\nDisusun Oleh: Kelompok [X] Pendidikan Kimia '26`
      },
      {
        step: 2,
        name: "Tujuan Percobaan",
        desc: "Standardisasi larutan baku sekunder dan penentuan kadar analit (% b/b).",
        template: `1. Melakukan pembuatan dan standardisasi larutan baku sekunder NaOH dengan baku primer Asam Oksalat (H2C2O4.2H2O).\n2. Menentukan konsentrasi eksak larutan NaOH (N / M).\n3. Menghitung persentase kadar asam asetat (CH3COOH) dalam sampel cuka pasaran.`
      },
      {
        step: 3,
        name: "Prinsip Dasar & Persamaan Reaksi",
        desc: "Reaksi netralisasi stoikiometri 1:1 atau 1:2 dan pemilihan indikator pH yang tepat.",
        template: `Persamaan Reaksi Standardisasi:\nH2C2O4 + 2NaOH --> Na2C2O4 + 2H2O\n(1 mol asam oksalat bereaksi dengan 2 mol NaOH)\n\nReaksi Titrasi Sampel:\nCH3COOH + NaOH --> CH3COONa + H2O`
      },
      {
        step: 4,
        name: "Alat Gelas Ketelitian & Bahan",
        desc: "Buret kelas A, labu takar 100 mL, pipet sevolume, indikator PP.",
        template: `Alat: Buret 50 mL, Labu Takar 100 mL, Pipet Volume 10 mL & 25 mL, Erlenmeyer 250 mL (3 buah).\nBahan: H2C2O4.2H2O murni p.a., NaOH padat, Asam Cuka Komersial, Indikator Fenolftalein (PP).`
      },
      {
        step: 5,
        name: "Tabel Data Titrasi Simplo, Duplo, Triplo",
        desc: "Volume titran awal, akhir, dan volume terpakai dengan standar deviasi.",
        template: `| Pengulangan | Vol. Sampel (mL) | Vol. Awal Buret (mL) | Vol. Akhir Buret (mL) | Vol. Titran NaOH (mL) |\n|---|---|---|---|---|\n| Titrasi 1 (Simplo) | 10.00 | 0.00 | 12.45 | 12.45 |\n| Titrasi 2 (Duplo) | 10.00 | 12.45 | 24.95 | 12.50 |\n| Titrasi 3 (Triplo) | 10.00 | 24.95 | 37.40 | 12.45 |\n| Rata-rata | 10.00 | - | - | 12.47 ± 0.03 mL |`
      },
      {
        step: 6,
        name: "Perhitungan Kadar Analit (%) & Normalitas",
        desc: "Rumus N1.V1 = N2.V2, faktor pengenceran, dan konversi ke persen kadar (% b/v).",
        template: `1. Normalitas NaOH Eksak:\nN_NaOH = (massa H2C2O4 x 2 x 1000) / (Mr x V_NaOH rata-rata) = ... N\n\n2. Kadar Asam Asetat dalam Sampel:\nMassa CH3COOH = (V_NaOH x N_NaOH x BE_CH3COOH x Faktor Pengenceran) / 1000\n% Kadar (% b/v) = (Massa CH3COOH / Volume Sampel Awal) x 100% = ... %`
      },
      {
        step: 7,
        name: "Pembahasan & Evaluasi Titik Akhir",
        desc: "Kesesuaian trayek pH indikator PP (8.3 - 10.0) dengan titik ekivalen garam basa konjugasi.",
        template: `Pembahasan Analitis:\n- Titik akhir titrasi ditandai oleh perubahan warna dari tidak berwarna menjadi merah muda seulas yang tahan selama 30 detik.\n- Nilai ketelitian (presisi) titrasi triplo sangat baik dengan deviasi standar < 0.05 mL.\n- Kadar asam asetat terukur sebesar ...% yang memenuhi standar label kemasan SNI.`
      },
      {
        step: 8,
        name: "Kesimpulan",
        desc: "Hasil konsentrasi larutan standar dan kadar analit sampel.",
        template: `1. Konsentrasi terstandarisasi larutan NaOH adalah ... ± 0.0005 N.\n2. Kadar asam asetat dalam sampel cuka terukur sebesar ...% (b/v).`
      },
      {
        step: 9,
        name: "Daftar Pustaka",
        desc: "Skoog Fundamentals of Analytical Chemistry, Day & Underwood.",
        template: `Skoog, D. A., West, D. M., & Holler, F. J. (2014). Fundamentals of Analytical Chemistry (9th ed.). Brooks/Cole.\nUnderwood, A. L., & Day, R. A. (2002). Analisis Kimia Kuantitatif. Erlangga.`
      }
    ]
  }
];

export const INITIAL_WELLNESS_LOGS: import('../types').WellnessLogItem[] = [
  {
    id: "well-1",
    date: "2026-08-15",
    time: "07:30",
    category: "Vitamin & Obat",
    title: "Minum Vitamin C & B-Complex",
    notes: "Penting sebelum masuk lab kimia FPMIPA agar daya tahan tubuh selalu fit!",
    status: "Selesai"
  },
  {
    id: "well-2",
    date: "2026-08-15",
    time: "14:00",
    category: "Fisik & Energi",
    title: "Stretching Leher & Punggung",
    notes: "Lakukan peregangan 5 menit setelah mengetik data percobaan di laptop.",
    status: "Selesai"
  },
  {
    id: "well-3",
    date: "2026-08-15",
    time: "19:00",
    category: "Catatan Mas",
    title: "Pesan Mas: Istirahat Cukup & Jangan Begadang",
    notes: "Kalau laptrak udah beres dicicil, tidur sebelum jam 23:00 ya Sayang ❤️",
    status: "Baik"
  }
];

export const INITIAL_LOVE_NOTES: LoveNoteEntry[] = [
  {
    id: "note-1",
    date: "15 Agustus 2026",
    title: "Bagian Awal yang Nggak Pernah Disangka",
    content: OUR_STORY_FIRST_ENTRY.content,
    author: "Mas",
    moodTag: "Manis"
  },
  {
    id: "note-2",
    date: "14 Agustus 2026",
    title: "Semangat Praktikum Titrasi & Laptrak UPI",
    content: "Mas selalu bangga melihat ketekunan Sayang di lab Kimia UPI. Semoga setiap tetes titrasi dan baris rumus di laptrak membawamu semakin dekat ke mimpi menjadi pendidik kimia hebat!",
    author: "Mas",
    moodTag: "Penyemangat"
  }
];

