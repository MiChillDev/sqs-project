## Load Testing (k6)

### Setup
Loadtests werden mit k6 in Docker ausgeführt.

### Testarten für JokeController

- **Baseline** (normale Last, realistisches Nutzerverhalten)
  - 6 VUs getJokes (GET)
  - 1 VU  getSourceJoke (GET von externer API)
  - 2 VUs createJoke (POST)

- **Stress** (erhöhte Last zur Ermittlung der Systemgrenze)
  - bis zu  20 VUs: getJokes (GET)
  - konstant 2 VUs: getSourceJoke (GET von externer API)
  - bis zu   8 VUs: createJoke (POST)

- **Spike** (plötzliche Lastspitzen)
  - bis zu  50 VUs: getJokes (GET)
  - konstant 1 VU : getSourceJoke (GET von externer API)
  - bis zu  10 VUs: createJoke (POST)

### Endpunkte

- GET /api/v1/jokes
- POST /api/v1/jokes
- GET /api/v1/source-joke (ruft intern eine externe API auf)

### Thresholds

| Test     | p95 Dauer | Fehlerquote |
|----------|----------|------------|
| Baseline | < 150ms  | < 1%       |
| Stress   | < 600ms  | < 5%       |
| Spike    | < 900ms  | < 10%      |

### Ausführung

```bash
docker compose run --rm k6 run baseline/baseline-test.js
docker compose run --rm k6 run stress/stress-test.js
docker compose run --rm k6 run spike/spike-test.js
```