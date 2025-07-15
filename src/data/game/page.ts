import type { Screen } from './screen'
import type { ComponentModule } from './component'

export interface GridPosition {
    row: number
    column: number
    rowSpan?: number
    columnSpan?: number
}

export interface PageComponent {
    component: ComponentModule
    position: GridPosition
}

export interface PageModule {
    type: 'page'
    description: string
    screen: Screen
    components: PageComponent[]
}
