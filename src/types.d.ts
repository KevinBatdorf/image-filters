// Adding atributes here could cause conflicts with other blocks
export type Attributes = ImageLike & {
    imageFilters: {
        sourceImageId: number | undefined
        currentImageId: number | undefined
        currentFilterSlug: string | undefined
        filteredFromImageId: number | undefined
    }
}
export type ImageLike = {
    alt: string
    caption: string
    id: number
    url: string
    linkDestination: string
    href: string
    rel: string
    linkTarget: string
    linkClass
}
export type WpImage = {
    id: number
    source_url: string
    mime_type: string
    alt_text: string
    link: string
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

export type AttributesDeprecated = {
    sourceImageId: number | undefined
    currentImageId: number | undefined
    currentFilterSlug: string | undefined
    filteredFromImageId: number | undefined
}
