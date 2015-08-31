export function getComponentTitle (component) {
  return (
    component.props.name ||
    component.type.name.replace(/([a-z](?=[A-Z]))/g, '$1 ')
  );
}
