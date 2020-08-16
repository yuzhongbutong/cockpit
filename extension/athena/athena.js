var host = location.host.split(':')[0] || '9.119.96.191';
var port = 8001;

var http = cockpit.http({
    address: host,
    port: port
});


$('#btnAssetTagID').click(function() {
    var assetTag = $('#txtAssetTagID').val();
    if (!assetTag) {
        $('#errorModalID').find('#errorModalTextID').text('资产标签无效');
        $('#errorModalID').modal('show');
        return;
    }
    var path = '/modify-asset-tag';
    var params = {
        assetTag: assetTag
    };
    http.post(path, params).then(function(chunk) {
        var result = JSON.parse(chunk);
        $('#successModalID').find('#successModalTextID').text(result.msg);
        $('#successModalID').modal('show');
    }, function(error) {
        $('#errorModalID').find('#errorModalTextID').text(error);
        $('#errorModalID').modal('show');
    });
});

function getAssetTag() {
    var path = '/query-info';
    http.get(path).then(function(chunk) {
        var result = JSON.parse(chunk);
        if (result.code === 200) {
            $('#txtAssetTagID').val(result.data.assetTag);
            $('#spanRuntimeID').text(result.data.duration);
        }
    }, function(error) {
        $('#errorModalID').find('#errorModalTextID').text('Error: ' + error);
        $('#errorModalID').modal('show');
    });
}

function refreshRuntime() {
    if (!!window.EventSource) {
        var source = new EventSource('http://' + host + ':' + port + '/running-time', { withCredentials: true });
        source.addEventListener('message', function(e) {
            $('#spanRuntimeID').text(e.data);
        });
    }
}

function execCommand() {
    cockpit.spawn(["sh", "-c", "sudo dmidecode | grep 'Product Name' | head -n 1 | awk -F 'Product Name: ' '{print $2}'"])
        .then(function(data) {
            $('#spanServerModelID').text(data);
        }).catch(function(error) {
        $('#errorModalID').find('#errorModalTextID').text(error);
        $('#errorModalID').modal('show');
        });
    cockpit.spawn(["sh", "-c", "sudo dmidecode | grep 'Serial Number' | head -n 1 | awk -F 'Serial Number: ' '{print $2}'"])
        .then(function(data) {
            $('#spanSerialNumberID').text(data);
        }).catch(function(error) {
        $('#errorModalID').find('#errorModalTextID').text(error);
        $('#errorModalID').modal('show');
        });
}

$(function() {
    refreshRuntime();
    getAssetTag();
    execCommand();
});
