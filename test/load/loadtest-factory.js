import { sleep } from 'k6';

export function makeSetup(loginFn) {
  return function setup() {
    return { token: loginFn() };
  };
}

export function makeScenario(actionFn, delaySeconds) {
  return function scenario(data) {
    actionFn(data.token);
    sleep(delaySeconds);
  };
}

export function buildOptions({ scenarios, p95Ms, failedRate }) {
  return {
    scenarios,
    thresholds: {
      http_req_duration: [`p(95)<${p95Ms}`],
      http_req_failed: [`rate<${failedRate}`],
    },
  };
}