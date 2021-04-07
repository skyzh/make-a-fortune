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

export function generateName(theme: string, seed: number, id: number) {
  let mapping = []
  switch (theme) {
    case "abc": {
      mapping = ALICE_AND_BOB
    }
  }
  if (mapping.length == 0) {
    return "Unknown"
  }
  if (id < mapping.length) {
    return mapping[id]
  } else {
    return `${mapping[id % mapping.length]}.${
      Math.floor(id / mapping.length) + 1
    }`
  }
}
