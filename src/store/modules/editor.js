const editor = {
  namespaced: true,
  
  state: {
    rawCode: '\\page[title]\n\n<div style="height: 350px;"></div>\n\n# Homebrew Creator\n\n##### A markdown editor for creating homebrew for various RPG systems.\n\n\\page[columns-2]\n\n## Pages\n\n* Pages\n* * Full width pages\n* Two Column Pages\n* Three Column Pages\n* Title Pages\n\n## Notes\n\n> ##### Example primary note\n>\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tortor nibh. Maecenas quis placerat purus. Nulla facilisi. Curabitur in ipsum dolor.\n\n>> ##### Example secondary note\n>>\n>> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tortor nibh. Maecenas quis placerat purus. Nulla facilisi. Curabitur in ipsum dolor.\n\n>>> ##### Example tertiary note\n>>>\n>>> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tortor nibh. Maecenas quis placerat purus. Nulla facilisi. Curabitur in ipsum dolor.\n\n## Tables\n\n|Align Left|Align Center|Align Right|\n|-|:-:|-:|\n|text|text|text|\n|*italic*|*italic*|*italic*|\n|**bold**|**bold**|**bold**|\n|***bold italic***|***bold italic***|***bold italic***|\n\n```\n```\n\n## Props\n\n### Newspaper Note\n\n<pre markdown="1" class="prop prop--newspaper">\n# Headline\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tortor nibh. Maecenas quis placerat purus. Nulla facilisi. Curabitur in ipsum dolor. Nam malesuada magna id lobortis sodales. Pellentesque quis diam ipsum. Nullam laoreet mauris non luctus pellentesque. Aliquam quis malesuada libero, sed mattis turpis. Proin nec mollis justo. Cras sit amet faucibus lacus. Vivamus ac magna tincidunt, suscipit eros in, pellentesque sapien. Integer rhoncus, mi ut cursus sodales, nulla ex fringilla mi, id vulputate nulla neque ac mi. Sed volutpat placerat malesuada.\n</pre>\n\n### Handwritten\n\n<pre markdown="1" class="prop prop--handwritten">\nDear John Doe,\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tortor nibh. Maecenas quis placerat purus. Nulla facilisi. Curabitur in ipsum dolor. Nam malesuada magna id lobortis sodales. Pellentesque quis diam ipsum. Nullam laoreet mauris non luctus pellentesque. Aliquam quis malesuada libero, sed mattis turpis. Proin nec mollis justo. Cras sit amet faucibus lacus. Vivamus ac magna tincidunt, suscipit eros in, pellentesque sapien. Integer rhoncus, mi ut cursus sodales, nulla ex fringilla mi, id vulputate nulla neque ac mi. Sed volutpat placerat malesuada.\n\n<p style="float: right;">John Doe</p>\n</pre>\n\n\\page[columns-2]\n\n## Stat Blocks\n\n### Dungeon & Dragons\n\n<pre markdown="1" class="stat-block stat-block--dnd">\n# Animated armor\n*Medium construct, unaligned*\n___\n* **Armor Class 18** (natural armor)\n* **Hit Points 33** (6d8 + 6)\n* **Speed** 25 ft.\n___\n|STR|DEX|CON|INT|WIS|CHA|\n|:-:|:-:|:-:|:-:|:-:|:-:|\n|14 (+2)|11 (+0)|13 (+1)|1 (-5)|3 (-4)|1 (-5)|\n\n___\n* **Damage Immunities** poison, psychic\n* **Condition Immunities** blinded, charmed, deafened, exhaustion, frightened, paralyzed, petrified, poisoned\n* **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 6\n* **Languages** ---\n* **Challenge** 1 (200XP)\n___\n***Antimagic Susceptibility.*** The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constituion saving throw against the caster\'s spell save DC or fall unconscious for 1 minute.\n\n***False Appearance***. While the armor remains motionless, it is indistinguishable from a normal suit of armor.\n\n## Actions\n\n***Multiattack.*** The armor makes two melee attacks.\n\n***Slam.*** *Melee Weapon Attack:* +4 to hit, reach 5ft., one target. *Hit:* 5 (1d6 + 2) bludgeoning damage.\n</pre>\n\n### Call of Cthulhu\n\n<pre markdown="1" class="stat-block stat-block--cthulhu">\n|JOSH WINSCOTT, *damned by his legacy*|\n|-|\n\n||||||\n|-|-|-|-|-|\n|**STR** 00|**CON** 00|**SIZ** 00|**DEX** 00|**INT** 00|\n|**APP** 00|**POW** 00|**EDU** 00|**SAN** 00|**HP** 00|\n|**DB** 0|**Build** 0|**Move** 0|**MP** 00|-|\n\n|*Combat*||\n|-|-|\n|Knife|00% (00/00), damage **0**|\n|Dodge|00% (00/00)|\n\n|*Skills*|\n|-|\n|Climb 00%, Credit Rating 00%, Fast Talk 00%, History 00%, Jump 00%, Library Use 00%, Occult 00%.|\n|**Languages:** English 00%, French 00%.|\n</pre>\n\n```\n```\n\n## Images\n\n### Relative Images\n\n### Absolute Images\n\n### Full Page Images\n\n## Fonts\n\n* Title\n* Headers\n* Note Headers\n* Regular Text\n* Newspaper Headers\n* Newspaper Text\n* Handwriting\n\n## Spacings\n\n### Vertical\n\n> 1cm spacing below.\n>\n> <div style="height: 1cm;"/>\n>\n> Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Themes\n\nCurrently we\'re supporting multiple themes, you can choose between them in the top menu on the right side view.\n',
    currentPageIndex: 0,
    pageBreakIndexes: [],
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPageIndex: state => state.currentPageIndex,
    pageBreakIndexes: state => state.pageBreakIndexes,
    pageCount: state => state.pageBreakIndexes.length
  },

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPageIndex (state, currentPageIndex) {
      state.currentPageIndex = currentPageIndex;
    },
    setPageBreakIndexes (state, pageBreakIndexes) {
      state.pageBreakIndexes = [];
      state.pageBreakIndexes.push(...pageBreakIndexes);
    }
  }
};

export default editor;
