import { loadJsonResource } from '@utils/loadJsonResource'
import type { Page as PageData, Screen as ScreenData, GridScreenItem as GridScreenItemData } from './data/page'
import type { Component as ComponentData } from './data/component'
import type { Button as ButtonData } from './data/button'
import type { Action as Actiondata } from './data/action'
import { type Page, type Screen, pageSchema, type GridScreenItem } from './schema/page'
import { type Component } from './data/component'
import { type Button } from './schema/button'
import { type Action } from './schema/action'
import { fatalError } from '@utils/logMessage'

interface Context {
    basePath: string
    path: string
}

export async function pageLoader(context: Context, update: (page: PageData) => void): Promise<PageData> {
    const schemaData = await loadJsonResource<Page>(`${context.basePath}/${context.path}`, pageSchema)
    const result: PageData = {
        id: schemaData.id,
        screen: getScreenData(context, schemaData.screen),
    }
    update(result)
    return result
}

function getScreenData(context: Context, screen: Screen): ScreenData {
    switch (screen.type) {
        case 'grid':
            return {
                type: 'grid',
                width: screen.width,
                height: screen.height,
                components: getGridScreenComponents(context, screen.components)
            }
    }
}

function getGridScreenComponents(context: Context, components: GridScreenItem[]): GridScreenItemData[] {
    return components.map(c => getGridScreenComponent(context, c))    
}

function getGridScreenComponent(context: Context, item: GridScreenItem): GridScreenItemData {
    return {
        position: {
            top: item.position.top,
            left: item.position.left,
            right: item.position.right,
            bottom: item.position.bottom
        },
        component: getComponent(context, item.component)
    }
}

function getComponent(context: Context, component: Component): ComponentData {
    switch (component.type) {
        case 'game-menu':
            return {
                type: 'game-menu',
                buttons: getButtons(component.buttons)
            }
        case 'image':
            return {
                type: 'image',
                image: `${context.basePath}/${component.image}`  
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
