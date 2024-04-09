pipeline {
    agent any
    stages {
        stage('verify k6') {
            steps {
                sh 'k6 version'
            }
        }
		stage('run k6 test') {
		    steps {
				sh 'k6 run --out influxdb=http://192.168.47.130:8086 script.js'
			}
		}
    }
}
