
const $t = (label, params = {}) => {
  let result = label;

  const paramKeys = Object.keys(params);
  if (paramKeys.length) {
    for (let i = 0; i < paramKeys.length; i++) {
      const key = paramKeys[i];
      result += ` -- key:${key} value:${params[key]}`;
    }
  }

  return result;
};

const createI18nStub = () => {
  // eslint-disable-next-line no-undef
  const tStub = jest.fn().mockImplementation($t);

  const i18nStub = {
    install(app) {
      app.directive("t", tStub);

      app.config.globalProperties.$t = tStub;
    },
  };

  return {
    tStub,
    i18nStub,
    $t,
  };
};

export default createI18nStub;
