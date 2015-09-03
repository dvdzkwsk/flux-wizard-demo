export function activeWizardOnly (target, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function () {
    if (!this.isActive()) return;

    return fn.call(this);
  };

  return descriptor;
}
