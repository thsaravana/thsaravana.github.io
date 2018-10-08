---
layout: post
title: "Some Good Practices"
---
So while writing this intelliJ plugin I came through some good practices and certain other stuff that I really need to
document somewhere so that I don't forget them. This is a blog about those random things.

### 1. Access Psi after Indexing<br>
If you are planning to access the Psi information on `openProject()`, like iterating through all the files and finding or
 modifying PsiElements, then ensure that you do it after the Project is fully initialized. This means that you need to 
 wrap your Psi accessing code inside the `StartupManager.registerPostStartupActivity()`, like below:
 ```kotlin
    override fun projectOpened() {
        StartupManager.getInstance(project).registerPostStartupActivity {
            val srcDir = ProjectRootManager.getInstance(project).contentSourceRoots.find {
                it.path.contains("src/main/kotlin")
            }
            if (srcDir != null) {
                ProjectFileIndex.SERVICE.getInstance(project).iterateContentUnderDirectory(srcDir) {
                    processFiles(project, it)
                }
            }
        }
    }
```