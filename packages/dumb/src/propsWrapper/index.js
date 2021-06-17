export const propsWrapper = fn => props => ({ ...props, ...fn(props) })
