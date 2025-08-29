boolean shouldRun(String platform) {
    def selected = params.PLATFORMS_TO_BUILD
    if (selected == null) return false
    return selected.toString().tokenize(',').contains(platform)
}

pipeline {
    /* Replace with a node or label that has Tizen Studio CLI. and more as they are added/ required */
    agent none

    parameters {
            [$class: 'ChoiceParameter',
             choiceType: 'PT_CHECKBOX',              // multi-select widget
             description: 'Select the platform(s) to build',
             filterLength: 1,
             filterable: false,
             name: 'PLATFORMS_TO_BUILD',
             script: [
                 $class: 'GroovyScript',
                 fallbackScript: [
                     classpath: [],
                     sandbox: true,
                     script: 'return ["ERROR"]'
                 ],
                 script: [
                     classpath: [],
                     sandbox: true,
                     script: '''
                         return ["Tizen", "WebOS", "AndroidTV", "tvOS", "Roku"]
                     '''
                 ]
             ]
            ]
        }

//     parameters {
//         choice(
//             name: 'PLATFORMS_TO_BUILD',
//             choices: ['Tizen', 'WebOS', 'AndroidTV', 'tvOS', 'Roku', 'NONE'],
//             description: 'Comma-separated list of wrappers to build/deploy'
//         )
//     }

    environment {
        BASE_DIR = 'bgn-tv-wrappers'
    }

    stages {
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