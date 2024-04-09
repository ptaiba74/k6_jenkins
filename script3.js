import { sleep, check, group } from 'k6'
import http from 'k6/http'

export const options = {
  ext: {
    loadimpact: {
      distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
      apm: [],
    },
  },
  thresholds: {
    'http_req_duration{url:https://jsonplaceholder.typicode.com/posts/1}': ['p(95)>1000'],
    'http_req_failed{url:https://jsonplaceholder.typicode.com/posts/1}': ['rate>5'],
    'http_reqs{url:https://jsonplaceholder.typicode.com/posts/1}': ['count<5'],
  },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '1m' },
        { target: 20, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  group('Rest Service', function () {
    // obtener recurso
    response = http.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    })
    check(response, { 'status equals 200': response => response.status.toString() === '200' })

    // lista de recursos
    response = http.get('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Accept: '*/*',
      },
    })
    check(response, { 'status equals 200': response => response.status.toString() === '200' })

    // crear recurso
    response = http.post(
      'https://jsonplaceholder.typicode.com/posts',
      '[\r\n  {\r\n    "userId": 1,\r\n    "id": 1,\r\n    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",\r\n    "body": "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto"\r\n  }\r\n]\r\n',
      {
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Content-Type': 'application/json',
        },
      }
    )
    check(response, { 'status equals 200': response => response.status.toString() === '200' })
  })

  // Automatically added sleep
  sleep(1)
}
