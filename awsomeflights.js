var airportlist = {};
airportlistfill = [];

function getcityfromcode(code) {
    for (var key in airportlist) {
        if (airportlist[key]['code'] == code)
            return airportlist[key]['city'];
    }
}

function getcodefromcity(city) {
    for (var key in airportlist) {
        if (airportlist[key]['city'] == city)
            return airportlist[key]['code'];
    }
}

$(function () {
    //Initialize the city/IATA mapping
 

    $.post("https://YOUR-API-GATEWAY-ENDPOINT/production/airportlist",
        function (data, status) {
            //console.log("Data: " + data + "\nStatus: " + status);
            airportlist = data;
            //for (key in data) {
            //    airportlistfill.push( data[key]['city'] );
            //}
            //$( "#orig" ).autocomplete({
            //    lookup: data,
            //    minChars: 3,
            //});
    });    

    //Event of Search
    $("#search").click(function () {
        //Empty any previous results
        $("#results").empty();

        //Get the values of orig and dest
        var orig = $('#orig').val();
        var dest = $('#dest').val();

        if ( (orig == "") || (dest == "") || (orig == dest) ) {
            alert("Woops... are you sure the date entered is correct?");
            return;
        } 
        console.log("Search invoked with values orig:" + orig + " dest:" + dest);
        $.post("https://YOUR-API-GATEWAY-ENDPOINT/production/routefinder?orig="+orig+"&dest="+dest,
            {
                orig: orig,
                dest: dest
            },
            function (data, status) {
                console.log("Data: " + data + "\nStatus: " + status);
                
                // Fill #results with cols of trips
                if (jQuery.isEmptyObject(data)) {
                    data[0] = "No flights found";
                    alert("No flights found for these cities");
                }
                else {
                    for (var key in data) {
                        htmltoappend = "<div class=col><div class='card-deck'>";
                        for (var key2 in data[key]) {

                            htmltoappend += `                                
                                <div class="card" style="width: 18rem;">
                                  <img class="card-img-top" src="city.jpg" alt="City">
                                  <div class="card-body">
                                    <h5 class="card-title">`+ getcityfromcode(data[key][key2]) +`</h5>
                                  </div>
                                </div>`                             
                        }
                       
                        htmltoappend += `
                            <div class="card" style="width: 18rem;">
                              <div class="card-body">
                                <h5 class="card-title">Love this trip?</h5>
                                <p class="card-text">Let's fly</p>
                                <button type="button" class="btn btn-success">Book it!</button>
                              </div>
                            </div>`
                        htmltoappend += "</div></div><div class='w - 100'><br/>";
                        var appendEl = $(htmltoappend).appendTo("#results");                        
                    }
                    
                }
        });
    });

});
