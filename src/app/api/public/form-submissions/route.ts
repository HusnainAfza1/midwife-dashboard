// app/api/form-submissions/route.js
import { connect } from "@/dbConfig/dbConfig";
import FormSubmission from "@/models/formSubmissionModel";
import { NextRequest, NextResponse } from "next/server";  
import { sendEmail } from "@/helper/mailer"

export const dynamic = 'force-dynamic';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { firstName, lastName, email, phone, message, privacy } = reqBody;

        const newSubmission = new FormSubmission({
            firstName,
            lastName,
            email,
            phone,
            message,
            privacy,
        });

        const savedSubmission = await newSubmission.save();   
         await sendEmail({
            receiver: "cheemahusnainafzal@gmail.com", // Admin email
            subject: `New Request from ${firstName} ${lastName}`, // Subject of the email
            message: `
                Hi ,
                You have received a new request:
                
                - Name: ${firstName} ${lastName}
                - Email: ${email}
                - Phone: ${phone}
                - Message: ${message}
                
                Please review the details and take the necessary action.`
         })
        return NextResponse.json({
            message: "Form submission successful",
            success: true,
            submission: savedSubmission,
        });
        // eslint-disable-next-line
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const submissions = await FormSubmission.find().select("firstName lastName email phone message privacy submittedAt");

        return NextResponse.json({
            success: true,
            submissions,
        });
        // eslint-disable-next-line
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}