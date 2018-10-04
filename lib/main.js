function Main()
{
    this.install = function()
    {
        this.load()

        let header = `
        <div id="header">
            <div id="photo"></div>
            <div id="title"></div>
        </div>`;

        let content = `
            <div id="content">
                <div id="sidebar"></div>
                <div id="presentation"></div>
            </div>`;
        
        let footer = `
        <div id="footer">
            <div id="footerwrap">
            <div class="credit">Name © ${new Date().getFullYear()}</div>
            </div>
        </div>`;

        document.body.innerHTML += `<div id="view">` + header + content + footer + `</div>`;
    }

    this.load = function()
    {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
            {
                if (window.DOMParser)
                {
                    new Build(new DOMParser().parseFromString(xhttp.responseText, "text/xml"));
                }
                else // IE
                {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = false;
                    xml.loadXML(xhttp.responseText);
                    new Build(xml);
                }
            }
        };

        xhttp.open("GET", "lib/db.xml", true);
        xhttp.send();
    }
}

function Build(db)
{
    this.db = db;

    let test = parseXml(db);
    console.log(test)
    
    document.title = this.db.getElementsByTagName("title")[0].childNodes[0].nodeValue + ` Presskit`;

    let facts = `
        <h2>Website:</h2>
        <p><a href="http://${this.db.extract("website")}">${this.db.extract("website")}</a></p>
        <h2>Release Date</h2>
        <p>${this.db.extract("release")}</p>
        <h2>Additional Links</h2>
        <p></p>
        <h2>Price</h2>
        <p>${this.db.extract("price")}</p>
        <h2>Platforms</h2>
        <p></p>
        `;

    let main = `
        <p>${this.db.extract("logline")}</p>
        <p>${this.db.extract("description")}</p>
        <iframe frameborder="0" src="https://itch.io/embed/${this.db.extract("itch")}?bg_color=262626&amp;fg_color=e4e4e3&amp;link_color=e4e4e3&amp;border_color=262626&amp" width="600" height="167"></iframe>
    `;

    let trailers = `
        <h2>Trailers</h2>
        <iframe width="100%" height="450" src="https://www.youtube.com/embed/${this.db.extract("trailer")}?rel=0" style="max-width:800px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;

    let screenshots = `
        <h2>Screenshots</h2>
    `;

    let team = `
        <h2>Team</h2>
    `;
    

    document.getElementById("photo").style.backgroundImage = "url('content/images/" + this.db.extract("header") + "')";
    document.getElementById("title").innerHTML = this.db.extract("title").toUpperCase();
    document.getElementById("sidebar").innerHTML += facts;
    document.getElementById("presentation").innerHTML += main + trailers + screenshots + team;

}

Object.prototype.extract = function(xml){ return this.getElementsByTagName(xml)[0].childNodes[0].nodeValue; }
Object.prototype.lookup = function(obj, term){ return obj["Game"][term]["value"]; }

function parseXml(xml, arrayTags)
{
    let dom = xml;

    function isArray(o){ return Object.prototype.toString.apply(o) === '[object Array]'; }

    function parseNode(xmlNode, result)
    {
        if (xmlNode.nodeName == "#text"){
            if (xmlNode.nodeValue.trim()) { result['value'] = xmlNode.nodeValue; }
            return;
        }

        let jsonNode = {};
        let existing = result[xmlNode.nodeName];
        if(existing)
        {
            if(!isArray(existing))
                result[xmlNode.nodeName] = [existing, jsonNode];
            else
                result[xmlNode.nodeName].push(jsonNode);
        }
        else
        {
            if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1)
                result[xmlNode.nodeName] = [jsonNode];
            else
                result[xmlNode.nodeName] = jsonNode;
        }

        if(xmlNode.attributes){
            for(var i = 0; i < xmlNode.attributes.length; i++){
                jsonNode[xmlNode.attributes[i].nodeName] = xmlNode.attributes[i].nodeValue;
            }
        }

        for(i = 0; i < xmlNode.childNodes.length; i++){
            parseNode(xmlNode.childNodes[i], jsonNode);
        }
    }

    var result = {};
    if(dom.childNodes.length){ parseNode(dom.childNodes[0], result); }

    return result;
}