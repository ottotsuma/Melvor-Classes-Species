export const classList = {
    // Generally should be "Team" not "Self"
    Mage: {
      name: "Mage",
      stats: {
        magic: 1,
      },
      team: "Magic +1.",
  
      images: [
        "https://ottotsuma.github.io/images/people/b5185cca016eecd75b62833fdf2cfc43.jpg",
      ],
      notes:
        "Solve all your problems with magic. Mages are the basic class for magical classes.",
      tier: "normal",
      description: "Solve all your problems with magic. Mages are the basic class for magical classes.",
    },
    Fighter: {
      stats: {
        strength: 1,
      },
      team: "Strength +1.",
  
      images: [
        "https://ottotsuma.github.io/images/people/f7327f5068dcdd7e858b87e1da393c62.jpg",
      ],
      notes: "Fighters are the base class for physical classes.",
      tier: "normal",
    },
    Rogue: {
      stats: {
        dexterity: 1,
      },
      team: "Dexterity +1.",
  
      images: [
        "https://ottotsuma.github.io/images/people/0156c7576b1704ee70a55e4d1bd0db74.jpg",
      ],
      notes: `What doesn't kill you makes you stronger. Combine with beast souls to gain their power.`,
      tier: "normal",
    },
    Kʼawiil: {
      stats: {},
      team: "",
      notes: "lightning, serpents, fertility and maize",
      tier: "legendary",
      description: ""
    },
    Necromancer: {
      name: "Necromancer",
      stats: {},
      team: "Undead slowly passively heal within range of the Necromancer.",
      images: [
        "https://ottotsuma.github.io/images/people/necro.jpg",
        "https://ottotsuma.github.io/images/people/oldmage.jpg",
      ],
      notes: "",
      tier: "normal",
      description: "A Mage who supposed practice of communicating with the dead, especially in order to predict the future. History dose repeat itself, but most Necromancers just end up commanding hoards of undead into battle rather then winning the lottery.",
    },
    "Shield Warrior": {
      stats: {
        "Shield Skills": "+1",
      },
      team: "",
      images: [],
      notes: "",
      tier: "",
      description: "",
    },
    Warrior: {
      stats: {},
  
      team: "Stamina +10%.",
      notes: "",
      tier: "normal",
      images: [],
      description: "",
    },
    "Guardian Knight": {
      stats: {},
      team: "3% of all damage is re-directed to the Guardian Knight within 10m, up to 7 allies.",
      images: [],
      description: "",
      notes: "",
      tier: "",
    },
    Berserker: {
      stats: {},
      self: "Strength increases as health decreases.",
      team: "",
      notes: "",
      images: [],
      description: "",
      tier: "",
    },
    Cursemancer: {
      stats: {},
      team: "Aggro skills are slightly more effective.",
  
      images: [],
      description: "",
      notes: "Can curse up a storm of colorful language.",
      tier: "",
    },
    Witch: {
      stats: {},
      team: "The more witches in your team, the stronger Coven spells become.",
      images: ["https://ottotsuma.github.io/images/people/witch6.jpg"],
      notes: "",
      tier: "",
      description: "",
    },
    Summoner: {
      stats: {},
      team: "Summon maintain cost is reduced.",
      self: "Summon Eidolon Spell +1 (MAX: 10).",
      description: "",
      notes: "",
      images: [],
      tier: "normal",
    },
    Paladin: {
      name: "Paladin",
      team: "Unholy protection, unholy attacks deal 3% less.",
      self: "Can use holy objects, cannot use unholy objects.",
      description: "",
      notes: "",
      images: [],
      tier: "normal",
      stats: {},
      InnateSkills: ['Holy Practitioner'],
    },
    "Fallen Paladin": {
      name: "Fallen Paladin",
      team: "Your God has forsaken you, your previous God will not watch over your team.",
      description: "",
      notes: "",
      images: [],
      tier: "normal",
      stats: {
        "Physical Damage Reduction": 1,
      },
      InnateSkills: ['Fallen Paladin'],
    },
    Guardian: {
      name: "Guardian",
      stats: {},
      team: "",
  
      images: [],
      notes: "",
      tier: "normal",
      description: "",
    },
    Knight: {
      name: "Knight",
      stats: {},
      team: "Test",
  
      images: [],
      notes: "",
      tier: "normal",
      description: "Test description",
    },
    Pyromancer: {
      stats: {},
      team: "Fire spells cost 5% less.",
  
      images: [],
      description: "",
      notes: "",
      tier: "normal",
    },
    Battlemage: {
      stats: {
        strength: 1,
        magic: 1,
      },
      team: "",
  
      images: [],
      description: "",
      notes: "",
      tier: "normal",
    },
    Scout: {
      stats: {
        sense: 2,
      },
      team: "Sense +1.",
      images: [],
      description: "",
      notes: "",
      tier: "normal",
    },
    Thief: {
      stats: {
        dexterity: 1,
      },
      team: "",
      images: [],
      description: "",
      notes: "",
      tier: "normal",
    },
    Assassin: {
      stats: {},
      team: "Damage from sneak attacks is increased.",
  
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    "Knight Commander": {
      stats: {},
      team: "Commanded units HP is increased.",
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    Pirate: {
      stats: {},
      team: "🏴‍☠️ Swimming +5% movement speed.",
      images: ["https://ottotsuma.github.io/images/people/f93a36fab2810f29163626fd22075750.jpg", "https://ottotsuma.github.io/images/ships/66ac653f7b03e727d39d9072dfb79887.jpg"], // 8169a4b7ab02aa720cafb7b0ea803385, 2db7f9e0803d4d7f5a77990ae3115354
      description: "",
      notes: "",
      tier: "rare",
    },
    Witchdoctor: {
      stats: {},
      team: "",
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    Priest: {
      stats: {},
      team: "",
      self: "Can use holy objects, cannot use unholy objects",
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    Inquisitor: {
      stats: {},
      team: "",
      self: "Can use holy objects, cannot use unholy objects",
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    Darkknight: {
      stats: {},
      team: "",
      self: "Cannot use holy objects, can use unholy objects",
      images: [],
      description: "",
      notes: "",
      tier: "rare",
    },
    Viking: {
      stats: {},
      team: "",
      self: "Swimming +5% movement speed.",
      images: [],
      description: "",
      notes: "",
      tier: "epic",
    },
    "Blood Warrior": {
      stats: {},
      team: "",
      self: "Access to blood skills.",
      images: [],
      description: "",
      notes: "",
      tier: "epic",
    },
    Deathknight: {
      stats: {},
      team: "",
  
      images: [],
      description: "",
      notes: "",
      tier: "epic",
    },
    King: {
      stats: {
        HP: "*2",
        MP: "*1.5",
        Vitality: "*1.10",
        Endurance: "*1.10",
        Willpower: "*1.10",
        Magic: "*1.10",
        Strength: "*1.10",
        Dexterity: "*1.10",
        Sense: "*1.10",
        Charisma: "*1.10",
      },
      team: "",
      self: "All Stats + 10%, HP + 100%, MP + 50%, movement speed -10%.",
      images: ["https://ottotsuma.github.io/images/people/king.jpg"],
      notes: "Born to rule.",
      tier: "legendary",
    },
    Demiurge: {
      stats: {},
      team: "+1 to the main stat of crafted items",
  
      images: [],
      description: "",
      notes: "",
      tier: "legendary",
    },
    Pope: {
      stats: {},
      team: "",
  
      images: [],
      description: "",
      notes: "",
      tier: "unique",
    },
    "Phoenix-Warrior": {
      stats: {
        magic: 2,
        willpower: 2,
        HPMultiplier: -0.1,
        MPMultiplier: 1.1,
      },
      team: "Fire Resistance +1%",
  
      images: [
        "https://images.squarespace-cdn.com/content/v1/57d34a6d725e254062172fe9/1579643445519-XXWBWFTZIZ23TNWBECJI/thumbnail_phoenix+rising.jpg",
      ],
      notes:
        "phenix is a long-lived bird that is cyclically regenerated or reborn.",
      tier: "epic",
    },
    Druid: {
      name: "Druid",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "rare",
      description: "",
    },
    Swordsmen: {
      name: "Swordsmen",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    magician: {
      name: "magician",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    merchant: {
      name: "merchant",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    thief: {
      name: "thief",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    archer: {
      name: "archer",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    bowman: {
      name: "bowman",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    acolyte: {
      name: "acolyte",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Crusader: {
      name: "Crusader",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Wizard: {
      name: "Wizard",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Sage: {
      name: "Sage",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Blacksmith: {
      name: "Blacksmith",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Whitesmith: {
      name: "Whitesmith",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Alchemist: {
      name: "Alchemist",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Stalker: {
      name: "Stalker",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Hunter: {
      name: "Hunter",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Sniper: {
      name: "Sniper",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Bard: {
      name: "Bard",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Dancer: {
      name: "Dancer",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Clown: {
      name: "Clown",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Monk: {
      name: "Monk",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Champion: {
      name: "Champion",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Barbarian: {
      name: "Barbarian",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Spearman: {
      name: "Spearman",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Cleric: {
      name: "Cleric",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Sorcerer: {
      name: "Sorcerer",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Cavalier: {
      name: "Cavalier",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Oracle: {
      name: "Oracle",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Ranger: {
      name: "Ranger",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Brawler: {
      name: "Brawler",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    }, 
    Magnus: {
      name: "Magnus",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    }, 
    Archaist: {
      name: "Archaist",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    }, 
    Samurai: {
      name: "Samurai",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    }, 
    Ninja: {
      name: "Ninja",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    }, 
    Gunslinger: {
      name: "Gunslinger",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Dragoon: {
      name: "Dragoon",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Scholar: {
      name: "Scholar",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    "Demon Hunter": {
      name: "Demon Hunter",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Swashbuckler: {
      name: "Swashbuckler",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Occultist: {
      name: "Occultist",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Spiritualist: {
      name: "Spiritualist",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Shaman: {
      name: "Shaman",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Skald: {
      name: "Skald",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    Slayer: {
      name: "Slayer",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    zealot: {
      name: "Zealot",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    "Tentacle Summoner": {
      name: "Zealot",
      stats: {
        charisma: -3
      },
      team: "Charisma -3.",
      images: [
        "",
      ],
      notes:
        "",
      tier: "epic",
      description: "An atypical summoner who focuses on a single type of summon, tentacles. Unlike the usual kind found attached to monsters or sea creatures of the world the tentacles summoned by this summoner has no greater body to which it attaches to.",
    },
    "Witcher": {
      name: "Witcher",
      stats: {
        strength: +1,
        dexterity: +1
      },
      team: "Potions are 5% more effective.",
      images: [
        "",
      ],
      notes:
        "",
      tier: "epic",
      description: "A male monster hunter. It is a local name given to men who can use magic like witches.",
    },
    "Esper": {
      name: "Esper",
      stats: {
      },
      team: "",
      images: [
        "",
      ],
      notes:
        "",
      tier: "normal",
      description: "",
    },
    // Reiki-elar -  improving the flow of energy around the body can speed healing.
  };