import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData, Screen as ScreenData } from './data/page'
import type { Component as ComponentData } from './data/component'
import type { Button as ButtonData } from './data/button'
import type { Action as Actiondata } from './data/action'
import { type Page, type Screen, pageSchema } from './schema/page'
import { type Component } from './data/component'
import { type Button } from './schema/button'
import { type Action } from './schema/action'
import { fatalError } from '@utils/logMessage'

export async function pageLoader(basePath: string, path: string, update: (page: PageData) => void): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(`${basePath}/${path}`, pageSchema)
    const result: PageData = {
        id: schemaData.id,
        screen: getScreenData(schemaData.screen),
        components: getComponents(basePath, schemaData.components),
    }
    update(result)
    return result
}

function getScreenData(screen: Screen): ScreenData {
    switch (screen.type) {
        case 'grid':
            return {
                type: 'grid',
                width: screen.width,
                height: screen.height
            }
    }
}

function getComponents(basePath: string, components: Component[]): ComponentData[] {
    return components.map(c => getComponent(basePath, c))
}

function getComponent(basePath: string, component: Component): ComponentData {
    switch (component.type) {
        case 'game-menu':
            return {
                type: 'game-menu',
                position: {
                    top: component.position.top,
                    left: component.position.left,
                    right: component.position.right,
                    bottom: component.position.bottom
                },
                buttons: getButtons(component.buttons)
            }
        case 'image':
            return {
                type: 'image',
                position: {
                    top: component.position.top,
                    left: component.position.left,
                    right: component.position.right,
                    bottom: component.position.bottom
                },
                image: `${basePath}/${component.image}`  
            }
    }
}

function getButtons(buttons: Button[]): ButtonData[] {
    return buttons.map(getButton)
}

function getButton(button: Button): ButtonData {
    return {
        label: button.label,
        action: getAction(button.action)
    }
}

function getAction(action: Action): Actiondata {
    switch(action.type){
        case 'post-message':
            return {
                type: 'post-message',
                message: action.message,
                payload: action.payload
            }
        default:
            fatalError('Unsupported action type: {0}', action.type)
    }
}