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
      </div>`;

    let content = `<div id="content"></div>`;
    
    let footer = `
      <div id="footer">
        <div id="footerwrap">
          <a class="icon twitter" href="http://twitter.com/nomand"></a>
          <a class="icon github" href="http://github.com/nomand"></a>
          <a class="logo round" href="#home"></a>
          <div class="credit">Name © ${new Date().getFullYear()}</div>
        </div>
      </div>`;

    document.body.innerHTML += `<div id="view">` + header + content + footer + `</div>`;

    document.getElementById("photo").style.backgroundImage = "url('content/images/" + this.db.extract("header") + "')";
}

Object.prototype.extract = function(xml){ return this.getElementsByTagName(xml)[0].childNodes[0].nodeValue; }