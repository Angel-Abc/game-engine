import componentRegistry from '@app/components/componentRegistry'
import type { Component as ComponentData } from '@loader/data/component'

export type ComponentProps = {
    component: ComponentData
}

const DefaultComponent: React.FC<ComponentProps> = ({ component }) => (
    <div>TODO: {component.type}</div>
)

export const Component:React.FC<ComponentProps> = ({ component }): React.JSX.Element => {
    const ComponentImpl = componentRegistry[component.type] ?? DefaultComponent
    return <ComponentImpl component={component} />
}
