function buildMetadata(sample) {
  console.log("Hello")

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
    d3.json("/metadata/" + sample).then((bbreport)=> {
    
  // Use `.html("") to clear any existing metadata
    var sample_metaData = d3.select("#sample-metadata");
    d3.select("#sample-metadata").html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(bbreport).forEach(([key, value])=> {
      console.log(key, value)
      sample_metaData.append("p")
        .text([key,value]);
     });
    console.log(bbreport)
   });
   
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((sampleReport)=> {
    const sample_values = sampleReport.sample_values;
    const otu_ids = sampleReport.otu_ids;
    const otu_labels = sampleReport.otu_labels;
  
    // @TODO: Build a Bubble Chart using the sample data
    // var data = sampleReport
    var bubble_chart_layout = {
      x : otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers", 
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Blackbody"
      }
    };
    var data = [bubble_chart_layout];
    let layout = {
      xaxis:{title: "Otu ID"}
    };
    
    Plotly.newPlot("bubble",data, layout );

    // @TODO: Build a Pie Chart

      var pie_chart =[{
        values: sample_values.slice(0,9),
        labels: otu_ids.slice(0,9),
        type:"pie",
      }
      ];
      let pieLayout = {
        margin: { t: 0, l: 0 }
      };
      Plotly.plot("pie", pie_chart, pieLayout);
  })
  };
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();