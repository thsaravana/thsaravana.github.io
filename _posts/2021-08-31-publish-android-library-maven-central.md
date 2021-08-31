---
layout: post
title: "Publishing Android library to maven central"
---

All my libraries has a script to publish the artifact to `bintray` and from there auto release to `mavenCentral`. But recently, Bintray
was shutdown and hence I have to publish directly to maven central repository. This is how I did it.

### Requirements
1. You need to have access to Sonatype OSSRH, i.e, you should be able to login to https://oss.sonatype.org. If you don't,
[register](https://central.sonatype.org/publish/publish-guide/) for an account. This involves you creating a JIRA ticket
for a new project.
2. Username (`OSS_USERNAME`) and Password (`OSS_PASSWORD`) used to log in to [Sonatype account](https://oss.sonatype.org).
3. StagingProfileId (`OSS_STAGING_PROFILE_ID`). You get this by clicking on `Staging Profiles` on the left pane of your Sonatype Account, and then selecting
a profile in the right pane. Check the url in the address bar. It should appear something like 
`https://oss.sonatype.org/#stagingProfiles;721f909fe89978`. So `721f909fe89978` is your StagingProfileId.
4. PGP Key, specifically, `keyId`, `key` and `password`. If you are not sure how to generate PGP key pair,
refer [this](https://central.sonatype.org/publish/requirements/gpg/). If you have already generated the key pair, then execute
`gpg --list-keys` to get a list of keys in your system. Choose the one you are going to sign your artifacts.<br><br>
`keyId`(`OSS_SIGNING_KEY_ID`) - this would be something like `CA925CD6C9E8D064FF05B4728190C4130ABA0F98`. Either use the full string or the last 8 digits `0ABA0F98`.<br>
`key`(`OSS_SIGNING_KEY`) - get this by executing `gpg --export-secret-keys 0ABA0F98 | base64`.
`password`(`OSS_SIGNING_PASSWORD`) - this is the passphrase that you used when generating your key pair

### Project level Gradle script
- Add the `gradle-nexus-publish-plugin` to your `build.gradle` script at the root level.
```groovy
plugins {
    id("io.github.gradle-nexus.publish-plugin").version("1.1.0")
}
```

- Add the publishing configuration to access your Sonatype account. Refer [documentation](https://github.com/gradle-nexus/publish-plugin/) 
if you have registered your Sonatype account after 24 Feb 2021.
```groovy
// Publish to Maven Central
nexusPublishing {
    repositories {
        sonatype {
            username = System.getenv("OSS_USERNAME")
            password = System.getenv("OSS_PASSWORD")
            stagingProfileId = System.getenv("OSS_STAGING_PROFILE_ID")
        }
    }
}
```

### Module level Gradle script
- Add the below `publish.gradle` script to your Module.
```groovy
apply plugin: 'maven-publish'
apply plugin: 'signing'

// If you want to publish your sources as well
task androidSourcesJar(type: Jar) {
    archiveClassifier.set('sources')
    from android.sourceSets.main.java.srcDirs
    from android.sourceSets.main.kotlin.srcDirs
}

artifacts {
    archives androidSourcesJar
}

group = GROUP_ID
version = VERSION

afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {

                groupId GROUP_ID
                artifactId ARTIFACT_ID
                version VERSION

                from components.release
                artifact androidSourcesJar

                pom {
                    name = ARTIFACT_ID
                    description = 'An android library that ...'
                    url = SITE_URL
                    licenses {
                        // Your licensing information
                        license {
                            name = 'The Apache Software License, Version 2.0'
                            url = 'http://www.apache.org/licenses/LICENSE-2.0.txt'
                        }
                    }
                    developers {
                        developer {
                            id = 'instrap'
                            name = 'Madrapps'
                            email = 'madrasappfactory@gmail.com'
                        }
                        // More developers if any...
                    }

                    scm {
                        connection = GIT_URL
                        developerConnection = GIT_URL
                        url = SITE_URL
                    }
                }
            }
        }
    }
}

signing {
    useInMemoryPgpKeys(
            System.getenv("OSS_SIGNING_KEY_ID"),
            System.getenv("OSS_SIGNING_KEY"),
            System.getenv("OSS_SIGNING_PASSWORD"),
    )
    sign publishing.publications
}
```

- Now add the below to your `build.gradle` at your module level
```groovy
ext {
    GROUP_ID = "com.github.madrapps" // your project id registered in Sonatype
    ARTIFACT_ID = "plot" // name of your library
    VERSION = "0.1.1"
    SITE_URL = 'https://github.com/Madrapps/plot'
    GIT_URL = 'https://github.com/Madrapps/plot.git'
}

apply from: 'publish.gradle'
```

### Publishing your artifact
- Add all the variables below as Environment Variables<br>
`OSS_USERNAME`, `OSS_PASSWORD`, `OSS_STAGING_PROFILE_ID`, `OSS_SIGNING_KEY_ID`, `OSS_SIGNING_KEY` and `OSS_SIGNING_PASSWORD`

- Build your project first using `./gradlew build`
- Execute `./gradlew publishReleasePublicationToSonatypeRepository` to publish your artifact to `Staging Repositories` in
your Sonatype account. From here you can publish your artifact using the Sonatype UI itself (you will have to `close` and
then `release` the repository in `Staging Repositories`). Or, you can execute the below command to do that from your terminal.
- Execute `./gradlew closeAndReleaseSonatypeStagingRepository` to publish from staging to production.


### Working Project
For a working example, please refer to the [plot](https://github.com/Madrapps/plot) android project. It also has the CI/CD 
configured using Github Actions. Go crazy!
