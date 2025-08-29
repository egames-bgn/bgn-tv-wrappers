boolean shouldRun(String platform) {
    return params.PLATFORMS_TO_BUILD.split(',').collect { it.trim() }.contains(platform)
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

    /* Build the comma-separated list once, right after checkout */
    environment {
        PLATFORMS_TO_BUILD = """${{
            def list = []
            if (params.Tizen)    list << 'Tizen'
            if (params.WebOS)    list << 'WebOS'
            if (params.AndroidTV) list << 'AndroidTV'
            if (params.tvOS)     list << 'tvOS'
            if (params.Roku)     list << 'Roku'
            list.join(',')
        }}"""
    }

//     parameters {
//         choice(
//             name: 'PLATFORMS_TO_BUILD',
//             choices: ['Tizen', 'WebOS', 'AndroidTV', 'tvOS', 'Roku'],
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