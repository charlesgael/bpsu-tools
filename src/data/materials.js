import materials from './materials.json'

export default materials
  .filter(it => !it.ignored)
  .toSorted((a, b) => a.id.localeCompare(b.id))
