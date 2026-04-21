import { convertTo24HourTime } from "@/lib/utils";
import { parseLocaleDate } from "@/utils/date";

interface AppointmentEmailData {
    name: string;
    selectedDate: string;
    startTime: string;
    meetingLink: string;
}

export function generateAppointmentEmail(data: AppointmentEmailData) {
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
                    padding-bottom:8px
                }

                .text-bold {
                    font-weight: bold;
                }
            </style>
        </head>

        <body>
            <div class="header-mail">
                <div class="logo-container">
                    <img class="left-logo" src="https://hebamann-dashboard.vercel.app/Hebammenburo-orig-logo.png" alt="Company Logo" width="100" />
                    <div class="right-logo-container">
                        <img src="https://hebamann-dashboard.vercel.app/Hebammenburo-text-logo-black.png" alt="Company Logo" width="290" />
                        <p>geschaffen für freiberufliche Hebammen</p>
                    </div>
                </div>
            </div>

            <div class="content">
                <h2 style="margin-bottom: 20px;">Terminbestätigung - ${parseLocaleDate(data.selectedDate).toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "numeric", day: "numeric", })}, ${convertTo24HourTime(data.startTime)} Uhr</h2>

                <p>Liebe Frau ${data.name},</p>
                <p>vielen Dank für Ihre Terminbuchung - wir freuen uns, Sie bald persönlich kennenzulernen.</p>
                <p>In unserem Gespräch möchten wir Ihnen zeigen, wie das Hebammenbüro Sie im Berufsalltag entlasten kann - individuell, praxisnah und mit Blick auf das, was Ihnen wichtig ist.</p>

                <div class="details">
                    <p><span class="text-bold">Ihr Termin: </span><span>${parseLocaleDate(data.selectedDate).toLocaleDateString("de-DE")} um ${convertTo24HourTime(data.startTime)} Uhr</span></p>
                    <p><span class="text-bold">Ort: </span><span>${data.meetingLink}</span></p>
                    <p><span class="text-bold">Dauer: </span><span>ca. 20-30 Minuten</span></p>
                </div>

                <p>Wenn Sie vorher noch Fragen haben oder den Termin verschieben möchten, melden Sie sich gerne bei uns.</p>
                <p>Bis bald - wir freuen uns auf Sie!</p>

                <div class="footer">
                    <p style="margin-bottom: 0px;">Herzliche Grüße</p>
                    <p class="text-bold" style="margin-top: 0px;">Ihr Team vom hebammenbüro</p>
                    <p style="margin-bottom: 0px;">Kontakt:</p>
                    <p style="margin-top: 0px;">hello@hebammenbüro.de</p>
                </div>
            </div>
        </body>
        </html>
`
}