let Util = {
    getTodayMill : function () {
        let date = new Date();

        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);
        let milliseconds = ("0" + date.getMilliseconds()).slice(-3);

        return year + month + day + hours + minutes + seconds + milliseconds;
    },

    getToday : function () {
        let date = new Date();

        let year = date.getFullYear() + "";
        year = year.substring(2,4);
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        return year + month + day + hours + minutes + seconds;
    },

    getYMD : function (gap, fr) {
        let date = new Date();
        if ( gap > 0 ) {
            date = new Date(date.setMonth(date.getMonth() - gap));
        }
        let year = date.getFullYear() + "";
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        return year + fr + month + fr + day;
    },
}
