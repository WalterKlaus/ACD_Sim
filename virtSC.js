
$(document).ready(function() {
    var data;
    var socket = io.connect();
    socket.on('incomingCall', function (incomingCall) {
        console.log('incoming: ', incomingCall);
        chart();
    });
    socket.on('event', function (e, avgSl) {
        //console.log('event: ', e);
        $('#SL').html("current SL over all sites: " + avgSl + '% in 45 Sekunden');
        if(avgSl >= 95){
            $('#SL').css('color', 'green');
        }else{

            $('#SL').css('color', 'red');
        }
        console.log('avgSL: ', avgSl);
        chart(e);

    });

    data = [
        {
            "SITE": "Germany Muenster",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Argentina Buenos Aires",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Estonia Tallinn",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Sweden Malmo",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "India New Dehli",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "USA Seattle",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING" }
    ];
    $('#table').bootstrapTable({data : data});
    $('#table').bootstrapTable('hideLoading');
    function setData(pos,e){
        $('#table').bootstrapTable('updateRow', {
            index: pos,
            row: {
                SL              : e.serviceLevel + '%',
                TOTAL           : e.callAmount,
                VERFÜGBAR       : e.agentsCount,
                BESETZT         : e.totalBusy,
                FREI            : e.agentsVacant,
                WARTESCHLANGE   : e.totalWaiting + ' / ' + Math.round(e.avgWaitTime/1000) + ' secs',
                English         : e.agentsBusy[0].count +  ' / ' + e.callsWaiting[0].count,
                German          : e.agentsBusy[1].count +  ' / ' + e.callsWaiting[1].count,
                French          : e.agentsBusy[2].count +  ' / ' + e.callsWaiting[2].count,
                Italian         : e.agentsBusy[3].count +  ' / ' + e.callsWaiting[3].count,
                Spanish         : e.agentsBusy[4].count +  ' / ' + e.callsWaiting[4].count,
                Russian         : e.agentsBusy[5].count +  ' / ' + e.callsWaiting[5].count,
                Swedish         : e.agentsBusy[6].count +  ' / ' + e.callsWaiting[6].count
            }

        });

    };
    function chart(e) {
        var i = 0;
        e.forEach(function(err, info){
            setData(i,e[i]);
            i +=1;
        });
    };

    var canvas, ctx;
    var clockRadius = 65;

// draw functions :
    function clear() { // clear canvas function
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function drawScene() { // main drawScene function
        clear(); // clear canvas

        // get current time
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds()+1; // Der Zeit voraus!
        hours = hours > 12 ? hours - 12 : hours;
        var hour = hours + minutes / 60;
        var minute = minutes + seconds / 60;

        // save current context

$(document).ready(function() {
    var data;
    var socket = io.connect();
    $(window).on('beforeunload', function(){

        socket.emit('unloaded');
    });
    $('#adjust').val('0');
    $('#adjustDuration').val('0');
    $('#adjustHeadcount').val('0');
    $('#stopRec').hide();
    $('#download').hide();
    $('#recStartTime').hide();
    $('#adjust').on('change', function()
    {
        socket.emit('adjust', this.value);
        alert( 'Sie haben das Gesprächsaufkommen gerade auf ' + this.value + '% eingestellt. \n Bereits nach kurzer Zeit beobachten Sie schon die Auswirkungen.' );
        this.value = 0;
    });
    $('#adjustHeadcount').on('change', function()
    {
        socket.emit('adjustHeadcount', this.value);
        alert( 'Sie haben den Headcount gerade auf ' + this.value + '% eingestellt. \n Bereits nach kurzer Zeit beobachten Sie schon die Auswirkungen.' );
        this.value = 0;
    });
    $('#adjustDuration').on('change', function()
    {
        socket.emit('adjustDuration', this.value);
        alert( 'Sie haben die durschnittliche Gesprächszeit gerade auf ' + this.value + '% eingestellt. \n Bereits nach kurzer Zeit beobachten Sie schon die Auswirkungen.' );
        this.value = 0;
    });
    $('#dlLink').on('click', function () {
        $('#download').hide(1500);
    });

    var recStart;

    $('#startRec').on('click', function (){
        this.src = '../icons/red_light_Rec_But.gif';
        this.disabled = true;
        this.title = 'click the stop button to export the ACD-report';
        $('#download').hide();
        $('#stopRec').show(1000);
        $('#stopRec').prop("disabled", "");
        recStart = new Date();
        $('#recStartTime').show();
        $('#recStartTime').html('Aufzeichnung begonnen um: ' + recStart.toLocaleString());
        socket.emit('recStartedAt', recStart);
    });
    $('#stopRec').on('click', function (){
        $('#startRec').prop("disabled", "");
        $('#startRec').prop('src', '../icons/red_light_Rec_But_before.png');
        $('#startRec').title = 'click to start recording';
        $('#recStartTime').hide();
        $('#stopRec').hide(1500);
        $('#download').show(1500);
        socket.emit('recStopped');
    });

    function s2t(t){
        return parseInt(t/86400)+'d '+(new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
    }
    socket.on('event', function (e, avgSl, avgCt, tot, serverStartTime, durationUslCurr, durationUslTot, strAdjust, strAdjustDuration, strAdjustHeadcount, max, dur, aba, genCalls) {
        if(recStart != undefined){
            $('#recStartTime').html('ACD-Aufzeichnung begonnen um: \n' + recStart.toLocaleString() + '<br> Dauer: ' + s2t((new Date() - new Date(recStart))/1000));

        }
        var serverDuration = (new Date() - new Date(serverStartTime))/1000;
        $('#ServerStart').text("ACD-Simulation started at: " + serverStartTime + ' \n online for: ' + s2t(serverDuration));
        var usTfix = (((durationUslTot + durationUslCurr)/10)/serverDuration).toFixed(2);
        $('#SL').text("current SL over all sites: " + avgSl + '% in 45 Sekunden');
        if(avgSl >= 95){
            $('#USL').html('duration of last period under SL: ' + s2t(durationUslCurr/1000) + ' <br> total duration uSL: ' + s2t(durationUslTot/1000) +
                ' <br> uSL percentage of simulation runtime: ' +
                (((durationUslTot )/10)/serverDuration).toFixed(2) + '\%');
            $('#SL').css('color', 'green');
        }else{
            $('#USL').html('actual duration uSL: ' + s2t(durationUslCurr/1000) + '<br> total duration uSL: ' + s2t((durationUslTot + durationUslCurr)/1000) +
                '<br> uSL percentage of simulation runtime: ' + usTfix + '\%');
            $('#SL').css('color', 'red');
        }
        $('#callTime').text('actual average call duration: ' + avgCt + ' mins');
        //console.log('avgSL: ', avgSl);
        $('#tots').text('total available agents vs. call amount: ' + tot[0].agents + ' / ' + tot[0].amount);
        //console.log('avgSL: ', avgSl);
        $('#maxAmount').text('max: ' + max.toFixed(0));
        $('#maxDuration').text('max: ' + dur + ' mins');
        $('#abandoned').text('abandoned: ' + aba);
        $('#generatedCalls').text('generated calls: ' + genCalls);
        chart(e);

    });
    socket.on('adjust', function (strAdjust) {
        $('#adjust').val(strAdjust);

    });
    socket.on('adjustDuration', function (strAdjust) {
        $('#adjustDuration').val(strAdjust);

    });
    socket.on('adjustHeadcount', function (strAdjust) {
        $('#adjustHeadcount').val(strAdjust);

    });
    socket.on('recStartedAt', function (start) {
        this.src = '../icons/red_light_Rec_But.gif';
        this.disabled = true;
        this.title = 'click the stop button to export the ACD-report';
        $('#stopRec').show();
        $('#stopRec').prop("disabled", "");
        recStart = start;
        $('#recStartTime').show();
        $('#recStartTime').html('Aufzeichnung begonnen um: ' + start.toLocaleString());
        $('#download').hide();
    });
    socket.on('recStoppedByClient', function () {
        $('#startRec').prop("disabled", "");
        $('#startRec').prop('src', '../icons/red_light_Rec_But_before.png');
        $('#startRec').title = 'click to start recording';
        $('#recStartTime').hide();
        $('#stopRec').hide();
        $('#download').show(1500);
    });
    data = [
        {
            "SITE": "Germany, Muenster",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Argentina, Buenos Aires",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Estonia, Tallinn",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "Sweden, Malmo",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "India, Bangalore",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING"
        },
        {
            "SITE": "USA, Seattle",
            "BESETZT": "INITIALIZING",
            "FREI": "INITIALIZING",
            "WARTESCHLANGE": "INITIALIZING" }
    ];
    $('#table').bootstrapTable({data : data});
    $('#table').bootstrapTable('hideLoading');
    function setData(pos,e){
        $('#table').bootstrapTable('updateRow', {
            index: pos,
            row: {
                SL              : e.serviceLevel + '%',
                TOTAL           : e.callAmount,
                VERFÜGBAR       : e.agentsCount,
                BESETZT         : e.totalBusy,
                FREI            : e.agentsVacant,
                WARTESCHLANGE   : e.totalWaiting + ' / ' + Math.round(e.avgWaitTime/1000) + ' secs',
                English         : e.agentsBusy[0].count +  ' / ' + e.callsWaiting[0].count,
                German          : e.agentsBusy[1].count +  ' / ' + e.callsWaiting[1].count,
                French          : e.agentsBusy[2].count +  ' / ' + e.callsWaiting[2].count,
                Italian         : e.agentsBusy[3].count +  ' / ' + e.callsWaiting[3].count,
                Spanish         : e.agentsBusy[4].count +  ' / ' + e.callsWaiting[4].count,
                Russian         : e.agentsBusy[5].count +  ' / ' + e.callsWaiting[5].count,
                Swedish         : e.agentsBusy[6].count +  ' / ' + e.callsWaiting[6].count
            }

        });

    };
    function chart(e) {
        var i = 0;
        e.forEach(function(err, info){
            setData(i,e[i]);
            i +=1;
        });
    };

    var canvas, ctx;
    var clockRadius = 65;

// draw functions :
    function clear() { // clear canvas function
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function drawScene() { // main drawScene function
        clear(); // clear canvas

        // get current time
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds()+1; // Der Zeit voraus!
        hours = hours > 12 ? hours - 12 : hours;
        var hour = hours + minutes / 60;
        var minute = minutes + seconds / 60;

        // save current context
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.beginPath();

        // draw numbers
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var n = 1; n <= 12; n++) {
            var theta = (n - 3) * (Math.PI * 2) / 12;
            var x = clockRadius * Math.cos(theta);
            var y = clockRadius * Math.sin(theta);
            ctx.fillText(n, x, y);
        }

        // draw hour
        ctx.save();
        var theta = (hour - 3) * 2 * Math.PI / 12;
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(-15, -5);
        ctx.lineTo(-15, 5);
        ctx.lineTo(clockRadius * 0.5, 1);
        ctx.lineTo(clockRadius * 0.5, -1);
        ctx.fill();
        ctx.restore();

        // draw minute
        ctx.save();
        var theta = (minute - 15) * 2 * Math.PI / 60;
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(-15, -4);
        ctx.lineTo(-15, 4);
        ctx.lineTo(clockRadius * 0.8, 1);
        ctx.lineTo(clockRadius * 0.8, -1);
        ctx.fill();
        ctx.restore();

        // draw second
        ctx.save();
        var theta = (seconds - 15) * 2 * Math.PI / 60;
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(-15, -3);
        ctx.lineTo(-15, 3);
        ctx.lineTo(clockRadius * 0.9, 1);
        ctx.lineTo(clockRadius * 0.9, -1);
        ctx.fillStyle = '#400';
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }

// initialization
    $(function(){
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');


        setInterval(drawScene, 1000); // loop drawScene
    });

});

