---
layout: post
title: "JaCoCo single coverage for Multi Module projects"
---

I am working on an android project with multiple modules. I use JaCoCo for code coverage, and it's setup in a way that 
a coverage report is generated for each module. Recently, I was in a need to generate a single code coverage report for the 
entire project so that it could be visualized. This blog explains how this could be done, since I didn't find any other 
material on this.


### Setting up JaCoCo for Multi Module project
Let's first setup JaCoCo so that it could generate coverage report for every module. Add the below file to the Root project, 
somewhere like `{root}/jacoco/modules.gradle`.

```groovy
apply plugin: 'jacoco'

jacoco {
    toolVersion '0.8.7'
}

tasks.withType(Test) {
    jacoco.includeNoLocationClasses = true
}

project.afterEvaluate {

    tasks.create(name: "debugCoverage", type: JacocoReport, dependsOn: "testDebugUnitTest") {

        group = "Reporting"
        description = "Generate Jacoco coverage reports for the debug build."

        reports {
            html.enabled = true
            xml.enabled = true
        }

        def excludes = [
                '**/R.class',
                '**/R$*.class',
                '**/BuildConfig.*',
                '**/Manifest*.*',
                '**/*Test*.*',
                'android/**/*.*',
                'androidx/**/*.*',
                '**/*$ViewInjector*.*',
                '**/*Dagger*.*',
                '**/*MembersInjector*.*',
                '**/*_Factory.*',
                '**/*_Provide*Factory*.*',
                '**/*_ViewBinding*.*',
                '**/AutoValue_*.*',
                '**/R2.class',
                '**/R2$*.class',
                '**/*Directions$*',
                '**/*Directions.*',
                '**/*Binding.*'
        ]

        def jClasses = "${project.buildDir}/intermediates/javac/debug/classes"
        def kClasses = "${project.buildDir}/tmp/kotlin-classes/debug"
        def javaClasses = fileTree(dir: jClasses, excludes: excludes)

        def kotlinClasses = fileTree(dir: kClasses, excludes: excludes)

        classDirectories.from = files([javaClasses, kotlinClasses])
        def sourceDirs = ["${project.projectDir}/src/main/java", "${project.projectDir}/src/main/kotlin",
                          "${project.projectDir}/src/debug/java", "${project.projectDir}/src/debug/kotlin"]

        sourceDirectories.from = files(sourceDirs)

        executionData.from = files(["${project.buildDir}/jacoco/testDebugUnitTest.exec"])
    }
}
```

Now go to every module's `build.gradle` file (the ones that needs a coverage report) and add the below line to it: 

`apply from: '../jacoco/modules.gradle'`

Now, you can run `./gradlew debugCoverage` and it will generate a report for each module.

### Consolidate into a Single coverage report
Add the below file to the Root project, somewhere like `{root}/jacoco/project.gradle`.

```groovy
apply plugin: 'jacoco'

jacoco {
    toolVersion '0.8.7'
}

tasks.withType(Test) {
    jacoco.includeNoLocationClasses = true
}

project.afterEvaluate {

    tasks.create(name: "allDebugCoverage", type: JacocoReport) {

        group = "Reporting"
        description = "Generate overall Jacoco coverage report for the debug build."

        reports {
            html.enabled = true
            xml.enabled = true
        }

        def excludes = [
                '**/R.class',
                '**/R$*.class',
                '**/BuildConfig.*',
                '**/Manifest*.*',
                '**/*Test*.*',
                'android/**/*.*',
                'androidx/**/*.*',
                '**/*$ViewInjector*.*',
                '**/*Dagger*.*',
                '**/*MembersInjector*.*',
                '**/*_Factory.*',
                '**/*_Provide*Factory*.*',
                '**/*_ViewBinding*.*',
                '**/AutoValue_*.*',
                '**/R2.class',
                '**/R2$*.class',
                '**/*Directions$*',
                '**/*Directions.*',
                '**/*Binding.*'
        ]

        def jClasses = subprojects.collect { proj ->
            "${proj.buildDir}/intermediates/javac/debug/classes"
        }
        def kClasses = subprojects.collect { proj ->
            "${proj.buildDir}/tmp/kotlin-classes/debug"
        }
        def javaClasses = jClasses.collect { path ->
            fileTree(dir: path, excludes: excludes)
        }
        def kotlinClasses = kClasses.collect { path ->
            fileTree(dir: path, excludes: excludes)
        }

        classDirectories.from = files([javaClasses, kotlinClasses])
        def sources = subprojects.collect { proj ->
            ["${proj.projectDir}/src/main/java", "${proj.projectDir}/src/main/kotlin",
             "${proj.projectDir}/src/debug/java", "${proj.projectDir}/src/debug/kotlin"]
        }.flatten()

        sourceDirectories.from = files(sources)

        def executions = subprojects.findAll { proj ->
            def path = "${proj.buildDir}/jacoco/testDebugUnitTest.exec"
            (new File(path)).exists()
        }.collect {proj ->
            "${proj.buildDir}/jacoco/testDebugUnitTest.exec"
        }

        executionData.from = files(executions)
    }
}
```

Add the below line to the project's `build.gradle` (the one that is present at the root):

`apply from: 'jacoco/project.gradle'`

This adds the `allDebugCoverage` gradle task, which will fetch `classDirectories` and `sourceDirectories` from all the modules
and generate a report from that.

### Generating the Report

1. First run `./gradlew debugCoverage`. This will generate individual jacoco reports for all the module. Though we don't care 
about these individual reports, we need the `.exec` files that is generated in each module, without which `allDebugCoverage` won't work.
<br><br>
2. After `debugCoverage` is successfully executed, run `./gradlew allDebugCoverage`. This will now use the intermediate artifacts created from above task and generate 
a consolidated report in the Root project, i.e, under `{root}/build/reports/jacoco`.
   
### Improvements
I have hardcoded the script to run only on the Debug variant. If you want to generate a gradle task for all variants, then you can modify the 
script, and move the `tasks.create()` within a variant block, like this:

```groovy
project.afterEvaluate {
    android.applicationVariants.all { variant ->
        tasks.create()
    }
}
```

Depending on whether this is an app module or a library module, you have to use either "applicationVariants" or "libraryVariants". 
This modification is possible (at least as far as I checked) only for the `modules.gradle`. For `project.gradle` you will still have to pinpoint the 
location of all `.exec` files created. 
So to keep things really simple I just chose a variant that's common for all modules.

### Extras
If you are using Github Actions, and you want to publish this coverage report as a Comment in the Pull Request, then you 
can use the action [JaCoCo Report](https://github.com/marketplace/actions/jacoco-report). Right now this action only takes 
in a single jacoco report, but will modify this soon to support multiple reports. After that I will no longer require the 
`addDebugCoverage` task.