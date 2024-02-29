const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [Object.values(Discord.GatewayIntentBits)]
});
const config = require('./config.js');

const row = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId("ticket")
            .setPlaceholder("Destek konusu seçin")
            .addOptions(config.selectMenu)
)

client.on('ready', async () => {
    console.log("========================")
    console.log("Bot hazır 😎")
    console.log("Sunucu: discord.gg/akparti")
    console.log("Ayran Code Share")
    console.log("========================")

    client.user.setActivity({ name: config.oynuyor, type: "PLAYING" });

    const ticketKanal = client.channels.cache.get(config.ticketKanalID);
    let a = await ticketKanal.messages.fetch({ limit: 50 })
    let b = a.filter(m => m.author.id === client.user.id)

    if (b.size == 0) {
        const embed = new Discord.EmbedBuilder()
            .setTitle("🎫 Ticket Sistemi")
            .setDescription(config.embedDescription)
            .setColor("Blurple")
            .setFooter({ text: `${ticketKanal.guild.name}`, iconURL: `${ticketKanal.guild.iconURL()}` })
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })

        ticketKanal.send({ embeds: [embed], components: [row] })
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        const user = interaction.user; const guild = interaction.guild;

        if (interaction.customId === "ticket") {
            const selected = interaction.values[0];
            const ticketKanalAdi = `ticket-${user.id}`;

            const ticketKanalVarMi = guild.channels.cache.find(c => c.name === ticketKanalAdi);
            interaction.message.edit({ components: [row] });

            const ticketKanalVarMi2 = guild.channels.cache.find(c => c.name === ticketKanalAdi && c.permissionOverwrites.cache.get(user.id));
            if (ticketKanalVarMi && ticketKanalVarMi2) {
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                    .setTitle("🎫 Ticket Hatası")
                    .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                    .setDescription(`Zaten bir ticketin var. <#${ticketKanalVarMi.id}>`)
                    .setColor("Red")

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                let a = await guild.channels.create({
                    name: ticketKanalAdi,
                    type: Discord.ChannelType.GuildText,
                    parent: config.ticketKategoriID,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [Discord.PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: user.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AddReactions, Discord.PermissionFlagsBits.AttachFiles]
                        },
                        {
                            id: config.sorumluRolID,
                            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AddReactions, Discord.PermissionFlagsBits.AttachFiles]
                        }
                    ]
                })

                const embed = new Discord.EmbedBuilder()
                    .setTitle("🎫 Ticket Oluşturuldu")
                    .setDescription(`Ticket oluşturuldu. <#${a.id}>`)
                    .setColor("Green")
                await interaction.reply({ embeds: [embed], ephemeral: true });

                const embed2 = new Discord.EmbedBuilder()
                    .setTitle("🎫 Ticket Kanalına Hoşgeldiniz")
                    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                    .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                    .setDescription(`Ticket oluşturuldu. Yetkililer en kısa sürede size yardımcı olacaktır.`)
                    .addFields(
                        { name: "Destek Konusu", value: selected.charAt(0).toUpperCase() + selected.slice(1), inline: true },
                        { name: "Kullanıcı", value: user.toString(), inline: true }
                    )
                    .setColor("Blurple")
                const rowc = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("ticket-kapat")
                            .setLabel("Ticket Kapat")
                            .setEmoji({ name: "🔒" })
                            .setStyle(Discord.ButtonStyle.Danger)
                    )
                a.send({ embeds: [embed2], components: [rowc], content: `<@&${config.sorumluRolID}> & ${user}` });
            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "ticket-kapat") {
            const channel = interaction.channel;
            const guild = interaction.guild;
            const ticketLog = guild.channels.cache.get(config.ticketLog);
            const sorumluRol = guild.roles.cache.get(config.sorumluRolID);
            const user = interaction.user;

            let lastMessageID = null;
            let content = "";
            while (31) { // 31 DSAWIEWQLŞX
                let messages = await channel.messages.fetch({ limit: 100, before: lastMessageID });
                if (messages.size == 0) break;
                lastMessageID = messages.last().id;
                content += messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp).map(m => `${m.author.tag}: ${m.content}`).join("\n");
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle("🎫 Ticket Kapatıldı")
                .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                .setDescription(`Ticket kapatıldı. <#${channel.id}> 🎫\nKanal 5 saniye sonra silinecek.`)
                .setColor("Red")
            interaction.reply({ embeds: [embed], ephemeral: true });

            const embed2 = new Discord.EmbedBuilder()
                .setTitle("🎫 Ticket Kapatıldı")
                .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                .setFooter({ text: `${guild.name}`, iconURL: `${guild.iconURL()}` })
                .setDescription(`Ticket kapatıldı. ${channel.name} 🎫`)
                .addFields(
                    { name: "Kullanıcı", value: user.toString(), inline: true },
                    { name: "Yetkili", value: sorumluRol.toString(), inline: true }
                )
                .setColor("Red")
            ticketLog.send({ embeds: [embed2], files: [{ name: "transcript.txt", attachment: Buffer.from(content, "utf-8") }] });

            setTimeout(() => {
                channel.delete();
            }, 5000);
        }
    }
});

client.login(config.token);