const editorSnippets = {
  namespaced: true,
  
  state: {
    primaryNoteSnippet: '> ##### Header\n>\n> Example text.\n',
    secondaryNoteSnippet: '>> ##### Header\n>>\n>> Example text.\n',
    tertiaryNoteSnippet: '>>> ##### Header\n>>>\n>>> Example text.\n',
    newspaperNoteSnippet: '<pre markdown="1" class="prop prop--newspaper">\n# headline\n\narticle_content\n</pre>\n',
    handwrittenNoteSnippet: '<pre markdown="1" class="prop prop--handwritten">\nHandwritten note\n\n<p style="float: right;">John Doe</p>\n</pre>\n',

    cthulhuStatTableSnippet: '<pre markdown="1" class="stat-block stat-block--cthulhu">\n|JOSH WINSCOTT, *damned by his legacy*|\n|-|\n\n||||||\n|-|-|-|-|-|\n|**STR** 00|**CON** 00|**SIZ** 00|**DEX** 00|**INT** 00|\n|**APP** 00|**POW** 00|**EDU** 00|**SAN** 00|**HP** 00|\n|**DB** 0|**Build** 0|**Move** 0|**MP** 00|-|\n\n|*Combat*||\n|-|-|\n|Knife|00% (00/00), damage **0**|\n|Dodge|00% (00/00)|\n\n|*Skills*|\n|-|\n|Climb 00%, Credit Rating 00%, Fast Talk 00%, History 00%, Jump 00%, Library Use 00%, Occult 00%.|\n|**Languages:** English 00%, French 00%.|\n</pre>\n',
    dndStatTableSnippet: '<pre markdown="1" class="stat-block stat-block--dnd">\n# Animated armor\n*Medium construct, unaligned*\n___\n* **Armor Class 18** (natural armor)\n* **Hit Points 33** (6d8 + 6)\n* **Speed** 25 ft.\n___\n|STR|DEX|CON|INT|WIS|CHA|\n|:-:|:-:|:-:|:-:|:-:|:-:|\n|14 (+2)|11 (+0)|13 (+1)|1 (-5)|3 (-4)|1 (-5)|\n\n___\n* **Damage Immunities** poison, psychic\n* **Condition Immunities** blinded, charmed, deafened, exhaustion, frightened, paralyzed, petrified, poisoned\n* **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 6\n* **Languages** ---\n* **Challenge** 1 (200XP)\n___\n***Antimagic Susceptibility.*** The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constituion saving throw against the caster\'s spell save DC or fall unconscious for 1 minute.\n\n***False Appearance***. While the armor remains motionless, it is indistinguishable from a normal suit of armor.\n\n## Actions\n\n***Multiattack.*** The armor makes two melee attacks.\n\n***Slam.*** *Melee Weapon Attack:* +4 to hit, reach 5ft., one target. *Hit:* 5 (1d6 + 2) bludgeoning damage.\n</pre>',

    tableSnippet: '|Header 1|Header 2|Header 3|\n|-|:-:|-:|\n|aaa|bbb|ccc|\n|aaa|bbb|ccc|\n',

    pageSnippet: '\\page\n',
    twoColumnPageSnippet: '\\page[columns-2]\n',
    threeColumnPageSnippet: '\\page[columns-3]\n',
    titlePageSnippet: '\\page[title]\n\n<div style="height: 350px;"></div>\n\n# Title\n\n##### Description\n',

    relativeImageSnippet: '<image src="https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png"/>\n',
    absoluteImageSnippet: '<img class="image image--absolute" style="bottom: 1cm; right: 1cm;" src="https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png"/>\n',
    fullPageImageSnippet: '<img class="image image--fullpage" src="https://i.imgur.com/PNpQjCA.jpg"/>\n',

    columnBreakSnippet: '```\n```\n',
    wideBlockSnippet: '<pre markdown="1" class="page-wide-block">\nwide_block\n</pre>\n',
    verticalSpacingSnippet: '<div style="height: 350px;"/>\n',

    customTitlePageFontSnippet: '<style>\n@font-face {\n\tfont-family: "titlePage";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");\n}\n</style>\n',
    customHeadersFontSnippet: '<style>\n@font-face {\n\tfont-family: "headers";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");\n}\n</style>\n',
    customNoteHeadersFontSnippet: '<style>\n@font-face {\n\tfont-family: "headers-blockquotes";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");\n}\n</style>\n',
    customRegularTextFontSnippet: '<style>\n@font-face {\n\tfont-family: "regular-text";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");\n}\n</style>\n',
    customNewspaperHeadersFontSnippet: '<style>\n@font-face {\n\tfont-family: "newspaper-headers";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");\n}\n</style>\n',
    customNewspaperTextFontSnippet: '<style>\n@font-face {\n\tfont-family: "newspaper-text";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");\n}\n</style>\n',
    customHandwritingFontSnippet: '<style>\n@font-face {\n\tfont-family: "handwriting";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");\n}\n</style>\n'
  },

  getters: {
    primaryNoteSnippet: state => state.primaryNoteSnippet,
    secondaryNoteSnippet: state => state.secondaryNoteSnippet,
    tertiaryNoteSnippet: state => state.tertiaryNoteSnippet,
    newspaperNoteSnippet: state => state.newspaperNoteSnippet,
    handwrittenNoteSnippet: state => state.handwrittenNoteSnippet,
    phbNoteSnippet: state => state.phbNoteSnippet,

    cthulhuStatTableSnippet: state => state.cthulhuStatTableSnippet,
    dndStatTableSnippet: state => state.dndStatTableSnippet,

    tableSnippet: state => state.tableSnippet,

    pageSnippet: state => state.pageSnippet,
    twoColumnPageSnippet: state => state.twoColumnPageSnippet,
    threeColumnPageSnippet: state => state.threeColumnPageSnippet,
    titlePageSnippet: state => state.titlePageSnippet,

    relativeImageSnippet: state => state.relativeImageSnippet,
    absoluteImageSnippet: state => state.absoluteImageSnippet,
    fullPageImageSnippet: state => state.fullPageImageSnippet,

    columnBreakSnippet: state => state.columnBreakSnippet,
    wideBlockSnippet: state => state.wideBlockSnippet,
    verticalSpacingSnippet: state => state.verticalSpacingSnippet,

    customTitlePageFontSnippet: state => state.customTitlePageFontSnippet,
    customHeadersFontSnippet: state => state.customHeadersFontSnippet,
    customNoteHeadersFontSnippet: state => state.customNoteHeadersFontSnippet,
    customRegularTextFontSnippet: state => state.customRegularTextFontSnippet,
    customNewspaperHeadersFontSnippet: state => state.customNewspaperHeadersFontSnippet,
    customNewspaperTextFontSnippet: state => state.customNewspaperTextFontSnippet,
    customHandwritingFontSnippet: state => state.customHandwritingFontSnippet
  }
};

export default editorSnippets;
