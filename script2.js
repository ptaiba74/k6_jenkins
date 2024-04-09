import { sleep, check, group } from 'k6'
import http from 'k6/http'

export const options = {
  thresholds: {
    'http_req_duration{url:https://www.w3schools.com/xml/tempconvert.asmx}': ['p(95)>1000'],
    'http_reqs{url:https://www.w3schools.com/xml/tempconvert.asmx}': ['count<5'],
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

  group('Temperaturas', function () {
    // CelciusToFarenheit
    response = http.post(
      'https://www.w3schools.com/xml/tempconvert.asmx',
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="https://www.w3schools.com/xml/">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <ns:CelsiusToFahrenheit>\r\n         <ns:Celsius>10</ns:Celsius>\r\n      </ns:CelsiusToFahrenheit>\r\n   </soap:Body>\r\n</soap:Envelope>',
      {
        headers: {
          'Content-Type':
            'application/soap+xml;charset=UTF-8;action="https://www.w3schools.com/xml/CelsiusToFahrenheit" ',
          SOAPAction: '{https://www.w3schools.com/xml/}TempConvertSoap12',
          Binding: 'Encoding: gzip,deflate ',
          Connection: 'Keep-Alive',
          Host: 'www.w3schools.com',
        },
      }
    )
    check(response, { 'status equals 200': response => response.status.toString() === '200' })

    // FarenheitToCelsius
    response = http.post(
      'https://www.w3schools.com/xml/tempconvert.asmx',
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="https://www.w3schools.com/xml/">\r\n   <soap:Header/>\r\n   <soap:Body>\r\n      <ns:FahrenheitToCelsius>\r\n         <ns:Fahrenheit>25</ns:Fahrenheit>\r\n         }\r\n      </ns:FahrenheitToCelsius>\r\n   </soap:Body>\r\n</soap:Envelope>',
      {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          SOAPAction: '{https//www.w3schools.com/xml/}TempConvertSoap12',
          'Accept-Encoding': 'gzip,deflate',
          Connection: 'Keep-Alive',
          Host: 'www.w3schools.com',
        },
      }
    )
    check(response, { 'status equals 200': response => response.status.toString() === '200' })
  })

  // Automatically added sleep
  sleep(1)
}
