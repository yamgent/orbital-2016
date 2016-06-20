var TimetablePreview = function() 
{
	if (TimetablePreview.prototype._singletonInstance) 
	{
		return TimetablePreview.prototype._singletonInstance;
	}
	TimetablePreview.prototype._singletonInstance = this;

	var _days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var _timetable = $("#timetable-preview");
	var _periods = new Array();


	this.initPeriod = function(id, day, startTime, endTime, code, name, type) 
	{
		_periods[id] = {"day" : day, 
						"startTime" : startTime, 
						"endTime" : endTime, 
						"code" : code, 
						"name" : name, 
						"type" : type,
						"isShown" : false
						};
		return this;
	};

	this.showPeriodById = function(id) 
	{
		if (_periods[id].isShown == false)
		{
			_timetable.find("#" + _days[_periods[id].day] + "-" + _periods[id].startTime).append(
				$("<div/>")
				.attr("id", "period-" + id)
				.addClass("period t" + (_periods[id].endTime - _periods[id].startTime))
				.append($("<span/>").text(_periods[id].code))
				.append($("<span/>").text(_periods[id].name))
				.append($("<span/>").text(_periods[id].type))
			);
			_periods[id].isShown = true;
		}
		return this;
	};

	this.hidePeriodById = function(id) 
	{
		if (_periods[id].isShown == true)
		{
			_timetable.find("#period-" + id).remove();
			_periods[id].isShown = false;
		}
		return this;
	};

	this.showAllPeriods = function() 
	{
		for (period in _periods)
		{
			showPeriodById(period);
		}
		return this;
	};

	this.hideAllPeriods = function() 
	{
		for (period in _periods)
		{
			hidePeriodById(period);
		}
		return this;
	};

	return this;
}