// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
var open = indexedDB.open("MyDatabase", 1);

// Create the schema
open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
    var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
};

open.onsuccess = function() {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("MyObjectStore", "readwrite");
    var store = tx.objectStore("MyObjectStore");
    var index = store.index("NameIndex");

    // Add some data
    store.put({id: 12345, name: {first: "Giuseppe", last: "Giovinco"}, age: 35});
    store.put({id: 67890, name: {first: "Giorgia", last: "Libani"}, age: 30});
    for(i=0;i<10;i++){
        let idU = Math.floor(Math.random()*10);
        let second = Math.floor(Math.random()*10);
        let firstU = window.btoa(idU);
        let lastU = window.btoa(second);
        let ageU = Math.floor(Math.random()*10);
        store.put({id:idU,name:{first:firstU,last:lastU},age:ageU});
    }
    
    // Query the data
    var getProva1 = store.get(12345);
    var getProva2 = index.get(["Libani", "Giorgia"]);

    getProva1.onsuccess = function() {
        console.log(getProva1.result.name.first);  // => "John"
    };

    getProva2.onsuccess = function() {
        console.log(getProva2.result.name.first);   // => "Bob"
    };

    // Close the db when the transaction is done
    tx.oncomplete = function() {
        db.close();
    };
}