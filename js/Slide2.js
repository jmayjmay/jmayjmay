var DislkesLikes={
    display: async function() {

        d3.select("#DislkesLikes").selectAll("#categoryDiv2").remove();
        d3.select("#DislkesLikes").selectAll("#categoryButton2").remove();
        d3.select("#DislkesLikes").selectAll("svg").remove();

        var margin = {top: 30, right: 50, bottom: 30, left: 80};
        var width = 800;
        var height = 500;

        var data = await d3.csv("https://jmayjmay.github.io/data/USvideos_processed.csv");
        const parseDate = d3.timeParse("%Y-%m-%d");
        data.forEach(function(d) { d.date = parseDate(d.dates); });
        var data = data.filter(function(d) { return d.date.getMonth() === 8; });

        var category_name = data.map(rec => rec["category_name"]);
        category_name = [...new Set(category_name)].sort();
        var title = data.map(rec => rec["title"]);
        var channel_title = data.map(rec => rec["channel_title"]);
        //var startDate = new Date('2023-09-12'); 
        //var endDate = new Date('2023-10-01'); 
        //var dates = data.map(d => new Date(d.dates));
        //var xdates = d3.scaleTime().domain([startDate,endDate]).range([0,400]);
        //var xDates = dates.map(value => xdates(value));
        var colorScale = d3.scaleOrdinal().domain(category_name)
        .range(["#c49c94", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5"]);

        d3.select("#DislkesLikes").append("div")
            .attr("id", "categoryDiv2")
            .append("label")
            .text("Select a Category: ")
            .attr("style", "font-size:15px;font-family:Arial;font-weight: bold;color:#2C5F2D;");         
        d3.select("#DislkesLikes")
            .select("#categoryDiv2")
            .append("select")
            .attr("id", "categoryButton2")
            .selectAll("myOptions")
            .data(category_name)
            .enter().append("option")
            .text(function (d) { return d; })
            .attr("value", function(d) { return d; })
        d3.select("#categoryButton2")
            .style("background-color", "#FFFDD0")
            .on("change", function(d) {
            var selectedCategory = d3.select(this).property("value");
            refreshChart(selectedCategory );
        })

       // var dates = data.map(d => new Date(d.dates));
        //var xdate = d3.scaleTime().domain([startDate,endDate]).range([0,width]);
        //const xdates = dates.map(value => xdate(value));
        
        var likes = data.map(d => +d.likes);
        var xlikes= d3.scaleLinear().domain(d3.extent(likes)).range([0, width]);
        
        var dislikes = data.map(d => +d.dislikes);
        var ydislikes= d3.scaleLinear().domain(d3.extent(dislikes)).range([height, 0]);

        var svg = d3.select("#DislkesLikes").append("svg")
            .attr("width", width + 4*margin.left)
            .attr("height", height + 2*margin.bottom);
        var circles = svg.append("g")
            .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xlikes(d.likes); })
            .attr("cy", function(d) { return ydislikes(d.dislikes); })
            .attr("r", 4) //;
            .attr("fill", function(d) { return colorScale(d.category_name); })
            .on("mouseover", dv_onMouseOver)
            .on("mouseout", dv_OnMouseOut);

        const yAxis = d3.axisLeft(ydislikes);
        const xAxis = d3.axisBottom(xlikes);
        d3.select("svg").append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis)
        d3.select("svg").append("g")
            .attr("transform","translate(" + margin.left + "," + (margin.top + height) + ")")
            .call(xAxis)
        //refreshChart("comedy");   

//============================================= Legend Box ========================================================
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + ( width + margin.left + 10 ) + "," + margin.top + ")")
        var legendBoxSize = 18;
        var legendSpacing = 6;
        var legendItems = legend.selectAll(".legend-item")
            .data(category_name)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", function(d, i) { return "translate(0," + (i * (legendBoxSize + legendSpacing )) + ")"; });
        legendItems.append("rect")
            .attr("width", legendBoxSize)
            .attr("height", legendBoxSize)
            .style("fill", colorScale );
        legendItems.append("text")
            .attr("x", legendBoxSize + legendSpacing )
            .attr("y", legendBoxSize / 2)
            .attr("dy", "0.35em")
            .text(function(d) { return d; });

