$(document).ready(function() {
    GetLocalData("Created");
    DeleteModalActive();
    DeleteItem();
    AddOtelActive();
    ChangeItemPoint();
    ChangeFilter();
    SetTimeoutClick();
    SetOtelNameSearch();

    // for reset
    // localStorage.clear();
});

function DeleteModalActive() {
    $(".div-item-delete").click(function() {
        var selectedOtelName = $(this).prev().find(".title").text(),
            selectedOtelID = $(this).parent().parent().attr("data-item-id");

        $("[data-modal-item-id]").val(selectedOtelID);
        $("[data-modal-item-name]").text(selectedOtelName);
        $("#modalDelete").modal('show');
    });
}

function DeleteItem() {
    $("[data-modal-delete-confirm]").click(function() {
        var selectedOtelID = $("[data-modal-item-id]").val();
        $("[data-item-id='" + selectedOtelID + "']").remove();
        $("#modalDelete").modal('hide');
        RemoveFromLocalData(selectedOtelID);

        var selectedVal = $("#otelFilter").val();
        if (selectedVal == 1) {
            GetLocalData("Point", true);
        } else if (selectedVal == 2) {
            GetLocalData("Point", false);
        } else if (selectedVal == 3) {
            GetLocalData("Created", true);
        } else if (selectedVal == 4) {
            GetLocalData("Created", false);
        } else {
            GetLocalData("Created");
        }
    });
}

function AddOtelActive() {
    $("[data-modal-add-confirm]").click(function() {
        var newOtelName = $("#otelName").val();

        if (newOtelName != null) {
            newOtelName = newOtelName.trim();
        }

        if (newOtelName == "") {
            alert("Lütfen 'Otel Adı' alanını doldurun.");
            return false;
        } else {
            var newOtelID = Math.floor((Math.random() * 10000) + 1),
                newOtelPoint = 0,
                newOtelCreatedDate = new Date().getTime(),
                newOtelUpdatedDate = newOtelCreatedDate;

            HtmlHelper(newOtelID, newOtelName, newOtelPoint, newOtelCreatedDate, newOtelUpdatedDate, "prepend");

            $("[data-modal-add-confirm]").hide();
            $(".modalAddedBtn").css("display", "flex");

            var customTimeout = setTimeout(() => {
                $("#modalAdd").modal('hide');
                $("#otelName").val("");
            }, 1000);


            var customTimeout = setTimeout(() => {
                $("[data-modal-add-confirm]").show();
                $(".modalAddedBtn").hide();
            }, 1500);

            ReActivate();
            SetLocalData(newOtelID, newOtelName, newOtelPoint, newOtelCreatedDate, newOtelUpdatedDate);

            var selectedVal = $("#otelFilter").val();
            if (selectedVal == 1) {
                GetLocalData("Point", true);
            } else if (selectedVal == 2) {
                GetLocalData("Point", false);
            } else if (selectedVal == 3) {
                GetLocalData("Created", true);
            } else if (selectedVal == 4) {
                GetLocalData("Created", false);
            } else {
                GetLocalData("Created");
            }
        }

    });
}

function ChangeItemPoint() {
    $("[data-item-increase-point]").unbind("click");
    $("[data-item-increase-point]").click(function() {
        ChangeItemPointTool($(this), "increase");
    });

    $("[data-item-decrease-point]").unbind("click");
    $("[data-item-decrease-point]").click(function() {
        ChangeItemPointTool($(this), "decrease");
    });

}

function ChangeFilter() {
    $("#otelFilter").change(function() {
        var selectedVal = $(this).val();

        if (selectedVal == 1) {
            GetLocalData("Point", true);
        } else if (selectedVal == 2) {
            GetLocalData("Point", false);
        } else if (selectedVal == 3) {
            GetLocalData("Created", true);
        } else if (selectedVal == 4) {
            GetLocalData("Created", false);
        }
    });
}


/* Tools */
function GetLocalData(param, isIncrease, name) {
    $(".otel-list > .row").empty();
    var otels = JSON.parse(localStorage.getItem('otels')) || [];

    if (name == null) {
        if (param == "Point") {
            if (isIncrease) {
                otels.sort(function(a, b) {
                    return a.UpdatedDate - b.UpdatedDate;
                }).reverse();
                otels.sort(function(a, b) {
                    return a.Point - b.Point;
                });
            } else {
                otels.sort(function(a, b) {
                    return a.UpdatedDate - b.UpdatedDate;
                });
                otels.sort(function(a, b) {
                    return a.Point - b.Point;
                }).reverse();
            }
        } else if (param == "Created") {
            if (isIncrease) {
                otels.sort(function(a, b) {
                    return a.CreatedDate - b.CreatedDate;
                });
            } else {
                otels.sort(function(a, b) {
                    return a.CreatedDate - b.CreatedDate;
                }).reverse();
            }
        }
    } else {
        otels = otels.filter(x => x.Name.toLowerCase().includes(name.toLowerCase()));
    }

    if (otels.length == 0) {
        $(".no-data").css("display", "block");
        $("#otelListID").css("display", "none");
    } else {
        $(".no-data").css("display", "none");
        $("#otelListID").css("display", "block");
    }

    $('#otelListID').pagination({
        dataSource: otels,
        pageSize: 6,
        pageRange: null,
        showPageNumbers: true,
        callback: function(data, pagination) {
            $(".otel-list > .row").empty();
            for (let i = 0; i < data.length; i++) {
                const Id = data[i].Id,
                    Name = data[i].Name,
                    Point = data[i].Point,
                    CreatedDate = data[i].CreatedDate,
                    UpdatedDate = data[i].UpdatedDate;
                HtmlHelper(Id, Name, Point, CreatedDate, UpdatedDate, "append");
            }
            ReActivate();
        }
    })



    ReActivate();
}

