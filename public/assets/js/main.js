document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar')

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid', 'list', 'googleCalendar'],

    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },

    displayEventTime: true, // don't show the time column in list view
    firstDay: 1,
    locale: 'sl',
    googleCalendarApiKey: 'AIzaSyCaqfUVCVBnZyLXUJxCEeVC_BZTgFQtjLs',
    events: '0mgck2pistmac0d690ndip21kc@group.calendar.google.com',
    //minTime: '06:00:00',
    //maxTime: '24:00:00',
    //allDaySlot: false,

    eventClick: function (arg) {
      // opens events in a popup window
      window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600')

      arg.jsEvent.preventDefault() // don't navigate in main tab
    },

    loading: function (bool) {
      document.getElementById('loading').style.display = bool ? 'block' : 'none'
    },
  })

  calendar.render()
})
