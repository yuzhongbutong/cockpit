var host = location.host.split(':')[0];
var port = 8001;

var http = cockpit.http({
    address: host,
    port: port,
    tls: {
        validate: false,
        certificate: {
            data: '-----BEGIN CERTIFICATE-----\nMIICRjCCAa+gAwIBAgIERREpvTANBgkqhkiG9w0BAQsFADBWMQswCQYDVQQGEwJD\nTjELMAkGA1UECBMCTE4xCzAJBgNVBAcTAkRMMRAwDgYDVQQKEwdVbmtub3duMQww\nCgYDVQQLEwNPcmcxDTALBgNVBAMTBEpvZXkwHhcNMjAwODE2MDEyNjI0WhcNMzAw\nODE0MDEyNjI0WjBWMQswCQYDVQQGEwJDTjELMAkGA1UECBMCTE4xCzAJBgNVBAcT\nAkRMMRAwDgYDVQQKEwdVbmtub3duMQwwCgYDVQQLEwNPcmcxDTALBgNVBAMTBEpv\nZXkwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAI3VgYYnk7rXySwNyVKlk9rQ\noCJBjKWkJ01cp1RtmD1vpM85PZbvQPSV5KPDisu//cPqbiv7NK+luZeXaB+/EOHm\nOZQj4c9p8onYrSwmxBGJbwnQgbpdCxfH1co5Ax5TJN3ipiSBSZWWb2S2BwsMqL3R\nZATosdg3TstuGG4jm4N5AgMBAAGjITAfMB0GA1UdDgQWBBRewD+OcYlSAchQGiDD\n2I7qsgwdDDANBgkqhkiG9w0BAQsFAAOBgQAWoWIoIHby/ymxIPLF7zmH/QQoWGn8\n5VntZKWhynbafmurEaqzZPDMpYT54T5haxcjN+X0WG351RqudVCpQHKNJjb34wSV\nYO6zxr8QvuAW8BUIFaCLtMSDVGSjRyY6wiqgFhkrYq6KvOblg7QiJ0m23lhv9Xwc\nSwhc/vBB/FOkRA==\n-----END CERTIFICATE-----'
        },
        key: {
            data: '-----BEGIN PRIVATE KEY-----\nMIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI3VgYYnk7rXySwN\nyVKlk9rQoCJBjKWkJ01cp1RtmD1vpM85PZbvQPSV5KPDisu//cPqbiv7NK+luZeX\naB+/EOHmOZQj4c9p8onYrSwmxBGJbwnQgbpdCxfH1co5Ax5TJN3ipiSBSZWWb2S2\nBwsMqL3RZATosdg3TstuGG4jm4N5AgMBAAECgYBVvHpPXh0vFMHGn47TJsP5waML\nEhSzDEe1vAxqPNWKTbKSkUdptbbOIs3TMKD2CVic1VlDvNZcVxGZUSzgA99vwvl6\nfu9oJ9U29PH3v7f8ULvd5wwRyj6N017joLey1+znsO8eY7G8Pa9+lWXRssT9c228\nE0BsRtsjiEdavmFAAQJBAOtBpK42LZDImnPETieI0ksZ3tFtpYqgm5rLWloEm/zr\nCcaKxhiqbH7KUPIaD85dP5p3KrwHOUluzQZjwC438lkCQQCaVxKpgm+n90fVIuRL\nBRhPwM71S4vJNjg8Dc3BCmBStlDQsJGR3+J6nnv0FASYuF0tjC7zM+3fxAK5uqgh\nqrYhAkA+zg+A0sXnWSaisU2MEGLT2dw6XONM1wOzl4ZPcduS8cxyTKoF+7lrP+fM\nOljt5scMHbQy7lrE1+e0RP0RWa5BAkADqhWTWLl173URJmbtMQ3Gtvky8bw75sGn\nC1zbPHfU/uckTUznfb1O0/x1axRA2/+6WR20QINhULIP3tKnGfqBAkAeL8eSGgm7\n5XNBIhArrI4DHmEagO4wgPnfchs3MjCCIeg7lGPKBXAIonAct91YKkUy2Wc39Fne\n0CulF2uoyVSs\n-----END PRIVATE KEY-----'
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
    refreshRuntime();
    getAssetTag();
    execCommand();
});