//=====================================================================================================

        function refreshChart(category) {
        d3.select("#DislkesLikes").selectAll("svg").remove();
        d3.select("#DislkesLikes").selectAll("g").remove();
    
        var unfilteredData = data;
        var filteredData = data.filter(d => d.category_name === category);

        var svg = d3.select("#DislkesLikes").append("svg")
            .attr("width", width + 4*margin.left)
            .attr("height", height + 2*margin.bottom);
        
        //var dates = filteredData.map(d => new Date(d.dates));
        //var xdate = d3.scaleTime().domain([startDate,endDate]).range([0,width]);
        //const xdates = dates.map(value => xdate(value));

        var likes = data.map(d => +d.likes);
        var xlikes= d3.scaleLinear().domain(d3.extent(likes)).range([0,width]);
        
        var dislikes = filteredData.map(d => +d.dislikes);
        var alldislikes = unfilteredData.map(d => +d.dislikes);
        var ydislikes= d3.scaleLinear().domain(d3.extent(alldislikes)).range([height, 0]);

        svg.append("g")
            .attr("transform","translate(50,50)")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xlikes(d.likes); })
            .attr("cy", function(d) { return ydislikes(d.dislikes); })
            .attr("r", 4 )
            .attr("fill", function(d) { return colorScale(d.category_name); })
            .on("mouseover", dv_onMouseOver)
            .on("mouseout", dv_OnMouseOut);

        const yAxis = d3.axisLeft(ydislikes);
        const xAxis = d3.axisBottom(xlikes);    
        d3.select("svg").append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .call(yAxis)
        d3.select("svg").append("g")
            .attr("transform","translate(" + margin.left + "," + (margin.top + height) + ")")
            .call(xAxis)


//============================================= Legend Box ========================================================
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + ( width + margin.left + 10 ) + "," + margin.top + ")")
        var legendBoxSize = 18;
        var legendSpacing = 6;
        var legendItems = legend.selectAll(".legend-item")
            .data(category_name)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", function(d, i) { return "translate(0," + (i * (legendBoxSize + legendSpacing )) + ")"; });
        legendItems.append("rect")
            .attr("width", legendBoxSize)
            .attr("height", legendBoxSize)
            .style("fill", colorScale );
        legendItems.append("text")
            .attr("x", legendBoxSize + legendSpacing )
            .attr("y", legendBoxSize / 2)
            .attr("dy", "0.35em")
            .text(function(d) { return d; });
//=====================================================================================================

//============================================= Annotation Code ========================================================
            const type = d3.annotationCalloutElbow
            const Slide1annotations = [{
                note: {
                  label: "Date: 9/22/2023 \nViews: 41,500,672 \nLikes: 2,010,366 \nDislikes: 78,076",
                  bgPadding: 20,
                  title: "Baseline Video DNA by BTS",
                  wrapSplitter: "\n" 
                },
                x:width+margin.left,
                y:height-margin.bottom*4+28,
                dy:-margin.left,
                dx:-20,
              },
                {
                    note: {
                      label: "Disikes vs. Likes",
                      bgPadding: 20,
                      title: "Trending Videos",
                    },
                      x:0,
                      y:0,
                      dx:450,
                      dy:10,
                  }]
            const makeAnnotations = d3.annotation()
                .editMode(true)
                .notePadding(15)
                .type(type)
                .annotations(Slide1annotations)
            svg.append("g")
                .attr("id", "annotation1")
                .attr("class", "Slide1annotations")
                .call(makeAnnotations)
//=====================================================================================================
        }

      
        var dv_tooltip = d3.select("#DislkesLikes")
            .append("div")
            .attr("class", "tooltip")
            .style("display", "none");
        function dv_onMouseOver() {
            d3.select(this)
            .attr("r", 6)
            .style("fill", "#B2071D")
            .transition()
            .duration(200)
            .style("opacity", 1.85);
            var d = d3.select(this).data()[0]
            var html = "<span style = 'font-size:12px;font-family:Arial;font-weight: bold;color:#000000'><b> Title: </b>" + d.title + "</span></br>" +
            "<span style = 'font-size:12px;font-family:Arial;font-weight: bold;color:#000000'><b> Channel: </b>" + d.channel_title + "</span></br>" +
            "<span style = 'font-size:12px;font-family:Arial;font-weight: bold;color:#000000'><b> Date: </b>" + d.dates + "</span></br>";
            dv_tooltip
            .style("display", "inline")
            .html(html)
            .style("position", "absolute")
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY + 10) + 'px')
            .style("width", 100)
            .style("height", 80)
            .style("background", function(){ return("white"); });            
        }
        function dv_OnMouseOut() {
            d3.select(this).attr("r", 4).style("fill", function(d) { return colorScale(d.category_name); } );
            dv_tooltip.style("display", "none")
        }

//============================================= Annotation Code ========================================================
        const type = d3.annotationCalloutElbow
        const Slide1annotations = [{
          note: {
            label: "Date: 9/22/2023 \nViews: 41,500,672 \nLikes: 2,010,366 \nDislikes: 78,076",
            bgPadding: 20,
            title: "Baseline Video DNA by BTS",
            wrapSplitter: "\n" 
          },
            x:width+margin.left,
            y:height-margin.bottom*4+28,
            dy:-margin.left,
            dx:-20,
        },
        {
            note: {
              label: "Disikes vs. Likes",
              bgPadding: 20,
              title: "Trending Videos",
            },
              x:0,
              y:0,
              dx:450,
              dy:10,
          }]
        const makeAnnotations = d3.annotation()
          .editMode(true)
          .notePadding(15)
          .type(type)
          .annotations(Slide1annotations)
        svg.append("g")
        .attr("id", "annotation1")
        .attr("class", "Slide1annotations")
        //.attr("class", "fader")
        .call(makeAnnotations)
//=====================================================================================================
    }

}