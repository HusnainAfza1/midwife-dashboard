import { convertTo24HourTime } from "@/lib/utils";
import { parseLocaleDate } from "@/utils/date";

interface AppointmentEmailData {
    name: string;
    selectedDate: string;
    startTime: string;
    meetingLink: string;
    assignedTo: string;
    email: string;
    phone: string;
    location: string;
    challengeOptions: string;
    challengeDescription: string;
}

export function generateAppointmentEmailForSalesperson(data: AppointmentEmailData) {
    return `
    <html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }

        .header-mail {
            display: flex;
            padding: 30px 10px;
            background-color: #c3d4cc;
            width: 100%;
        }

        .header-mail .logo-container {
            margin: auto;
            display: flex;
            align-items: center;
            gap: 10px;
        }


        .left-logo {
            margin-right: 10px;
        }

        .right-logo-container {
            margin: auto;
        }

        .header-mail p {
            font-size: 16px;
            color: #879b93;
            margin: 0;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            font-size: 18px;
            color: #333;
            word-wrap: break-word;
            white-space: normal;
        }

        p {
            color: #333;
        }

        .content p {
            font-size: 14px;
            line-height: 1.5;
            margin: 10px 0;
        }

        .details {
            margin: 20px 0;
        }

        .details p {
            margin: 0;
            padding-bottom: 8px
        }

        .text-bold {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header-mail">
        <div class="logo-container">
            <img class="left-logo" src="https://hebamann-dashboard.vercel.app/Hebammenburo-orig-logo.png"
                alt="Company Logo" width="100" />
            <div class="right-logo-container">
                <img src="https://hebamann-dashboard.vercel.app/Hebammenburo-text-logo-black.png" alt="Company Logo"
                    width="290" />
                <p>geschaffen für freiberufliche Hebammen</p>
            </div>
        </div>
    </div>

    <div class="content">
        <h2 style="margin-bottom: 20px;">Neuer Call mit ${data.name.trim().split(' ')[0]} -
            ${parseLocaleDate(data.selectedDate).toLocaleDateString("de-DE", {
        weekday: "long", year: "numeric", month:
            "numeric", day: "numeric",
    })}, ${convertTo24HourTime(data.startTime)} Uhr</h2>

        <p>Hey ${data.assignedTo}, </p>
        <p> du hast einen neuen Termin mit ${data.name} – und sie braucht genau das, was wir ihr bieten können.Sie hat
            keine Ahnung, wie sehr wir ihr Leben erleichtern werden – und ich weiß: </p>
        <p class="text-bold" style="margin-bottom: 20px;"> Du wirst sie überzeugen.You’ve got this! 🚀</p>
        <p> Let’s rock it.</p>
        <p class="text-bold"> Dein Termin: </p>
        <div class="details">
            <p><span class="text-bold">📅 Datum & Uhrzeit:
                </span><span>${parseLocaleDate(data.selectedDate).toLocaleDateString("de-DE")} um
                    ${convertTo24HourTime(data.startTime)} Uhr </span>
            </p>
            <p><span class="text-bold">⏳ Dauer: </span><span>ca. 30 Minuten</span> </p>
            <p><span class="text-bold">🔗 Call - Link: </span><span>${data.meetingLink}</span> </p>
        </div>

        <p> Kundendaten: </p>
        <div class="details">
            <p><span class="text-bold"> Name: </span><span>${data.name}</span> </p>
            <p> <span class="text-bold"> E-Mail: </span><span>${data.email}</span> </p>
            <p> <span class="text-bold"> Telefonnummer: </span><span>${data.phone}</span> </p>
            <p> <span class="text-bold"> Ort: </span><span>${data.location}</span> </p>
            <p> <span class="text-bold"> Ihre Nachricht: </span><span>${data.challengeOptions}${data.challengeDescription.trim().length > 0 ? (" - " + data.challengeDescription) : ""}</span> </p>
        </div>

        <div class="footer">
            <p style="margin-bottom: 0px;"> Viel Erfolg! Wir zählen auf dich! </p>
            <p style="margin-top: 0px;"> Team hebammenbüro! </p>
        </div>
    </div>
</body>

</html>
`
}