import type { CSSCustomProperties } from '@app/types'
import type { ImageComponent } from '@loader/data/component'

export type ImageProps = {
    component: ImageComponent
}

export const Image: React.FC<ImageProps> = ({ component }) => {
            const style: CSSCustomProperties = {
                '--ge-image-path': `url("${component.image}")`,
            }
    return (
        <div style={style} className='image-component' />
    )
}