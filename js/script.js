$(document).ready(function(){

    // var feedurl = "http://copyright.rip/tt-rss/public.php?op=rss&id=-4&key=etmeym5967f41ec0935&format=json&limit=1000"
    var feedurl = "./rss/static_feed.json";

    d3.json(feedurl, function (feed) {
    // console.log("feed", feed);
    var items = d3.select("#content").selectAll("span.item").data(feed.articles).enter();

    var item = items.append("div").attr("class", "item");

    // title + link
    item.append("h1")
        .attr("class", "title")
        .attr("onclick","slideIt(this)")
        .html(function (d) { return d.title });

    var item_body = item.append("div").attr("class","item_body");

    // updated
    item_body.append("span").attr("class", "updated").html(function (d) { return d.updated });

    // description
    item_body.append("div").attr("class", "description").html(function (d) { return d.description });

    // excerpt
    item_body.filter(function (d) { return d.excerpt })
        .append("div").attr("class", "excerpt").html(function (d) { return d.excerpt });

    // content
    item_body.filter(function (d) { return d.content != undefined })
        .append("div").attr("class", "content").html(function (d) { return d.content });

    // enclosures
    item_body.filter(function (d) { return d.enclosures !== undefined && d.enclosures.length > 0 })
        .append("div").attr("class", "enclosures")
        .selectAll("div.enclosure")
        .data(function (d) { console.log("d", d); return d.enclosures })
        .enter()
        .append("div")
        .attr("class", "enclosure")
        .append("a")
        .attr("href", function (d) { return d.url });
        //.text(function (d) { return "enclosure: " + d.url });

    // tags
    item_body.filter(function (d) { return d.tags !== undefined && d.tags.length > 0 })
        .append("div").attr("class", "tags")
        .selectAll("span.tag")
        .data(function (d) { console.log("d", d); return d.tags })
        .enter()
        .append("span")
        .attr("class", "tag")
        .html(function (d) { return d });


        // .on("click", function (d) {
        //     d3.event.preventDefault();
        //     lightbox = lity(d.link);
        // })

	        sort();
	        $('#preloader').fadeOut('400',function(){$(this).remove();});
            $("tr").on('click', 'td', function(event) {
                console.log("clicked");
            $(this).find("a")[0].click();
            });


    });



});

$(window).load(function(){
  $("#preloader h3").circleType();
	//$('#preloader').fadeOut('slow',function(){$(this).remove();});
    setTimeout(function(){
      //  sort();
    },600);

    $("div").hover(function(){
        console.log("....");
    })

    $("#content.item h1").click(function(){
        $(this).siblings().show();
        console.log("hovered");
    })
});

$(".title").click(function(){
        alert("clicked");
})

function invert(){
    $("tbody").each(function(elem,index){
      var arr = $.makeArray($("tr",this).detach());
      arr.reverse();
        $(this).append(arr);
    })
}

function reset(){
    $(".active").removeClass("active");
    console.log("clearing …");
    $(".item").each(function(){
        $(this).fadeIn();
    })
}




/*
$("#content .item h1").hover(function(){
    $(this).next().slideDown();
})
*/

/*$("*").click(function(){
    alert($(this).prop("tagName"));
})*/









