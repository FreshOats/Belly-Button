function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;

    // console.log(samples);
    // // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // console.log(resultArray);

    // //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];
    // console.log(result);

    // // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // // 7. Create the yticks for the bar chart.
    // // Hint: Get the the top 10 otu_ids and map them in descending order  
    // //  so the otu_ids with the most bacteria are last. 

    let topTenOtus = otuIds.slice(0, 10);
    let topTenNames = topTenOtus.map(id => "OTU " + String(id) + "  ").reverse();
    let topSamples = sampleValues.slice(0, 10).reverse();
    let topLabels = otuLabels.slice(0, 10).reverse();


    console.log(topTenNames);

    // // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: topSamples,
      y: topTenNames,
      orientation: 'h',
      type: "bar",
      text: topLabels,
      font: { size: 18 }
    };

    barData = [barTrace];
    
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: { text: "Top Ten Bacterial Cultures", font: { size: 22} }, 
      margin: {
        l: 100,
        r: 50,
        t: 100,
        b: 50
      },
      // width: 500,
      // height: 600
    };
    // // // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar", barData, barLayout);

    
    // Start The Bubble Chart Here

    // 1. Create the trace for the bubble chart.
    
    
    
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers', 
      marker: {
        colorscale: [
          [0.000, "rgb(68, 1, 84)"],
          [0.111, "rgb(72, 40, 120)"],
          [0.222, "rgb(62, 74, 137)"],
          [0.333, "rgb(49, 104, 142)"],
          [0.444, "rgb(38, 130, 142)"],
          [0.556, "rgb(31, 158, 137)"],
          [0.667, "rgb(53, 183, 121)"],
          [0.778, "rgb(109, 205, 89)"],
          [0.889, "rgb(180, 222, 44)"],
          [1.000, "rgb(253, 231, 37)"]
        ],
        color: otuIds,
        size: sampleValues
      }

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: "Bacterial Cultures per Sample", font: { size: 20 } },
      xaxis: { title: "OTU ID" , font: {size: 18}},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
    

    // 4. Create the trace for the gauge chart.
    // let metadata = data.metadata;
    let metaFiltered = parseFloat(data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq);
  
    
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size: 20}},
      type: "indicator",
      mode: "gauge+number",
      value: metaFiltered, 
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: 'black' },
        steps: [
          { range: [0, 2], color: 'red' },
          { range: [2, 4], color: 'darkorange' },
          { range: [4, 6], color: 'gold' },
          { range: [6, 8], color: 'forestgreen' },
          { range: [8, 10], color: 'darkgreen' }
        ]
      }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "Belly Button Washing Frequency",
      font: { size: 16 },
      // width: 500,
      // height: 500, 
      margins: {
        l: 25,
        r: 25,
        t: 100,
        b: 100
      }
      

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });

}
