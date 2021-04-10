import JSBI from "jsbi"

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

let shuffleCache: object = {}

// https://github.com/wu-qing-157/Anonymous/blob/3b3f087942ba6bf209cda689b65cce98ab79d61b/app/src/main/java/org/wkfg/anonymous/utils.kt#L300
class randomN {
  // we have to use bigint to handle the random algorithm
  a: JSBI
  b: JSBI = JSBI.BigInt(19260817) // +1s

  constructor(seed: number) {
    this.a = JSBI.BigInt(seed)
  }

  truncate = (t: JSBI) => {
    return JSBI.asIntN(64, t)
  }

  next = () => {
    let t = this.a
    let s = this.b
    this.a = s
    t = this.truncate(JSBI.bitwiseXor(t, JSBI.leftShift(t, JSBI.BigInt(23))))
    t = this.truncate(
      JSBI.bitwiseXor(t, JSBI.signedRightShift(t, JSBI.BigInt(17)))
    )
    t = this.truncate(
      JSBI.bitwiseXor(
        JSBI.bitwiseXor(t, s),
        JSBI.signedRightShift(s, JSBI.BigInt(26))
      )
    )
    this.b = t

    // 9223372036854775807 is the Long.MAX_VALUE in Kotlin
    return JSBI.bitwiseAnd(JSBI.add(s, t), JSBI.BigInt("9223372036854775807"))
  }
}

// https://github.com/wu-qing-157/Anonymous/blob/3b3f087942ba6bf209cda689b65cce98ab79d61b/app/src/main/java/org/wkfg/anonymous/utils.kt#L318
function shuffle(nameList: string[], seed: number) {
  // naive deep copy
  const newList = [...nameList]
  var random = new randomN(seed)
  for (let i = 1; i < newList.length; i++) {
    const j = JSBI.toNumber(JSBI.remainder(random.next(), JSBI.BigInt(i + 1)))
    const t = newList[i]
    newList[i] = newList[j]
    newList[j] = t
  }

  return newList
}

function getMapping(theme: string, seed: number) {
  if (shuffleCache[theme] && shuffleCache[theme][seed]) {
    return shuffleCache[theme][seed]
  }

  let mapping = []
  switch (theme) {
    case "abc": {
      mapping = seed === 0 ? ALICE_AND_BOB : shuffle(ALICE_AND_BOB, seed)
      break
    }
    case "us_president": {
      mapping = seed === 0 ? US_PRESIDENT : shuffle(US_PRESIDENT, seed)
      break
    }
    case "tarot": {
      mapping = seed === 0 ? TAROT : shuffle(TAROT, seed)
      break
    }
  }

  if (!shuffleCache[theme]) shuffleCache[theme] = {}
  shuffleCache[theme][seed] = mapping

  return mapping
}

export function generateName(theme: string, seed: number, id: number) {
  const mapping = getMapping(theme, seed)

  if (mapping.length === 0) {
    return `${id}.?`
  }
  if (id < mapping.length) {
    return mapping[id]
  } else {
    const name = mapping[id % mapping.length]
    const number = Math.floor(id / mapping.length) + 1
    return `${name}.${number}`
  }
}
