'use strict';
var app = angular.module('calendar_app', ['ngRoute']);

// Route providers

app.config(function($routeProvider) {
	$routeProvider

	// route for the home page
    .when('/', {
	    templateUrl : 'partials/calendarTemplate.html',
	    controller  : 'mainController',
	    controllerAs: 'mainCtrl'
    })

    .when('/dir', {
        templateUrl : 'partials/dir.html',
        controller  : 'dirController',
        controllerAs: 'dirCtrl'
    })

   .otherwise({
    	redirectTo: '/'
  })

});

app.controller("dirController", function($scope) {
        console.log("dir");
});

app.controller("mainController", function($scope, $http){

    $scope.todayEvents = [];
    $scope.CurrentDate = new Date();
    $(document).on('dblclick', '.day', function(e) {
            var pos = $(this).position();
            $('#popup-day').text($(this).attr('day-number'));
            if(pos.top - 200 < 0) {
                $('#eventToolTip').css('top', 0);
            }
            else {
                $('#eventToolTip').css('top', pos.top - 200);
            }
            $('#eventToolTip').css('left', pos.left + 360);
            $('#event-delete').hide();
            $('#event-close').show();
            $('#eventToolTip').show();
        });

    $(document).on('dblclick', '.event-sm', function(e) {
            var pos = $(this).position();
            $('#popup-day').text($(this).attr('day-number'));
            $('#eventToolTip').css('top', pos.top - 200);
            $('#eventToolTip').css('left', pos.left + 360);
            if(pos.top - 200 < 0) {
                $('#eventToolTip').css('top', 0);
            }
            else {
                $('#eventToolTip').css('top', pos.top - 200);
            }
            $('#eventName').val($(this).attr('event-name'));
            $('#eventLocation').val($(this).attr('event-location'));
            $('#eventStartTime').val($(this).attr('event-start-time'));
            $('#eventEndTime').val($(this).attr('event-end-time'));
            $('#descriptionText').val($(this).attr('event-description'));
            $('#eventId').val($(this).attr('event-id'));
            //$('#event-close').hide();
            $('#event-delete').show();
            $('#eventToolTip').show();
            e.stopPropagation();
        });

    $(document).on("click", '#event-close', function() {
            $('#eventName').val('');
            $('#eventLocation').val('');
            $('#eventStartTime').val('');
            $('#eventEndTime').val('');
            $('#all-day-check').val(0);
            $('#descriptionText').val('');
            $('#eventId').val('');
            $('#eventToolTip').hide();

        });

    $('#event-delete').click(function(ev) {
        var account_id = 'ACC12345';
        var event_id = $('#eventId').val();
        $http({
            method: 'DELETE',
            data: {}, 
            url: "http://127.0.0.1:8001/event/v1/events/" + event_id + '/', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            }).then(function successCallback(response) {
                $('#eventName').val('');
                $('#eventLocation').val('');
                $('#eventStartTime').val('');
                $('#eventEndTime').val('');
                $('#all-day-check').val(0);
                $('#descriptionText').val('');
                $('#eventToolTip').hide();
                _get_events($scope.currenStart, $scope.month, $scope);

            }, 
                function errorCallback(response) {
                console.log("Error");
            });

        });

    $('#event-save').click(function(ev) {
            // ev.preventDefault();
            var data = {};
            var account_id = 'ACC12345';
            data.event_id = $('#eventId').val();
            data.event_name = $('#eventName').val();
            data.event_location = $('#eventLocation').val();
            data.event_start_time = $('#eventStartTime').val();
            data.event_end_time = $('#eventEndTime').val();
            data.allDay = $('#all-day-check').val();
            data.description = $('#descriptionText').val();
            if (data.event_id) {
                $http({
                    method: 'PUT',
                    data: 'account_id=' + account_id + '&event_name=' + data.event_name +
                           '&event_location=' + data.event_location + '&event_start_time=' + data.event_start_time
                           + '&event_end_time=' + data.event_end_time + '&description=' + data.description, 
                    url: "http://127.0.0.1:8001/event/v1/events/" + data.event_id + '/', 
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    }).then(function successCallback(response) {
                        $('#eventName').val('');
                        $('#eventLocation').val('');
                        $('#eventStartTime').val('');
                        $('#eventEndTime').val('');
                        $('#all-day-check').val(0);
                        $('#descriptionText').val('');
                        $('#eventToolTip').hide();
                        _get_events($scope.currenStart, $scope.month, $scope);

                    }, 
                        function errorCallback(response) {
                        console.log("Error");
                });
            }
            else {
                $http({
                        method: 'POST',
                        data: 'account_id=' + account_id + '&event_name=' + data.event_name +
                               '&event_location=' + data.event_location + '&event_start_time=' + data.event_start_time
                               + '&event_end_time=' + data.event_end_time + '&description=' + data.description, 
                        url: "http://127.0.0.1:8001/event/v1/events/", 
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        }).then(function successCallback(response) {
                            $('#eventName').val('');
                            $('#eventLocation').val('');
                            $('#eventStartTime').val('');
                            $('#eventEndTime').val('');
                            $('#all-day-check').val(0);
                            $('#descriptionText').val('');
                            $('#eventToolTip').hide();
                            _get_events($scope.currenStart, $scope.month, $scope);

                        }, 
                            function errorCallback(response) {
                            console.log("Error");
                    });
            }
         });

    $('#all-day-check').click(function(ev) {
            if($(this).val() == 0) {
                $('#eventStartTime').prop("disabled", true);
                $('#eventEndTime').prop("disabled", true);
                $(this).val(1);
            }
            else if($(this).val() == 1) {
                $('#eventStartTime').prop("disabled", false);
                $('#eventEndTime').prop("disabled", false);
                $(this).val(0);
            }
            
    });
        jQuery('#eventStartTime').datetimepicker({format: 'Y-m-d H:i'});
        jQuery('#eventEndTime').datetimepicker({format: 'Y-m-d H:i'});

        $scope.curlat=0;  
        $scope.curlong=0;
        
        if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition(function (position) {
                var APP_ID = "053d85f40ebe8c098c93c4e3f48f340d";
                $scope.curlat = position.coords.latitude; 
                $scope.curlong = position.coords.longitude;
            $http({
                    method: 'GET',
                    url: "http://api.openweathermap.org/data/2.5/weather?lat=" +
                          $scope.curlat + "&lon=" + $scope.curlong + "&appid=" + APP_ID,
                    data: {},
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    }).then(function successCallback(response) {
                        var temp_max = response.data.main.temp_max-273.15;
                        var temp_min = response.data.main.temp_min-273.15;
                        if( 801 <= response.data.weather[0].id <= 804) {
                            $('.weather-info').html('<span class="weather-img"><i class="fa fa-cloud fa-3x"></i></span>' + '&nbsp &nbsp' + 
                                '<span class="temp-max">' + Math.round(temp_max) + ' &nbsp' + '</span>' + 
                                '<span class="temp-min">' + Math.round(temp_min) + '°C  &nbsp' + '</span>' + 
                                '<p class="weather-name">Cloudy</p>');
                        }
                        else if ( 200 <= response.data.weather[0].id <= 232) {
                            $('.weather-info').html('<span class="weather-img"><i class="fa fa-bolt fa-3x"></i></span>' + '&nbsp &nbsp' + 
                                '<span class="temp-max">' + Math.round(temp_max) + ' &nbsp' + '</span>' + 
                                '<span class="temp-min">' + Math.round(temp_min) + '°C  &nbsp' + '</span>' + 
                                '<p class="weather-name">Thunderstrom</p>');
                        }
                        else if( 300 <= response.data.weather[0].id <= 321 ) {
                            $('.weather-info').html('<span class="weather-img"><i class="fa fa-cloud fa-3x"></i></span>' + '&nbsp &nbsp' + 
                                '<span class="temp-max">' + Math.round(temp_max) + ' &nbsp' + '</span>' + 
                                '<span class="temp-min">' + Math.round(temp_min) + '°C  &nbsp' + '</span>' + 
                                '<p class="weather-name">Drizzle</p>');
                        }

                        else if( 500 <= response.data.weather[0].id <= 531 ) {
                            $('.weather-info').html('<span class="weather-img"><i class="fa fa-cloud fa-3x"></i></span>' + '&nbsp &nbsp' + 
                                '<span class="temp-max">' + Math.round(temp_max) + ' &nbsp' + '</span>' + 
                                '<span class="temp-min">' + Math.round(temp_min) + '°C  &nbsp' + '</span>' + 
                                '<p class="weather-name">Rain</p>');
                        }
                     else if( response.data.weather[0].id == 800 ) {
                            $('.weather-info').html('<span class="weather-img"><i class="fa fa-sun-o fa-3x"></i></span>' + '&nbsp &nbsp' + 
                                '<span class="temp-max">' + Math.round(temp_max) + ' &nbsp' + '</span>' + 
                                '<span class="temp-min">' + Math.round(temp_min) + '°C  &nbsp' + '</span>' + 
                                '<p class="weather-name">Clear</p>');
                        }
                    }, function errorCallback(response) {
                        console.log("Error");
                    });
                
                
            });
        }
        

		
		$scope.selected = undefined;
        var tempDate = $scope.selected || moment();
        $scope.currenStart = moment();
        $scope.month = tempDate.clone()
        $scope.selected = _removeTime($scope.selected || moment());
        // $scope.month = $scope.selected.clone();
        var start = tempDate.clone();
        start.date(1);
        _removeTime(start.day(0));
        //_buildMonth($scope, start, $scope.month);
         $scope.currenStart = start.clone();
        _get_events(start, $scope.month, $scope)

        $scope.select = function(day) {
            $scope.selected = day.date;  
        };

        $scope.next = function() {
            var next = $scope.month.clone();
            next.month(next.month()+1).date(1);
            next.day(0);
            $scope.month.month($scope.month.month()+1);
            $scope.currenStart = next.clone(); 
            _get_events(next, $scope.month, $scope);
        };

        $scope.previous = function() {
        	console.log("controller Previous");
            var previous = $scope.month.clone();
            _removeTime(previous.month(previous.month()-1).date(1));
            $scope.month.month($scope.month.month()-1);
            //_buildMonth($scope, previous, $scope.month);
            $scope.currenStart = previous.clone();
            _get_events(previous, $scope.month, $scope);
        };
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }
    function _pouplate_today_events(events) {

    }
    function _get_events(start, month, $scope) {
        var from_date = start.clone();
        var to_date = month.clone();
        to_date = to_date.endOf('month');
        to_date = to_date.days(6);
        from_date = from_date.hour(0).minute(0).second(0).millisecond(0);
        to_date  = to_date.hour(0).minute(0).second(0).millisecond(0);
        var account_id = 'ACC12345';
        from_date = from_date.format('YYYY-MM-DD HH:mm');
        to_date = to_date.format('YYYY-MM-DD HH:mm');
        var date_event_map = new Array();
        $http({
            method: 'GET',
            data: {}, 
            url: "http://127.0.0.1:8001/event/v1/events/?account_id=ACC12345&from_date_time=" + 
                 from_date + '&to_date_time=' + to_date, 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            }).then(function successCallback(response) {
               console.log(response.data);
               var date_event_map = new Array();
               for(var i=0; i < response.data.result.event_list.length; i++) {
                    var event = response.data.result.event_list[i];
                    event['sortField'] = moment(event.start_datetime).format('HH');
                    event['eventTime'] = moment(event.start_datetime).format('hh a');
                    var eventStartDateTime = moment(event.start_datetime);
                    var eventEndDateTime = moment(event.end_datetime);
                    event["event_start_time"] = eventStartDateTime.format('YYYY-MM-DD HH:mm');
                    event["event_end_time"] = eventEndDateTime.format('YYYY-MM-DD HH:mm');
                    while(eventStartDateTime <= eventEndDateTime) {
                        var that_day = eventStartDateTime.format('YYYY-MM-DD');
                        if(!date_event_map[that_day]) {
                            date_event_map[that_day] = new Array();
                        }
                        date_event_map[that_day].push(event);
                        eventStartDateTime.add(1, 'd');
                    }
               }
               _buildMonth($scope, start, month, date_event_map);
            }, 
                function errorCallback(response) {
                console.log("Error");
                _buildMonth($scope, start, month, date_event_map);
            });
    }

    function compare(obj1, obj2) {
        if(obj1.sortField > obj2.sortField) 
            return 1;
        else if(obj1.sortField < obj2.sortField)
            return -1;
        else
            return 0;
    }

    function _buildMonth($scope, start, month, date_event_map) {
        $scope.weeks = [];
        $scope.todayEvents = date_event_map[moment().format('YYYY-MM-DD')];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            $scope.weeks.push({ days: _buildWeek(date.clone(), month, date_event_map) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month, date_event_map) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            
            var events = [];
            if(date_event_map[date.format("YYYY-MM-DD")]) {
                events = date_event_map[date.format("YYYY-MM-DD")];
                events.sort(compare);
            }

            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                events: events.slice(0, 4)
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }

});
