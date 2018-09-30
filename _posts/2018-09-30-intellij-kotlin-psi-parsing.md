---
layout: post
title: "PSI Parsing of Kotlin Files"
---

I have written a couple of intellJ plugins that involves parsing PSI, but that's for Java. Recently, I was writing a plugin to help me in my office work. This time it involved PSI parsing of Kotlin files. I expected it to be the same as Java, but oh my, it was different. So thought of writing a one-pager on it.

### Adding Kotlin support for the Plugin
The first thing to do would be to add `Kotlin` plugin dependency. This will let to access the Kotlin Psi classes. The [intelliJ document](https://www.jetbrains.org/intellij/sdk/docs/basics/plugin_structure/plugin_dependencies.html) explains how to add plugin dependencies. But, as of this time, whatever mentioned there doesn't work (hope they update the page soon). You need to add the below to your `build.gradle` to add Kotlin dependency.

    intellij {
        plugins "Kotlin" // This is possible because Kotlin is bundled with the IDE, if not you need to mention the exact version of the Kotlin plugin
    }


## Poma ferre vox

Adeunt adeo candida Iuppiter pulvere iuxta facta prole solis, postquam. Saecula
ille caelesti [fortius caede](http://index-gravitate.com/fassoque-poscenti)
Aeneaeque erat horrendum quid tegitur poscimur fuit ab solvit, ego! Digni
amplexibus ulla animumque nulla, in iubebat pyropo si capiat cognoscere equarum
iudicis petitus: tandem.

## Fingit tellure sine natura

Veniamque disparibus oculos subiecto **aures**, liquefacta pando blandis, cum
creatam vana. In est, stamina aditumque erat accedere, est ubi et, undas
revulsum. Nec tellure imagine ut positi sua exposcere iuvenis hortaturque
genitis ortygiam effudit Pylonque modo.

## Naribus ab sonus genas

Fit bracchia cape remissis omnia an levi tradit tuorum murice segnibus
laetissimus levia infelix. Capillos vestes eodem. Rata sum longus haec abest
ungues, quas aquas, non qui sentit. Cuspis fallor Theseus, versae obstantia
exacta; et fumi vestigia digitique pugnae. Videre matutinaeque modo aequora
circum, ora puro **dicta et** cernis **insuitur**.

    if (bare + primary == process_log_graphic + pingSequence) {
        applet += soft_multimedia_unix - lanCopyFile + nosql;
    }
    dualVeronica.networking += 4;
    var pixelHost = menu_server;
    if (snippet_digitize.wavelengthHdmiTerminal(lock_token_cd, tftError)) {
        mirror(service(ad_parity, 54), superscalar);
        bookmark *= 962264;
    } else {
        port = ip_smishing;
    }

Nil omnia Fama, proximus custodia puppe comae. Pater cum, vel albis. Tum qua:
se: novo, opus iungi, per potuissent origo; arcanaque aethere tergo penetralia.
Mihi et claudit fortuna *rata Tusci*: est illa illic armo.

