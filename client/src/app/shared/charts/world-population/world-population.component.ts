import { Component, OnInit } from '@angular/core'
import * as Highcharts from 'highcharts'
import HC_exporting from 'highcharts/modules/exporting'

@Component({
  selector: 'app-world-population-chart',
  templateUrl: './world-population.component.html',
  styleUrls: ['./world-population.component.scss']
})
export class WorldPopulationComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts
  chartOptions: Highcharts.Options = {}

  constructor () { }

  ngOnInit (): void {
    this.buildChart()
    HC_exporting(Highcharts)

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }


  buildChart (): void {
    this.chartOptions = {
      chart: {
        type: 'area',
        events: {
          render: function () {
            this.reflow()
          }
        }
      },
      title: {
        text: 'Historic and Estimated Worldwide Population Growth by Region'
      },
      subtitle: {
        text: 'Source: Wikipedia.org'
      },
      xAxis: {
        categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
        tickmarkPlacement: 'on'
      },
      yAxis: {
        title: {
          text: 'Billions'
        },
        labels: {
          formatter: function () {
            return (+this.value / 1000).toString()
          }
        }
      },
      exporting: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ' millions'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        }
      },
      series: [{
        name: 'Asia',
        data: [502, 635, 809, 947, 1402, 3634, 5268],
        type: 'area'
      }, {
        name: 'Africa',
        data: [106, 107, 111, 133, 221, 767, 1766],
        type: 'area'
      }, {
        name: 'Europe',
        data: [163, 203, 276, 408, 547, 729, 628],
        type: 'area'
      }, {
        name: 'America',
        data: [18, 31, 54, 156, 339, 818, 1201],
        type: 'area'
      }, {
        name: 'Oceania',
        data: [2, 2, 2, 6, 13, 30, 46],
        type: 'area'
      }]
    }
  }

}
