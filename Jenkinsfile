boolean shouldRun(String platform) {
    def selected = env.PLATFORMS_TO_BUILD?.tokenize(',') ?: []
    return selected.contains(platform)
}

pipeline {
    /* Replace with a node or label that has Tizen Studio CLI. and more as they are added/ required */
    agent none

    parameters {
        text(name: '_SECTION_',
             defaultValue: '',
             description: 'Select the platform(s) to build')

        booleanParam(name: 'Tizen',    defaultValue: false, description: 'Tizen')
        booleanParam(name: 'WebOS',    defaultValue: false, description: 'WebOS')
        booleanParam(name: 'AndroidTV', defaultValue: false, description: 'AndroidTV')
        booleanParam(name: 'tvOS',     defaultValue: false, description: 'tvOS')
        booleanParam(name: 'Roku',     defaultValue: false, description: 'Roku')
    }

    environment {
        BASE_DIR = 'bgn-tv-wrappers'
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    def list = []
                    if (params.Tizen)     list << 'Tizen'
                    if (params.WebOS)     list << 'WebOS'
                    if (params.AndroidTV) list << 'AndroidTV'
                    if (params.tvOS)      list << 'tvOS'
                    if (params.Roku)      list << 'Roku'
                    env.PLATFORMS_TO_BUILD = list.join(',')
                    echo "Selected platforms: ${env.PLATFORMS_TO_BUILD}"
                }
            }
        }

        stage('Tizen build & deploy') {
            when { expression { shouldRun('Tizen') } }
            environment {
                TIZEN_CERT_PASSWORD = credentials('tizen-cert-password')
            }
            steps {
                sh 'make tizen-all'
                archiveArtifacts artifacts: 'tizen/*.wgt'

                withCredentials([usernamePassword(
                        credentialsId: 'samsung-seller-api',
                        usernameVariable: 'SS_USER',
                        passwordVariable: 'SS_PASS')]) {
                    sh '''
                       source tizen/.tv.env
                       tizen-cli upload --app-id "${TIZEN_APP_ID}" \
                                        --file "tizen/${TIZEN_WGT_NAME}" \
                                        --user "${SS_USER}" --pass "${SS_PASS}" \
                                        --channel beta
                    '''
                }
            }
        }
    }
}