function SetLocalData(id, name, point, createdDate, updatedDate) {
    var otels = JSON.parse(localStorage.getItem('otels')) || [],
        otel = {
            "Id": id,
            "Name": name,
            "Point": point,
            "CreatedDate": createdDate,
            "UpdatedDate": updatedDate
        };

    otels.push(otel);
    localStorage.setItem('otels', JSON.stringify(otels));
}

function HtmlHelper(id, name, point, createdDate, updatedDate, type) {
    var listDiv = $(".otel-list > .row"),
        html = `<div class="item col-12 col-lg-6" data-item-id="${id}" data-item-created-date="${createdDate}" data-item-updated-date="${updatedDate}">
                <div class="inner">
                    <div class="row">
                        <div class="col-5 left d-flex align-items-center">
                            <img src="assets/images/etstur-logo.jpg" width="100%" height="100%">
                        </div>
                        <div class="col-7 right">
                            <h3 class="title">${name}</h3>
                            <p class="point"><span>${point}</span> Puan</p>
                            <div class="item-buttons">
                                <a class="btn" data-item-increase-point="1">PUAN ARTIR</a>
                                <a class="btn" data-item-decrease-point="1">PUAN AZALT</a>
                            </div>
                        </div>
                    </div>
                    <div class="div-item-delete">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>`;

    if (type == "prepend") {
        listDiv.prepend(html);
    } else {
        listDiv.append(html);
    }

}

function ChangeItemPointTool(param, type) {
    var selectedOtelDiv = param.parent().parent().parent().parent().parent(),
        selectedOtelID = selectedOtelDiv.attr("data-item-id"),
        selectedOtelPoint = selectedOtelDiv.find(".point span").text(),
        selectedOtelName = selectedOtelDiv.find(".title").text(),
        selectedOtelCreatedDate = selectedOtelDiv.attr("data-item-created-date"),
        selectedOtelUpdatedDate = selectedOtelDiv.attr("data-item-updated-date");

    if (type == "increase") {
        selectedOtelPoint = (parseInt(selectedOtelPoint) + 1);
    } else {
        if (selectedOtelPoint == "0") {
            selectedOtelPoint = "0";
        } else {
            selectedOtelPoint = (parseInt(selectedOtelPoint) - 1);
        }
    }

    $("[data-item-id='" + selectedOtelID + "']").find(".point span").text(selectedOtelPoint);

    var otels = JSON.parse(localStorage.getItem('otels')) || [];
    localStorage.clear();
    var newUpdatedDate = new Date().getTime();
    otels = otels.filter(x => x.Id != selectedOtelID);
    otel = {
        "Id": selectedOtelID,
        "Name": selectedOtelName,
        "Point": selectedOtelPoint,
        "CreatedDate": selectedOtelCreatedDate,
        "UpdatedDate": newUpdatedDate
    };
    otels.push(otel);
    localStorage.setItem('otels', JSON.stringify(otels));
}

function RemoveFromLocalData(otelId) {
    var otels = JSON.parse(localStorage.getItem('otels')) || [];
    otels = otels.filter(x => x.Id != otelId).sort(function(a, b) { return a.Point - b.Point }).reverse();
    localStorage.setItem('otels', JSON.stringify(otels));
}


function ReActivate() {
    DeleteModalActive();
    ChangeItemPoint();
}

var customTimeoutClick = null;

function SetTimeoutClick() {
    $("[data-item-increase-point]").click(function() {

        clearTimeout(customTimeoutClick);
        customTimeoutClick = setTimeout(() => {
            console.log("executed");
        }, 3000);

    });
}

var customTimeoutInput = null;

function SetOtelNameSearch() {
    $("#filterOtelName").on("input", function() {

        clearTimeout(customTimeoutInput);
        customTimeoutInput = setTimeout(() => {
            var inputVal = $("#filterOtelName").val();
            GetLocalData("Point", false, inputVal);
        }, 1000);

    });
}