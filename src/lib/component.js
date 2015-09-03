export function getComponentTitle (component) {
  if (component.props.title) {
    return component.props.title;
  } else if (component.type && component.type.name) {
    return component.type.name.replace(/([a-z](?=[A-Z]))/g, '$1 ');
  } else {
    console.warn('No title provided to component');
    return 'UNNAMED COMPONENT';
  }
}
