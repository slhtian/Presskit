function Main()
{
    this.install = function()
    {
        this.load()
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
                    parser = new DOMParser();
                    xml = parser.parseFromString(xhttp.responseText, "text/xml");
                    new Build(xml);
                }
                else // Internet Explorer
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
    document.title = this.db.getElementsByTagName("title")[0].childNodes[0].nodeValue + ` Presskit`;

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

    let facts = `
        <p>${this.db.extract("logline")}</p>
        <h2>Website:</h2>
        <p><a href="${this.db.extract("website")}">${this.db.extract("website")}</a></p>
        <h2>Release Date</h2>
        <p>${this.db.extract("release")}</p>
        <h2>Additional Links</h2>
        <p></p>
        <h2>Price</h2>
        <p>${this.db.extract("price")}</p>
        `;

    let main = `
        <p>${this.db.extract("description")}</p>
        <h2>Team</h2>
        <p></p>
        <iframe frameborder="0" src="https://itch.io/embed/${this.db.extract("itch")}?bg_color=262626&amp;fg_color=e4e4e3&amp;link_color=e4e4e3&amp;border_color=262626&amp" width="600" height="167"></iframe>
    `;

    this.db.iterate("gallery");

    document.getElementById("photo").style.backgroundImage = "url('content/images/" + this.db.extract("header") + "')";
    document.getElementById("title").innerHTML = this.db.extract("title").toUpperCase();
    document.getElementById("sidebar").innerHTML += facts;
    document.getElementById("presentation").innerHTML += main;
}

Object.prototype.extract = function(xml){ return this.getElementsByTagName(xml)[0].childNodes[0].nodeValue; }
Object.prototype.iterate = function(xml)
{ 
    for(i in this.getElementsByTagName(xml)[0].childNodes)
    {
        console.log(this.getElementsByTagName(xml)[0].childNodes[0]);
    }
}