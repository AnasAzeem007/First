//Title of the blog
var TITLE = "Betaout Blog";
//RSS url
var RSS = "http://www.betaout.com/blog/feed/";
//var RSS = "http://www.techtrouser.wordpress.com/blog/feed/";
//Stores entries
var entries = [];
var selectedEntry = "";
//var _viewCount = 10;
var pageNo = 1;
var DATADIR;
var ran;

if (navigator.onLine)
    alert('Go to Hell Online : ' + navigator.onLine);
//console.log(localStorage.getItem("entries" + pageNo));
//document.addEventListener("backbutton", handleBackButton, false);
//document.addEventListener("backbutton", function(e) {
//    e.preventDefault();
//    navigator.app.backHistory();
//    alert('Ho');
//}, true);
function alertDismissed() {
    // do something
}
window.onload = function() {
    //checkConnection();
    ran = window.localStorage.getItem('as');
    if (ran == null && !navigator.onLine) {
        alert('We need to have an active Internet connection at least for the first time');
        
    } else if (ran == null && navigator.onLine) {
        console.log("first time");
        initialize();
        window.localStorage['as'] = 1;
    } else if (ran == 1 && !navigator.onLine) {
        alert("3");
        var entry = JSON.parse(window.localStorage.getItem('page' + pageNo))        
        myFun(entry);
    }
    //checkConnection();
}

window.ononline = function() {
    console.log("online");
}
window.onoffline = function() {
    console.log("offline");
}
window.connectionerror = function() {
    console.log("connection error");
}


//listen for detail links
$(".contentLink").live("click", function() {
    selectedEntry = $(this).data("entryid");
});


function myFun(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="' + i + '">' + v.title + '</a></li>';
//alert(v.title);
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}




function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="' + i + '">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}
//Listen for Google's library to load
function initialize() {
    //console.log(window.localStorage.getItem("entries"+pageNo));
    if (navigator.onLine)
        alert('Online : ' + navigator.onLine);
    console.log('Anas ready to use google');
    var feed = new google.feeds.Feed(RSS);
    feed.setNumEntries(10);
    $.mobile.showPageLoadingMsg();
    feed.load(function(result) {
        $.mobile.hidePageLoadingMsg();
        if (!result.error) {
            entries = result.feed.entries;
            //console.log(JSON.stringify(entries));
            //alert(JSON.stringify(entries));
            myFun(entries);
            
            try {
                window.localStorage['page' + pageNo] = JSON.stringify(entries);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
                }
            }
            //console.log(window.localStorage.getItem('page' + pageNo));

            //addEntry(JSON.stringify(entries));
            renderEntries(entries);
            chkNext(pageNo);
            chkPrev(pageNo);
        } else {
            alert(result.error.message);
            console.log("Anas Error - " + result.error.message);
            alert("No More Entries :-(")
            $('.next').css({
                display: 'none'
            });


//            if (windowlocalStorage["entries"]) {
//                $("#status").html("Using cached version...");
//                entries = JSON.parse(window.localStorage["entries"]);
//                renderEntries(entries);
//                alert(entries.length);
//            } else {
//                $("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
//            }
        }
    });
}
function loadOffline() {
    //console.log(window.localStorage.getItem("entries"+pageNo));
    if (navigator.onLine)
        alert('1Online : ' + navigator.onLine);
    console.log('Anas ready to use google');
    var feed = new google.feeds.Feed(RSS);
    feed.setNumEntries(10);
    $.mobile.showPageLoadingMsg();
    feed.load(function(result) {
        $.mobile.hidePageLoadingMsg();
        if (!result.error) {
            entries = result.feed.entries;
              
            try {
                window.localStorage['page' + pageNo] = JSON.stringify(entries);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
                }
            }
            //console.log(window.localStorage.getItem('page' + pageNo));

            //addEntry(JSON.stringify(entries));
            renderEntries(entries);
            chkNext(pageNo);
            chkPrev(pageNo);
        } else {
            alert(result.error.message);
            console.log("Anas Error - " + result.error.message);
            alert("No More Entries :-(")
            $('.next').css({
                display: 'none'
            });


//            if (window.localStorage["entries"]) {
//                $("#status").html("Using cached version...");
//                entries = JSON.parse(window.localStorage["entries"]);
//                renderEntries(entries);
//                alert(entries.length);
//            } else {
//                $("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
//            }
        }
    });
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
    //Set the title
    $("h1", this).text(TITLE);
    if(navigator.onLine){
        alert('Hello');
        google.load("feeds", "1", {callback: initialize});
    }
});

