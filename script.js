
let getXMLFile = function (path, callback) {
    let request = new XMLHttpRequest();
    request.open("GET", path);
    request.setRequestHeader("Content-Type", "text/xml");
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(request.responseXML);
        }
    }
    request.send();
}

getXMLFile("data.xml", function (xml) {
    let json = xmlToJson(xml);
    //console.log(json.root.element);
})




function namesRun() {
    console.log("nutra");

    getXMLFile("data.xml", function (xml) {
        var table = "<tr><th>Name and Surname</th><th>Age</th><th>Balance</th></tr>";
        let json = xmlToJson(xml).root.element;
        json.forEach(element => {
            table += "<tr><td onclick=\"findCustomer(\'" + element.name + "\')\">" +
                element.name +
                "</td><td>" +
                element.age +
                "</td><td>" +
                element.balance +
                "</td></tr>";
        });
        document.getElementById("names").innerHTML = table;
    })
}


function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

function findCustomer(name) {

    getXMLFile("data.xml", function (xml) {
        var table = "<tr><th>Name and Surname</th><th>Age</th><th>Balance</th><th>Company</th><th>Email</th><th>Address</th></tr>";
        let json = xmlToJson(xml).root.element;
        const customer = json.filter(element => element.name.toLowerCase().includes(name.toLowerCase()));
        console.log(customer)
        customer.forEach(element => {
            table += "<tr><td>" +
                element.name +
                "</td><td>" +
                element.age +
                "</td><td>" +
                element.balance +
                "</td><td>" +
                element.company +
                "</td><td>" +
                element.email +
                "</td><td>" +
                element.address +
                "</td></tr>";
        });
        document.getElementById("customer").innerHTML = table;
        window.scrollBy(0, 2000)
    })
}

function search(ele) {
    if (event.key === 'Enter') {
        findCustomer(ele.value)
    }
}

function top10() {
    getXMLFile("data.xml", function (xml) {
        var table = "<tr><th>Name and Surname</th><th>Age</th><th>Balance</th><th>Company</th><th>Email</th><th>Address</th></tr>";
        let json = xmlToJson(xml).root.element;
        const customer = json.filter(element => element.name.toLowerCase().includes(name.toLowerCase()));

        var filtered = customer.sort(function (a, b) { return a.balance < b.balance ? 1 : -1; })
            .slice(0, 10);

        filtered.forEach(element => {
            table += "<tr><td>" +
                element.name +
                "</td><td>" +
                element.age +
                "</td><td>" +
                element.balance + "$" +
                "</td><td>" +
                element.company +
                "</td><td>" +
                element.email +
                "</td><td>" +
                element.address +
                "</td></tr>";
        });
        window.scrollBy(0, 2000)

        document.getElementById("customer").innerHTML = table;
    });
}
