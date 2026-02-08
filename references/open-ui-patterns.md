# Open UI Patterns - Oracle Courseware Style

> **🚨 MANDATORY:** All Open UI code must follow Oracle Courseware patterns - concise, interview-ready.

## Table of Contents
1. [PM-PR Separation Rule](#pm-pr-separation-rule)
2. [PM-PR Dynamic Link (Google Maps)](#pm-pr-dynamic-link-google-maps)
3. [Load External Library (Google Charts)](#load-external-library-google-charts)
4. [Check User Profile (SessionAccessService)](#check-user-profile-sessionaccessservice)
5. [Applet SlideToggle (Postload)](#applet-slidetoggle-postload)
6. [Color-Coding List Cells](#color-coding-list-cells)
7. [Confirmation Dialog (jQuery UI)](#confirmation-dialog-jquery-ui)

---

## PM-PR Separation Rule

```
PM = Logic (get data, set properties, business rules)
PR = UI (DOM manipulation, click handlers, styling)
```

| Pattern | Oracle Style |
|---------|--------------|
| **PM Init** | `this.AddMethod("ShowSelection", this.Handler, {sequence:false, scope:this})` |
| **PM Property** | `this.AddProperty("MyProperty", "")` then `this.SetProperty("MyProperty", value)` |
| **PR Binding** | `this.AttachPMBinding("MyProperty", this.Handler)` |
| **Field Value** | `this.ExecuteMethod("GetFieldValue", controls["FieldName"])` |
| **Inheritance** | `SiebelAppFacade.MyClass.superclass.Init.apply(this, arguments)` |

---

## PM-PR Dynamic Link (Google Maps)

**Use Case:** Display a link that opens Google Maps with contact address.

### Presentation Model (PM)
```javascript
CustContactFormAppletPM.prototype.Init = function () {
    SiebelAppFacade.CustContactFormAppletPM.superclass.Init.apply(this, arguments);
    this.AddMethod("ShowSelection", this.SetAddressProperty, {sequence:false, scope:this});
    this.AddProperty("AddressProperty", "");
};

CustContactFormAppletPM.prototype.SetAddressProperty = function () {
    var controls = this.Get("GetControls");
    var street = this.ExecuteMethod("GetFieldValue", controls["Personal Address"]);
    var city = this.ExecuteMethod("GetFieldValue", controls["Personal City"]);
    var state = this.ExecuteMethod("GetFieldValue", controls["Personal State"]);
    var address = street + " " + city + " " + state;
    this.SetProperty("AddressProperty", address);
};
```

### Physical Renderer (PR)
```javascript
CustContactFormAppletPR.prototype.Init = function () {
    SiebelAppFacade.CustContactFormAppletPR.superclass.Init.apply(this, arguments);
    this.AttachPMBinding("AddressProperty", this.SetUpMap);
};

CustContactFormAppletPR.prototype.BindData = function (bRefresh) {
    SiebelAppFacade.CustContactFormAppletPR.superclass.BindData.apply(this, arguments);
    
    var controls = this.GetPM().Get("GetControls");
    var addressControlName = controls["Personal Address"].GetInputName();
    var newLink = "<span id='map_link' style='color:blue;text-decoration:underline;cursor:pointer'>View on map</span>";
    
    if ($("#map_link").length === 0) {
        $("[name='" + addressControlName + "']").parent().after(newLink);
    }
};

CustContactFormAppletPR.prototype.SetUpMap = function () {
    var address = this.GetPM().Get("AddressProperty").replace(/ /g, "+");
    var URL = 'https://www.google.com/maps?t=m&q=' + address;
    
    $("#map_link").click(function () {
        window.open(URL, 'Google Map', 'width=400,height=600');
    });
};
```

---

## Load External Library (Google Charts)

**Use Case:** Display pie chart with opportunity revenue data.

```javascript
CustOppListAppletPR.prototype.ShowUI = function () {
    SiebelAppFacade.CustOppListAppletPR.superclass.ShowUI.apply(this, arguments);
    
    var markup = "<div id='mychart' style='height:250px;width:400px'></div>";
    $('#' + this.GetPM().Get("GetPlaceholder") + 'd').append(markup);
    
    var PR = this;
    require(["http://www.google.com/jsapi"], function () {
        PR.GoogleJSAPILoaded.call(PR);
    });
};

CustOppListAppletPR.prototype.GoogleJSAPILoaded = function () {
    var PR = this;
    google.load('visualization', '1', {
        'callback': PR.GoogleVisualizationPackageLoaded(PR),
        'packages': ['corechart']
    });
};

CustOppListAppletPR.prototype.GoogleVisualizationPackageLoaded = function (PR) {
    if (!google.visualization || typeof(google.visualization.DataTable) != "function") {
        setTimeout(function () { PR.GoogleVisualizationPackageLoaded(PR); }, 5);
    } else {
        PR.BindData(true);
    }
};

CustOppListAppletPR.prototype.BindData = function (bRefresh) {
    SiebelAppFacade.CustOppListAppletPR.superclass.BindData.apply(this, arguments);
    var recordSet = this.GetPM().Get("GetRecordSet");
    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Label');
    data.addColumn('number', 'Value');
    
    for (var i = 0; i < recordSet.length; i++) {
        var value = recordSet[i]["Primary Revenue Amount"];
        var numVal = Number(value.replace(/[^0-9\.]+/g, ""));
        data.addRow([recordSet[i]["Name"], {v: numVal, f: value}]);
    }
    
    var chart = new google.visualization.PieChart(document.getElementById('mychart'));
    chart.draw(data, {title: 'Opportunities Currently Displayed'});
};
```

---

## Check User Profile (SessionAccessService)

**Use Case:** Show button only for managers.

```javascript
CustOppListAppletPR.prototype.ShowUI = function () {
    SiebelAppFacade.CustOppListAppletPR.superclass.ShowUI.call(this);
    
    var inPS = SiebelApp.S_App.NewPropertySet();
    var outPS = SiebelApp.S_App.NewPropertySet();
    
    inPS.SetProperty("Name", "Is Manager");
    var service = SiebelApp.S_App.GetService("SessionAccessService");
    outPS = service.InvokeMethod("GetProfileAttr", inPS);
    
    var resultSet = outPS.GetChildByType("ResultSet");
    var returnVal = resultSet.GetProperty("Value");
    
    if (returnVal == "Y") {
        var docsButton = "<button id='docs' style='background-color:yellow;'>VIEW DOCUMENTATION</button>";
        $('#' + this.GetPM().Get("GetPlaceholder") + 'd').parent().before(docsButton);
        
        $("#docs").click(function () {
            window.open('http://oracle.com/siebel', 'Documentation', 'width=400,height=400');
        });
    }
};
```

---

## Applet SlideToggle (Postload)

**Use Case:** Collapse/expand applets on double-click.

```javascript
if (typeof(SiebelAppFacade.MyCustomPostload) == "undefined") {
    Namespace('SiebelAppFacade.MyCustomPostload');
    (function () {
        SiebelApp.EventManager.addListner("postload", OnPostload, this);
        
        function OnPostload() {
            try {
                $("[class*=applet-head]").on("dblclick", function () {
                    $(this).parent().find("[class*=content]").slideToggle();
                });
            } catch (error) {
                SiebelJS.Log("Error in postload: " + error);
            }
        }
    }());
}
```

**Manifest:** Register at Application level.

---

## Color-Coding List Cells

**Use Case:** Color-code Win Probability cells.

```javascript
CustOppListAppletPR.prototype.IdentifyProbabilities = function () {
    var recordSet = this.GetPM().Get("GetRecordSet");
    
    for (var record in recordSet) {
        var cell = $("#" + this.GetPM().Get("GetPlaceholder"))
            .find("tr[id=" + (Number(record) + 1) + "]")
            .find("td[id*=Primary_Revenue_Win_Probability]");
        
        var val = recordSet[record]["Primary Revenue Win Probability"];
        switch (val) {
            case "100%":
                cell.css("background-color", "chartreuse");
                break;
            case "0%":
                cell.css({"background-color": "red", "color": "white"});
                break;
            default:
                cell.css("background-color", "yellow");
        }
    }
};

CustOppListAppletPR.prototype.BindData = function (bRefresh) {
    SiebelAppFacade.CustOppListAppletPR.superclass.BindData.call(this, bRefresh);
    this.IdentifyProbabilities();
};
```

---

## Confirmation Dialog (jQuery UI)

**Use Case:** Show dialog when probability is 100%.

```javascript
CustOppListAppletPR.prototype.BindData = function (bRefresh) {
    SiebelAppFacade.CustOppListAppletPR.superclass.BindData.call(this, bRefresh);
    
    var probVal = this.GetPM().Get("ProbabilityValue");
    if (probVal === "100%") {
        $("<div id='dialog' title='100% Probability'>" +
          "Please verify this opportunity is certain</div>")
        .dialog({
            buttons: [
                {text: "Yes", click: function () { $(this).dialog("close"); }},
                {text: "No", click: function () {
                    alert("Please change value to less than 100%");
                    $(this).dialog("close");
                }}
            ]
        });
    }
};
```
