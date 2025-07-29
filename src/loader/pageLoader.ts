import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData, Screen as ScreenData, Component as ComponentData } from './data/page'
import { type Page, type Component, type Screen, pageSchema } from './schema/page'
import { fatalError } from '@utils/logMessage'

export async function pageLoader(path: string, update: (page: PageData) => void): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(path, pageSchema)
    const result: PageData = {
        id: schemaData.id,
        screen: getScreenData(schemaData.screen),
        components: getComponents(schemaData.components)
    }
    update(result)
    return result
}

function getScreenData(screen: Screen): ScreenData {
    switch (screen.type){
        case 'grid':
            return {
                type: 'grid',
                width: screen.width,
                height: screen.height
            }
    }
}

function getComponents(components: Component[]): ComponentData[] {
    return components.map(getComponent)
}

function getComponent(component: Component): ComponentData {
    switch(component.type) {
        case 'game-menu':
            return {
                type: 'game-menu',
                position: {
                    top: component.position.top,
                    left: component.position.left,
                    right: component.position.right,
                    bottom: component.position.bottom
                }
            }
        default:
            fatalError('Unsupported page component type: {0}', component.type)
    }
}