export type AttributesNative = {
    _imageFiltersBlockType?: 'kevinbatdorf/image-filters'
    sourceImageId: number | undefined
    currentImageId: number | undefined
    currentFilterSlug: string | undefined
    filteredFromImageId: number | undefined
    imageFilters?: never
}
// Adding atributes here could cause conflicts with other blocks
export type AttributesNested = ImageLike & {
    _imageFiltersBlockType?: 'core/image'
    sourceImageId: never
    currentImageId: never
    currentFilterSlug: never
    filteredFromImageId: never
    imageFilters: AttributesNative
}
export type Attributes = AttributesNative | AttributesNested
export type AttributesWithImageLike = AttributesNative & ImageLike
export type fnNative = (attributes: AttributesNative) => void
export type fnNativeWithImageLike = (
    attributes: AttributesWithImageLike,
) => void
export type ImageLike = {
    alt: string
    caption: string
    id: number
    url: string
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
