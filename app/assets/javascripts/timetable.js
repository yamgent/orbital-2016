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
	var _filled = new Array();
	var _numOfPeriods = 0;


/* public methods */

	this.addPeriod = function(id, day, startTime, endTime, code, name, type) 
	{
		if (_exists[id] != true)
		{
			var timeDiff = timeDiffInMins(endTime, startTime);

			_timetable.find("#" + _days[day] + "-" + startTime).append(
				$("<div/>")
				.attr("id", id)
				.attr("duration-mins", timeDiff)
				.addClass("period mins-" + timeDiff)
				.append(
					$("<div/>")
					.addClass("inner-content")
					.append($("<span/>").text(code))
					.append($("<span/>").text(name))
					.append($("<span/>").text(type))
				)
			);
			_exists[id] = true;
			_numOfPeriods++;
		}
		return this;
	};

	this.togglePeriodStyle = function(id, style, duration) 
	{
		if (_exists[id] == true)
		{
			_timetable.find("#" + id).stop(true, true).toggleClass(
				"style-" + style, 
				typeof duration == "undefined" ? 0 : duration
			);
		}
		return this;
	};

	// finalize to correctly position the periods
	this.finalizePeriods = function()
	{
		// iterate multiple times,
		// adding a row for those that cannot be fitted in
		var rowIteration = 0;
		var numOfFilled = 0;

		while(numOfFilled < _numOfPeriods)
		{
			_timetable.find(".period").each(function() {
				if ($(this).siblings().size() > rowIteration)
					return;		// collide, skip this iteration

				var id = $(this).attr("id");
				if (_filled[id] != true)
				{
					// dayAndTime = { day, time }
					var dayAndTime = $(this).parent().attr("id").split("-", 2);
					var duration = $(this).attr("duration-mins");
					for (i = 30; i < duration; i += 30)
					{
						_timetable
						.find("#" + dayAndTime[0] + "-" + timeAddMins(dayAndTime[1], i))
						.appendAtIndex(
							rowIteration,
							$("<div/>")
							.attr("id", id)
							.addClass(
								"period-filler" + 
								($(this).hasClass("style-selected") ? " style-selected" : "")
							)
						);
					}
					_filled[id] = true;
					numOfFilled++;
				}
			});
			rowIteration++;
		}
		return this;
	};


/* helper functions */

	// time diff by military time integers (eg. 1430)
	var timeDiffInMins = function(t1, t2)
	{
		// convert hours to mins and add the mins
		t1 = (Math.floor(t1 / 100) * 60) + (t1 % 100);
		t2 = (Math.floor(t2 / 100) * 60) + (t2 % 100);
		return Math.abs(t1 - t2);
	};

	// add mins to military time integer
	var timeAddMins = function(time, add)
	{
		// convert time to mins, add, and convert back
		time = (Math.floor(time / 100) * 60) + (time % 100);
		time += add;
		time = (Math.floor(time / 60) * 100) + (time % 60);
		return time;
	};

	$.fn.appendAtIndex = function(i, content)
	{
		if (i === 0)
			return $(this).prepend(content);
		return $(this).children().eq(i-1).after(content);
	};


	return this;
}

$(window).load(function() {
	// must be called AFTER all periods have been added
	Timetable().finalizePeriods();
});