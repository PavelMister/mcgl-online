dateHelper = function(){

    this.__getDifferenceDate = function(date) {
        var now = new Date();
        var dateFromAPITimeStamp = (new Date(date)).getTime();
        var nowTimeStamp = now.getTime();
        var microSecondsDiff = Math.abs(dateFromAPITimeStamp - nowTimeStamp);
        return Math.floor(microSecondsDiff/(1000 * 60 * 60  * 24));
    };

    this.__getUtcFormat = function(date) {
        return date.replace(" ", "T") + "Z";
    };

    return{
        getUtcFormat: function(date){
            return parent.__getUtcFormat(date)
        },
        getDifferenceDate: function(date){
            return parent.__getDifferenceDate(date)
        }
    }
}();