$("#mainPage").live("pagebeforeshow", function(event, data) {
    if (data.prevPage.length) {
        $("h1", data.prevPage).text("");
        $("#entryText", data.prevPage).html("");
    }
    ;
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
    //Set the title
    $("h1", this).text(entries[selectedEntry].title);
    var contentHTML = "";
    contentHTML += entries[selectedEntry].content;
    contentHTML += '<p/><a href="' + entries[selectedEntry].link + '" class="fullLink" data-role="button">Read Entry on Site</a>';

    $("#entryText", this).html('<h3 class="ui-title" aria-level="1" role="heading">' + entries[selectedEntry].title + '</h3>' +
            '<p style ="font-weight:bold">' + entries[selectedEntry].author + '<p>' +
            contentHTML);
    $("#entryText .fullLink", this).button();
    setTimeout(function() {
        $('img').css({
            'height': 'auto',
            'max-width': '100%',
        })
    }, 1)

});

$(".next").live('click', function() {
    pageNo = pageNo + 1;
    if (pageNo > 1) {
        
            RSS = "http://www.betaout.com/blog/feed/?paged=" + pageNo;
            //alert(RSS);
            if(navigator.onLine){
            google.load("feeds", "1", {callback: initialize});
        } else{
            myFun(RSS);var entry = JSON.parse(window.localStorage.getItem('page' + pageNo))        
            myFun(entry);
        }
    }
})

$(".previous").live('click', function() {
    pageNo = pageNo - 1;
    //alert(pageNo);
    if (pageNo > 0) {
        RSS = "http://www.betaout.com/blog/feed/?paged=" + pageNo;
        //alert(RSS);
        google.load("feeds", "1", {callback: initialize});
    }
})

$(window).on("touchstart", ".fullLink", function(e) {
    e.preventDefault();
    window.inAppBrowser.showWebPage($(this).attr("href"));
});


function chkNext(page) {
    page = page + 1;
    var url = "http://www.betaout.com/blog/feed/?paged=" + page;
    var feedNext = new google.feeds.Feed(url);
    feedNext.load(function(resultNext) {
        var entriesNext = resultNext.feed.entries;
        if (entriesNext.length > 0) {
            $('.next').css({
                display: 'initial'
            });
            //$('.previous').css({
            //    display: 'inline'
            //});
        } else {
            $('.next').css({
                display: 'none'
            });
        }
    });
}
function chkPrev(page) {
    //page = page - 1;
    if (page == 1) {
        //alert("chk prev : "+page);
        $('.previous').css({
            display: 'none'
        });
    }
    else {
        $('.previous').css({
            display: 'initial'
        });
    }

}
function handleBackButton() {
    console.log("Back Button Pressed!");
    alert("df");

}



var db;
var openRequest = indexedDB.open("RSS", 1);

//handle setup
openRequest.onupgradeneeded = function(e) {

    console.log("running onupgradeneeded");
    var thisDb = e.target.result;

    //Create new feed
    if (!thisDb.objectStoreNames.contains("RSS")) {
        console.log("I need to make the note objectstore");
        var objectStore = thisDb.createObjectStore("RSS", {keyPath: "id", autoIncrement: true});
        objectStore.createIndex("title", "title", {unique: false});
    }
}

openRequest.onsuccess = function(e) {
    db = e.target.result;

    db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's
        // requests!
        alert("Database error: " + event.target.errorCode);
        console.dir(event.target);
    };

}

//TEMP TO REMOVE
function addEntry(xml) {

    var transaction = db.transaction(["RSS"], IDBTransaction.READ_WRITE);

    transaction.oncomplete = function(event) {
        console.log("All done!");
    };

    transaction.onerror = function(event) {
        // Don't forget to handle errors!
        console.dir(event);
    };

    var objectStore = transaction.objectStore("RSS");
//    var index = store.index("id");
//    var getReq = index.getKey(1);
    //use put versus add to always write, even if exists
    var request = objectStore.add({xml: xml});

    request.onsuccess = function(event) {
        console.log("done with insert");
    };
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.key);
            console.dir(cursor.value);
            cursor.continue();
        }
        else {
            console.log("Done with cursor");
        }
    };
}
;
