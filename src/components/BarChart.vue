<template>
  <div>BarChart</div>
  <apexchart :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    required: true
  }
})

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: '1000px',
    stacked: true,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      endingShape: 'rounded'
    }
  },
  legend: {
    show: false
  },
  grid: {
    borderColor: '#343435',
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'diagonal2',
      shadeIntensity: 0.5,
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: []
    }
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: '16px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: false,
    width: 1,
    colors: ['#343435']
  },
  xaxis: {
    categories: ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: false
    },
    tooltip: {
      show: false
    },
    labels: {
      show: false
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      show: false
    },
    labels: {
      show: true,
      style: {
        fontSize: '16px',
        colors: ['#fff']
      }
    }
  }
})

const series = ref(props.series)
</script>
