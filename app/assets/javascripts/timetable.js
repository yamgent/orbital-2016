var PeriodTypes = {
	TUTORIAL: 0,
	LECTURE: 1,
};

var Timetable = function()
{
	if (Timetable.prototype._singletonInstance)
	{
		return Timetable.prototype._singletonInstance;
	}
	Timetable.prototype._singletonInstance = this;

	var _days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var _types = ["TUT", "LEC"];
	var _timetable = $("#timetable");
	var _exists = new Array();
	var _numOfPeriods = 0;


/* public methods */

	// add period if it has not been added.
	// id must be unique.
	this.addPeriod = function(id, day, startTime, endTime, code, name, type)
	{
		if (_exists[id] != true)
		{
			var timeDiff = timeDiffInMins(endTime, startTime);
			var slot = _timetable.find("#" + _days[day] + "-" + startTime);
			var newDiv = $("<div/>")
				.attr("id", id)
				.attr("duration-mins", timeDiff)
				.attr("title", code + " - " + _types[type])
				.addClass(
					"period mins-" + timeDiff +
					(type == PeriodTypes.LECTURE ? " lecture" : "")
				)
				.append(
					$("<div/>")
					.addClass("inner-content")
					.append($("<span/>").text(code))
					.append($("<span/>").text(_types[type]))
				);

			// find index to insert in descending order of duration
			var i = 0;
			var siblings = slot.siblings(".period");
			if (siblings.size() > 0)
			{
				while(siblings.eq(i).attr("duration-mins") > timeDiff)
					i++;
			}

			slot.appendAtIndex(i, newDiv);
			_exists[id] = true;
			_numOfPeriods++;
		}
		return this;
	};

	// toggle styles for "hidden", "selected", "highlight"
	this.togglePeriodStyle = function(id, style, duration)
	{
		if (_exists[id] == true)
		{
			_timetable.find(".period#"+ id).stop(true, true).toggleClass(
				"style-" + style,
				typeof duration == "undefined" ? 0 : duration
			);
		}
		return this;
	};

	this.toggleShowLectureClashes = function()
	{
		// reconstruct the fillers since many cases to take care of
		// *may be improved?*
		_timetable.find(".lecture-clash").toggleClass("style-hidden", 0);
		$(".period-filler").remove();
		initPeriodFillers();
		return this;
	};

	// finalize should be called after all periods are added
	this.finalize = function()
	{
		initPeriodFillers();
		initLectureClashes();
		return this;
	};


/* private methods */

	// add fillers to correctly position periods
	var initPeriodFillers = function()
	{
		var filled = new Array();
		var numOfFilled = 0;
		var rowIteration = 0;

		// iterate multiple times, adding periods
		// that can be fitted for each row iteration
		while(numOfFilled < _numOfPeriods)
		{
			_timetable.find(".period").each(function()
			{
				var id = $(this).attr("id");

				// do not fill if it is hidden
				if ($(this).hasClass("style-hidden"))
				{
					filled[id] = true;
					numOfFilled++;
					return;
				}

				// skip if collide with current row's filler
				if ($(this).siblings(".period-filler").size() > rowIteration)
					return;

				// ok, add fillers
				if (filled[id] != true)
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
								($(this).hasClass("lecture") ? " lecture" : "")
							)
						);
					}
					filled[id] = true;
					numOfFilled++;
				}
			});
			rowIteration++;
		}
		return this;
	};

	// adds ".lecture-clash" to periods that clashes with lectures.
	// periods must be filled for this method to work.
	var initLectureClashes = function()
	{
		// get id of periods that clash with lectures
		var lectureClashes = new Array();
		$(".lecture").each(function() {
			if ($(this).siblings().size() > 0)
			{
				$(this).siblings().each(function() {
					var id = $(this).attr("id");
					lectureClashes[id] = id;
				});
			}
		});
		// now add class to the clashing periods
		for (id in lectureClashes)
		{
			$("#" + id).each(function() {
				$(this).addClass("lecture-clash");
			});
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

// enable tooltips
$(document).tooltip();

$(document).ready(function() {
	// call finalize after all periods have been added
	Timetable().finalize();
});
