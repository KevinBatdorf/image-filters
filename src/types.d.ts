export type Attributes = {
    sourceImageId: number | undefined
    currentImageId: number | undefined
    currentFilterSlug: string | undefined
    filteredFromImageId: number | undefined
}
export type WpImage = {
    id: number
    source_url: string
    mime_type: string
    alt_text: string
    media_details: {
        file: string
        height: number
        width: number
    }
    caption: { raw: string }
    description: { raw: string }
    title: { raw: string }
    slug: string
    status: string
}
export type PhotonImage = T
