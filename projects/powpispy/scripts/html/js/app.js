//
// License: CC0
//

// Mostly taken from uPlot example:
// https://github.com/leeoniya/uPlot/blob/master/bench/uPlot.html
//

function makeChart(data) {

  const opts = {
    title: "powpispy",
    width: 1000,
    height: 600,
    //cursor: { x: false, y: false, },
    series: [
      {},
      {
        label: "Voltage",
        scale: "V",
        value: (u, v) => v == null ? "-" : v.toFixed(1) + "V",
        stroke: "green",
        width: 1/devicePixelRatio,
      },
      {
        label: "Current",
        scale: "mA",
        value: (u, v) => v == null ? "-" : v.toFixed(1) + "mA",
        stroke: "blue",
        width: 1/devicePixelRatio,
      },
      {
        label: "Power",
        scale: "mW",
        value: (u, v) => v == null ? "-" : v.toFixed(2) + " mW",
        stroke: "red",
        width: 1/devicePixelRatio,
      }
    ],
    axes: [
      {},
      {
        scale: "V",
        values: (u, vals, space) => vals.map(v => +v.toFixed(1) + "V"),
      },
      {
        side: 1,
        scale: "mA",
        values: (u, vals, space) => vals.map(v => +v.toFixed(2) + "mA"),
        grid: {show: false},
      },
      {
        scale: "mW",
        values: (u, vals, space) => vals.map(v => +v.toFixed(2) + " mW"),
        grid: {show: false},
      },
    ],
  };

  let uplot = new uPlot(opts, data, document.body);
}

fetch("ina260.log").then(r => r.text() ).then(dat => {
  s = "[" + dat.trim("\n").split("\n").join(",") + "]";
  var d = JSON.parse(s);

  let uplot_data = [ [], [], [], [] ];
  for (let ii=0; ii<d.length; ii++) {

    uplot_data[0].push(d[ii].s);
    uplot_data[1].push(d[ii].voltage);
    uplot_data[2].push(d[ii].current_ma);
    uplot_data[3].push(d[ii].power_mw);
  }

  setTimeout(() => makeChart(uplot_data), 0);
});