function sort(){
    var stopwords = ["cast","is","il","in","of","ce","se","and","le","les","a","qu'","-","d’","un","une","the","alors","au","aucuns","aussi","autre","avant","avec","avoir","bon","car","ce","cela","ces","ceux","chaque","ci","comme","comment","dans","de","des","du","dedans","dehors","depuis","devrait","doit","donc","dos","début","elle","elles","en","encore","essai","est","et","eu","fait","faites","fois","font","hors","ici","il","ils","je","juste","la","le","les","leur","là","ma","maintenant","mais","mes","mine","moins","mon","mot","même","ni","nommés","notre","nous","ou","où","par","parce","pas","peut","peu","plupart","pour","pourquoi","quand","que","quel","quelle","quelles","quels","qui","sa","sans","ses","seulement","si","sien","son","sont","sous","soyez	sujet","sur","ta","tandis","tellement","tels","tes","ton","tous","tout","trop","très","tu","voient","vont","votre","vous","vu","ça","étaient","état","étions","été","être"]
    var text = document.querySelector("#content").innerText.toLowerCase();

    var atLeast = 2;       // Show results with at least .. occurrences
var numWords = 5;      // Show statistics for one to .. words
var ignoreCase = true; // Case-sensitivity
var REallowedChars = /[^a-zA-Z0-9ZâÂàÀäÄçÇéÉêÊëËèÈîÎïÏìÌ$€¥—\'\’\‘\-]+/g;
 // RE pattern to select valid characters. Invalid characters are replaced with a whitespace

var i, j, k, textlen, len, s;
// Prepare key hash
var keys = [null]; //"keys[0] = null", a word boundary with length zero is empty
var results = [];
numWords++; //for human logic, we start counting at 1 instead of 0
for (i=1; i<=numWords; i++) {
    keys.push({});
}

// Remove all irrelevant characters
text = text.replace(REallowedChars, " ")
            .replace(/^\s+/,"")
            .replace(/\s+$/,"")
            .replace(/(http|ftp|https)\:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g,"");

            /*
            .replace(/à/g,"")
            .replace(/'''/g,"")
            .replace(/\-/g,"")
            .replace(/de/g,"")
            .replace(/à/g,"")
            .replace(/de/g,"")
            .replace(/de/g,"")
            .replace(/(http|ftp|https)\:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g,"")*/



// Create a hash
if (ignoreCase) text = text.toLowerCase();
text = blacklist(text,stopwords);
text = text.split(/\s+/);
for (i=0, textlen=text.length; i<textlen; i++) {
    s = text[i];
    keys[1][s] = (keys[1][s] || 0) + 1;
    for (j=2; j<=numWords; j++) {
        if(i+j <= textlen) {
            s += " " + text[i+j-1];
            keys[j][s] = (keys[j][s] || 0) + 1;
        } else break;
    }
}

// Prepares results for advanced analysis
for (var k=1; k<=numWords; k++) {
    results[k] = [];
    var key = keys[k];
    for (var i in key) {
        if(key[i] >= atLeast) results[k].push({"word":i, "count":key[i]});
    }
}

// Result parsing
var outputHTML = []; // Buffer data. This data is used to create a table using `.innerHTML`

var f_sortAscending = function(x,y) {return y.count - x.count;};
for (k=1; k<numWords && k; k++) {
    results[k].sort(f_sortAscending);//sorts results

    // Customize your output. For example:
    var words = results[k];
    //if (words.length) outputHTML.push('<td colSpan="3" class="num-words-header"><a id=\"word'+k+'\">'+k+' word'+(k==1?"":"s")+'</td>');
    for (i=0,len=words.length; i<len; i++) {

        //Characters have been validated. No fear for XSS
        outputHTML.push("<td><a href=\"#\" onclick=\"menu_sort(this)\">"+ words[i].word + "</a></td><td class=\"count\">" +
           words[i].count + "</td><td style=\"display:none\">" +
           Math.round(words[i].count/textlen*10000)/100 + "%</td>");
           // textlen defined at the top
           // The relative occurence has a precision of 2 digits.
    }
}
outputHTML = '<div id=\"menu\"><h1>&lt;erg&gt;RSS FEED&lt;&#47;erg&gt; <button onclick=\"invert()\">∆</button> <button onclick=\"reset()\">X</button> <button onclick=\"collapse()\">⚌</button></h1>' +
                /*'<a href=\"#word1\">1</a> / <a href=\"#word2\">2</a> / <a href=\"#word3\">3</a>' +*/
                '</div>' +
                '<table id="wordIndex"><thead><tr>' +
                /*'<td></td><td>Count</td><td style=\"display:none\">Relativity</td></tr>' +*/
                '</thead><tbody><tr>' +outputHTML.join("</tr><tr>")+
               "</tr></tbody></table>";
document.getElementById("RobW-sample").innerHTML = outputHTML;
}

function menu_sort(e) {
    $(".active").removeClass("active");
    var query = " "+$(e).text()+" ";
    console.log(query);
    $(".item").each(function(){
        if($(this).text().toLowerCase().match(query)){
            $(this).fadeIn();
        }
        else {
            $(this).fadeOut();
        }
    })
    $(e).parent().addClass("active");
}

function svg(){
    /*console.log("click");
    var fonts = [];
    $(".enclosure a").each(function(){
        var choppedurl =$(this).attr("href").split(".")
        if(choppedurl[choppedurl.length-1] === "svg") {
            console.log($(this).attr("href"));
            fonts.push($(this).attr("href"));
            console.log(fonts[0].split("/")[9].split(".")[0]);
        }
    })
    var newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode("\
        @font-face {\
            font-family: \"" + fonts[0].split("/")[9].split(".")[0] + "\";\
            src: url('" + fonts[0] + "#41a5de9e0909db41b19601e6f2d46517'); format('svg');\
            }\
        "));

        document.head.appendChild(newStyle);

        $("body").css({"font-family":fonts[0].split("/")[9].split(".")[0]+",cursive"});*/
}

function slideIt(e){
    console.log("……ddfksf");
    if($(e).next().hasClass("visible")){
        $(e).next().slideUp();
    }
    else {
        $(e).next().slideDown();
    }

    $(e).next().toggleClass("visible");
}

function collapse(){
    $(".item_body").slideUp();
    $(".item_body").removeClass("visible");
}

/* Work in progress, useless snippets & more */

function blacklist(text,blacklist){
    var temp_text = text;
    /*for(i=0;i<blacklist.length;i++){
        if(blacklist[i] == "-" || "qu'" || "d’"){
            temp_text = temp_text.replace(blacklist[i], "");
        }
        regexp = new RegExp("\\b"+blacklist[i]+"\\b", 'g');
        temp_text = temp_text.replace(regexp, "");
    }*/
    return temp_text;
}
