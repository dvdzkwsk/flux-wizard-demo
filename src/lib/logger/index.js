const NAMESPACE = '[Halcyon]';

export default {
  log   : console.log.bind(console, NAMESPACE),
  info  : console.info.bind(console, NAMESPACE),
  warn  : console.warn.bind(console, NAMESPACE),
  error : console.error.bind(console, NAMESPACE)
};
