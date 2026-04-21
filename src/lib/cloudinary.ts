import { v2 as cloudinary } from "cloudinary"
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(base64Image: string, folder = "midwife-dash"): Promise<UploadApiResponse> {
    try {
        // Remove the data:image/jpeg;base64, part if it exists
        const base64Data = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, "")

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
                `data:image/jpeg;base64,${base64Data}`,
                {
                    folder,
                    transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }, { width: 800, crop: "limit" }],
                },
                (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
                    if (error || !result) reject(error || new Error("No result returned from Cloudinary"))
                    else resolve(result)
                },
            )
        })

        return result
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error)
        throw error
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteImage(publicId: string): Promise<any> {
    try {
        return await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error)
        throw error
    }
}
