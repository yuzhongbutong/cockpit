var host = location.host.split(':')[0];
var port = 8001;

var http = cockpit.http({
    address: host,
    port: port,
    tls: {
        validate: false,
        authority: {
            data: '-----BEGIN CERTIFICATE-----\nMIICRjCCAa+gAwIBAgIERREpvTANBgkqhkiG9w0BAQsFADBWMQswCQYDVQQGEwJD\nTjELMAkGA1UECBMCTE4xCzAJBgNVBAcTAkRMMRAwDgYDVQQKEwdVbmtub3duMQww\nCgYDVQQLEwNPcmcxDTALBgNVBAMTBEpvZXkwHhcNMjAwODE2MDEyNjI0WhcNMzAw\nODE0MDEyNjI0WjBWMQswCQYDVQQGEwJDTjELMAkGA1UECBMCTE4xCzAJBgNVBAcT\nAkRMMRAwDgYDVQQKEwdVbmtub3duMQwwCgYDVQQLEwNPcmcxDTALBgNVBAMTBEpv\nZXkwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAI3VgYYnk7rXySwNyVKlk9rQ\noCJBjKWkJ01cp1RtmD1vpM85PZbvQPSV5KPDisu//cPqbiv7NK+luZeXaB+/EOHm\nOZQj4c9p8onYrSwmxBGJbwnQgbpdCxfH1co5Ax5TJN3ipiSBSZWWb2S2BwsMqL3R\nZATosdg3TstuGG4jm4N5AgMBAAGjITAfMB0GA1UdDgQWBBRewD+OcYlSAchQGiDD\n2I7qsgwdDDANBgkqhkiG9w0BAQsFAAOBgQAWoWIoIHby/ymxIPLF7zmH/QQoWGn8\n5VntZKWhynbafmurEaqzZPDMpYT54T5haxcjN+X0WG351RqudVCpQHKNJjb34wSV\nYO6zxr8QvuAW8BUIFaCLtMSDVGSjRyY6wiqgFhkrYq6KvOblg7QiJ0m23lhv9Xwc\nSwhc/vBB/FOkRA==\n-----END CERTIFICATE-----'
        }
    }
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
        var source = new EventSource('https://' + host + ':' + port + '/running-time', { withCredentials: true });
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
    //refreshRuntime();
    //getAssetTag();
    execCommand();
});
