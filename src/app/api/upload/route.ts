import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
    try {
        const { image, folder } = await request.json()

        if (!image) {
            return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 })
        }

        const result = await uploadImage(image, folder || "midwife-dash")

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        })
    } catch (error) {
        console.error("Error in upload route:", error)
        return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 })
    }
}
