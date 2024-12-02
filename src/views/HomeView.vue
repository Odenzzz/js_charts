<template>
  <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px]">
    <BarChart :series="series" />
  </div>
  <button class="border inline-block px-4 py-2" @click="nextHit">Next hit</button>
  <button class="border inline-block px-4 py-2" @click="runFull">Run full</button>
</template>

<script>
import BarChart from '@/components/BarChart.vue'
import barbarianMeleeData from '@/static/1_turn/barbarian-melee.json'
import _ from 'lodash'
import colors from '@/static/colors.json'
import sheetParser from '@/helpers/sheetParser'

export default {
  components: {
    BarChart
  },
  data() {
    return {
      rawData: null,
      try: 0,
      turn: 0,
      hit: 0,
      series: [],
      canDoNextTry: true
    }
  },
  async mounted() {
    // const id = '1ZHKjjP6LKSuRxbiC6iVbT59jBfNe9PZuZ9Y48N0W1Uk' // assasin
    // const id = '16Ibkc1as8Lw_VIEM7HEPafxfN7dPaHfRXgEPw0j2HDs' // thief
    // const id = '1d-2FMBWXBcbAEKhVMNpWM8fdnFcrxvZICu9VGXnrxfE' // паладин месть
    const id = '1q2sOtVzDPzPAOMLE84TBy6ShE3jqoDpmrdFm7HZqzjA' // паладин древний

    const parser = new sheetParser(id)
    this.rawData = await parser.getFormattedSheetData()

    this.startNextTry()
    this.runFull()
  },
  computed: {
    currentTry() {
      return _.find(this.rawData, (item) => {
        return item.try === this.try
      })
    },
    currentTurn() {
      return _.find(this.currentTry.turns, (item) => {
        return item.turn === this.turn
      })
    }
  },
  methods: {
    startNextTry() {
      if (this.try < this.rawData.length) {
        console.log('')
        console.log('=========== starting next try ===========')
        console.log('')

        this.try++
        this.turn = 1
        this.hit = 0
      } else {
        this.canDoNextTry = false
      }
    },
    startNextTurn() {
      if (this.turn === this.currentTry.turns.length) {
        this.startNextTry()
      } else {
        console.log('---------')
        console.log('starting next round')
        console.log('---------')

        this.turn++
        this.hit = 0
      }
    },
    nextHit() {
      const hitData = this.currentTurn.hits[this.hit]

      if (!hitData) {
        return this.startNextTurn()
      }

      let hitString = `${hitData.source} hits${hitData.is_critical ? ' CRITICAL' : ''} (`

      for (let i = 0; i < hitData.instances.length; i++) {
        const instance = hitData.instances[i]

        const damageKey = `${hitData.source}-${instance.damage_type}-${this.hit}`

        const seriesInstanceKey = this.series.findIndex((item) => {
          return item.name === damageKey
        })

        hitString += `${instance.damage_type}: ${instance.damage}, `

        const damage = hitData.is_hit ? instance.damage : 0

        if (seriesInstanceKey === -1) {
          this.series.push({
            name: damageKey,
            data: [damage],
            color: colors.damage_types[instance.damage_type]
          })
        } else {
          this.series[seriesInstanceKey].data.push(damage)
        }
      }

      hitString += ')'

      if (!hitData.is_hit) {
        hitString = 'MISS'
      }

      console.log(hitString)
      this.hit++
    },
    runFull() {
      // while (this.canDoNextTry) {
      //   this.nextHit()
      // }
      const interval = setInterval(() => {
        if (!this.canDoNextTry) {
          clearInterval(interval)
        } else {
          this.nextHit()
        }
      }, 1000)
    }
  }
}
</script>
