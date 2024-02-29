module.exports = {
    token: "token",
    ticketKanalID: "",// ticket oluştur mesajının atılacağı kanal
    oynuyor: "🎉 Ayran Code Share 🎉", // oynuyor kısmı
    sorumluRolID: "id", // tickete erişebilecek rol
    ticketKategoriID: "id", // ticketların oluşturulacağı kategori
    ticketLog: "id", // ticket bilgilerinin log kanalı
    embedDescription: `Ticket oluşturmak için aşağıdaki menüden bir seçenek seçin.
## Uyarı
- Lütfen ticket oluşturduktan sonra yetkililere etiket atmayınız.
`, // ticket oluştur mesajının içeriği

    selectMenu: [
        { label: "Genel Destek", emoji: "🔧", value: "genel", description: "Genel destek talepleri için bu seçeneği kullanabilirsiniz." },
        { label: "Öneri", emoji: "📢", value: "öneri", description: "Herhangi bir öneriniz varsa, bize ulaşın ve paylaşın!" },
        { label: "Şikayet", emoji: "🔨", value: "şikayet", description: "Herhangi bir şikayetiniz varsa, lütfen bize bildirin. Memnuniyetiniz önemlidir." },
        // daha fazle ekleyebilirsiniz valueler aynı olmasın sadece
        // label ve value zorunludur diğerleri opsiyoneldir
    ]
}