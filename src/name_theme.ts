const ALICE_AND_BOB = [
  "Alice",
  "Bob",
  "Carol",
  "Dave",
  "Eve",
  "Forest",
  "George",
  "Harry",
  "Issac",
  "Justin",
  "Kevin",
  "Laura",
  "Mallory",
  "Neal",
  "Oscar",
  "Pat",
  "Quentin",
  "Rose",
  "Steve",
  "Trent",
  "Utopia",
  "Victor",
  "Walter",
  "Xavier",
  "Young",
  "Zoe",
]

const US_PRESIDENT = [
  "Washington",
  "J.Adams",
  "Jefferson",
  "Madison",
  "Monroe",
  "J.Q.Adams",
  "Jackson",
  "Buren",
  "W.H.Harrison",
  "J.Tyler",
  "Polk",
  "Z.Tylor",
  "Fillmore",
  "Pierce",
  "Buchanan",
  "Lincoln",
  "A.Johnson",
  "Grant",
  "Hayes",
  "Garfield",
  "Arthur",
  "Cleveland",
  "B.Harrison",
  "McKinley",
  "T.T.Roosevelt",
  "Taft",
  "Wilson",
  "Harding",
  "Coolidge",
  "Hoover",
  "F.D.Roosevelt",
  "Truman",
  "Eisenhower",
  "Kennedy",
  "L.B.Johnson",
  "Nixon",
  "Ford",
  "Carter",
  "Reagan",
  "G.H.W.Bush",
  "Clinton",
  "G.W.Bush",
  "Obama",
  "Trump",
]

const TAROT = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Justice",
  "The Hermit",
  "Wheel of Fortune",
  "Strength",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
]

export function generateName(theme: string, seed: number, id: number) {
  let mapping = []
  switch (theme) {
    case "abc": {
      mapping = ALICE_AND_BOB
      break
    }
    case "us_president": {
      mapping = US_PRESIDENT
      break
    }
    case "tarot": {
      mapping = TAROT
      break
    }
  }
  if (seed != 0) {
    return "Unknown"
  }
  if (mapping.length === 0) {
    return "Unknown"
  }
  if (id < mapping.length) {
    return mapping[id]
  } else {
    const name = mapping[id % mapping.length]
    const number = Math.floor(id / mapping.length) + 1
    return `${name}.${number}`
  }
}
