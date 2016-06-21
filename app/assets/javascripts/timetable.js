var Timetable = function() 
{
	if (Timetable.prototype._singletonInstance) 
	{
		return Timetable.prototype._singletonInstance;
	}
	Timetable.prototype._singletonInstance = this;

	var _days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var _timetable = $("#timetable");
	var _exists = new Array();


	this.addPeriod = function(id, day, startTime, endTime, code, name, type) 
	{
		if (_exists[id] != true)
		{
			_exists[id] = true;

			_timetable.find("#" + _days[day] + "-" + startTime).append(
				$("<div/>")
				.attr("id", "period-" + id)
				.addClass("period t" + (endTime - startTime))
				.append(
					$("<div/>")
					.addClass("inner-content")
					.append($("<span/>").text(code))
					.append($("<span/>").text(name))
					.append($("<span/>").text(type))
				)
			);
		}
		return this;
	};

	this.togglePeriodStyle = function(id, style, duration) 
	{
		if (_exists[id] == true)
		{
			_timetable.find("#period-" + id).stop(true, true).toggleClass(
				"style-" + style, 
				typeof duration == "undefined" ? 0 : duration
			);
		}
		return this;
	};

	return this;
}