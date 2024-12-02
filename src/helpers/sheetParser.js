import PublicGoogleSheetsParser from 'public-google-sheets-parser'

export default class sheetParser {
  sheetId = null
  constructor(sheetId) {
    this.sheetId = sheetId
  }

  parser = null
  loadParser() {
    this.parser = new PublicGoogleSheetsParser(this.sheetId)
  }

  async getSheetData() {
    this.loadParser()
    return await this.parser.parse()
  }

  nonDamageKeys = ['is_hit', 'is_crit', 'source', 'turn', 'try']

  async getFormattedSheetData() {
    const data = await this.getSheetData()
    let result = []

    let currentTry = 0
    let currentTurn = 0

    for (let i = 0; i < data.length; i++) {
      const el = data[i]

      if (el.try !== undefined) {
        if (result[currentTry] !== undefined) {
          result[currentTry].turns = result[currentTry].turns.filter((item) => {
            return item
          })
        }
        result[el.try] = {
          try: el.try,
          turns: []
        }
        currentTry = el.try
      } else if (el.turn !== undefined) {
        result[currentTry].turns[el.turn] = {
          turn: el.turn,
          hits: []
        }
        currentTurn = el.turn
      } else {
        const instances = []

        for (const key in el) {
          if (!key) continue
          if (this.nonDamageKeys.includes(key)) continue
          if (Object.prototype.hasOwnProperty.call(el, key)) {
            const value = el[key]

            instances.push({
              damage_type: key,
              damage: value
            })
          }
        }

        result[currentTry].turns[currentTurn].hits.push({
          is_hit: el.is_hit,
          is_critical: el.is_crit,
          source: el.source,
          instances: instances
        })
      }

      if (data[i + 1] === undefined || data[i + 1].try !== undefined) {
        result[currentTry].turns = result[currentTry].turns.filter((item) => {
          return item
        })
      }
    }

    result = result.filter((item) => {
      return item
    })

    return result
  }
}
