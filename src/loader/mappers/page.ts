import type { Screen as ScreenData, GridScreenItem as GridScreenItemData } from '@loader/data/page'
import type { Component as ComponentData } from '@loader/data/component'
import type { Button as ButtonData } from '@loader/data/button'
import { type Screen, type GridScreenItem } from '@loader/schema/page'
import { type Component } from '@loader/schema/component'
import { type Button } from '@loader/schema/button'
import { mapAction } from './action'


interface Context {
    basePath: string
}

export function mapScreen(context: Context, screen: Screen): ScreenData {
    switch (screen.type) {
        case 'grid':
            return {
                type: 'grid',
                width: screen.width,
                height: screen.height,
                components: mapGridScreenComponents(context, screen.components)
            }
    }
}

export function mapGridScreenComponents(context: Context, components: GridScreenItem[]): GridScreenItemData[] {
    return components.map(c => mapGridScreenComponent(context, c))
}

export function mapGridScreenComponent(context: Context, item: GridScreenItem): GridScreenItemData {
    return {
        position: {
            top: item.position.top,
            left: item.position.left,
            right: item.position.right,
            bottom: item.position.bottom
        },
        component: mapComponent(context, item.component),
        condition: item.condition
    }
}

export function mapComponent(context: Context, component: Component): ComponentData {
    switch (component.type) {
        case 'game-menu':
            return {
                type: 'game-menu',
                buttons: mapButtons(component.buttons)
            }
        case 'image':
            return {
                type: 'image',
                image: `${context.basePath}/${component.image}`
            }
        case 'squares-map':
            return {
                type: 'squares-map',
                mapSize: {
                    rows: component.mapSize.rows,
                    columns: component.mapSize.columns
                }
            }
        case 'input-matrix':
            return {
                type: 'input-matrix',
                matrixSize: {
                    rows: component.matrixSize.rows,
                    columns: component.matrixSize.columns
                }
            }
    }
}

export function mapButtons(buttons: Button[]): ButtonData[] {
    return buttons.map(mapButton)
}

export function mapButton(button: Button): ButtonData {
    return {
        label: button.label,
        action: mapAction(button.action)
    }
}

