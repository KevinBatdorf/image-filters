import {
    Attributes,
    AttributesNative,
    AttributesNested,
    AttributesWithImageLike,
    ImageLike,
    fnNative,
    fnNativeWithImageLike,
} from '../types'

type theReturn = [
    attributes: AttributesNative | AttributesWithImageLike,
    setAttributes: fnNative | fnNativeWithImageLike,
]

export const useNormalizedAttributes = (
    type: 'kevinbatdorf/image-filters' | 'core/image',
    attributes: Attributes,
    setAttributes: fnNative | fnNativeWithImageLike,
): theReturn => {
    attributes._imageFiltersBlockType = type
    if (attributes._imageFiltersBlockType === 'kevinbatdorf/image-filters') {
        const update = setAttributes as fnNative
        delete attributes.imageFilters
        const setAttributesNative = (attributes: AttributesNative) => {
            delete attributes._imageFiltersBlockType
            update({ ...attributes })
        }
        return [attributes as AttributesNative, setAttributesNative]
    }
    // Core image block
    const { imageFilters } = attributes as AttributesNested
    const update = setAttributes as fnNativeWithImageLike
    const attributesTransformed = Object.assign(
        {
            sourceImageId: undefined,
            currentImageId: undefined,
            currentFilterSlug: undefined,
            filteredFromImageId: undefined,
        },
        attributes as ImageLike,
        imageFilters,
    )
    const setAttributesTransformed = (attributes: AttributesWithImageLike) => {
        const imageFilters = {
            sourceImageId: attributes.sourceImageId,
            currentImageId: attributes.currentImageId,
            currentFilterSlug: attributes.currentFilterSlug,
            filteredFromImageId: attributes.filteredFromImageId,
        }
        delete attributes.sourceImageId
        delete attributes.currentImageId
        delete attributes.currentFilterSlug
        delete attributes.filteredFromImageId
        delete attributes._imageFiltersBlockType
        const newAttributes = Object.assign({}, attributes, { imageFilters })
        console.log({ f: newAttributes })
        update(newAttributes)
    }

    return [
        attributesTransformed as AttributesWithImageLike,
        setAttributesTransformed as fnNativeWithImageLike,
    ]
}
