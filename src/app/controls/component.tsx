import componentRegistry from '@app/components/componentRegistry'
import type { Component as ComponentData } from '@loader/data/component'
import type { IGameEngine } from '@engine/core/gameEngine'

export type ComponentProps = {
    component: ComponentData
    engine: IGameEngine
}

const DefaultComponent: React.FC<ComponentProps> = ({ component }) => (
    <div>TODO: {component.type}</div>
)

export const Component:React.FC<ComponentProps> = ({ component, engine }): React.JSX.Element => {
    const ComponentImpl = componentRegistry[component.type] ?? DefaultComponent
    return <ComponentImpl component={component} engine={engine} />
}
