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


/* initialization */

	var _periods = new Array();
	var _timetable = $("#timetable");
	var _newRowSrc = $("#timetable tbody tr").first().clone();
	_newRowSrc.find("th").remove();


/* public methods */

	// id is unique, may be called multiple times to set values
	// must initPeriod for showPeriod to work
	this.initPeriod = function(id, day, startTime, endTime, code, name, type, groupNum)
	{
		if (_periods[id] === undefined)
		{
			_periods[id] = new Array();
			_periods[id].isShowing = false;	// flag whether the DOM is added
			_periods[id].div = null;		// points to the DOM element
		}

		// setters
		_periods[id].day = day;
		_periods[id].startTime = startTime;
		_periods[id].endTime = endTime;
		_periods[id].code = code;
		_periods[id].name = name;
		_periods[id].type = type;
		_periods[id].groupNum = groupNum;

		// computed vars
		_periods[id].duration = timeDiffInMins(_periods[id].endTime, _periods[id].startTime);
		_periods[id].numOfSlots = Math.ceil(_periods[id].duration / 30);

		return this;
	};

	// adds the DOM to the timetable
	this.showPeriod = function(id)
	{
		if (!_periods[id].isShowing)
		{
			// to get the required slots
			// while checking for clashes
			var slots = new Array();
			var rowIndex = 0;
			var totalRows = _timetable.find("#" + _days[_periods[id].day]).children().length;

			// find empty slots else
			// go to next row and try again
			var hasClashes = true;
			var hasLectureClash = false;
			while (hasClashes)
			{
				hasClashes = false;
				slots[0] = _timetable.find(
					"#" + _days[_periods[id].day] +
					" #row-" + rowIndex +
					" #time-" + _periods[id].startTime
				);

				for (i = 0; i < _periods[id].numOfSlots; i++)
				{
					if (i > 0)
						slots[i] = slots[i - 1].next();

					if (slots[i].children().length > 0)
					{
						if (slots[i].children(":first").hasClass("lecture"))
							hasLectureClash = true;

						rowIndex++;
						if (rowIndex >= totalRows)
							addRow(_periods[id].day);

						hasClashes = true;
						break;	// break from inner for-loop
					}
				}
				// loop again if hasClashes
			}

			// now we have the empty slots, add period div
			_periods[id].div = $("<div/>")
				.attr("id", id)
				.attr("title", 	_periods[id].code + " - " +
								_types[_periods[id].type] + " (" +
								_periods[id].groupNum + ")")
				.addClass(
					"period mins-" + _periods[id].duration +
					(_periods[id].type == PeriodTypes.LECTURE ? " lecture" : "") +
					(hasLectureClash ? " clash" : "")
				)
				.append(
					$("<div/>")
					.addClass("inner-content")
					.append($("<span/>").text(_periods[id].code))
					.append($("<span/>").text(_types[_periods[id].type]))
					.append($("<span/>").text(_periods[id].groupNum))
				);
			slots[0].append(_periods[id].div);

			// and add period filler
			for (i = 1; i < _periods[id].numOfSlots; i++)
			{
				slots[i].append($("<div/>").addClass(
					"period-filler" +
					(_periods[id].type == PeriodTypes.LECTURE ? " lecture" : "")
				));
			}

			// store numofperiods in tablerow DOM
			var tablerow = _timetable.find("#" + _days[_periods[id].day] + " #row-" + rowIndex);
			tablerow.attr("numofperiods", parseInt(tablerow.attr("numofperiods")) + 1);
			_periods[id].isShowing = true;
		}
		return this;
	};

	// removes the DOM from the timetable
	this.hidePeriod = function(id)
	{
		if (_periods[id].isShowing)
		{
			// delete it and its fillers
			var currentSlot = _periods[id].div.parent();
			for (i = 0; i < _periods[id].numOfSlots; i++)
			{
				currentSlot.empty();
				currentSlot = currentSlot.next();
			}

			// update numofperiods, remove additional row if empty
			var tablerow = currentSlot.parent();
			var newNumOfPeriods = parseInt(tablerow.attr("numofperiods")) - 1;

			if (newNumOfPeriods <= 0 && tablerow.siblings().length > 0)
				removeRow(_periods[id].day, tablerow.attr("id").split("-")[1]);
			else
				tablerow.attr("numofperiods", newNumOfPeriods);

			_periods[id].div = null;
			_periods[id].isShowing = false;
		}
		return this;
	};

	this.toggleShowPeriod = function(id)
	{
		if (_periods[id].isShowing)
			hidePeriod(id);
		else
			showPeriod(id);
		return this;
	};

	this.addPeriodStyle = function(id, style, duration)
	{
		if (_periods[id].isShowing)
		{
			if (!_periods[id].div.hasClass(style))
			{
				_periods[id].div.stop(true, true).addClass(style, duration);
			}
		}
		return this;
	};

	this.removePeriodStyle = function(id, style, duration)
	{
		if (_periods[id].isShowing)
		{
			_periods[id].div.stop(true, true).removeClass(style, duration);
		}
		return this;
	};

	this.togglePeriodStyle = function(id, style, duration)
	{
		if (_periods[id].isShowing)
		{
			_timetable.find(".period#" + id).stop(true, true).toggleClass(style, duration);
		}
		return this;
	};

	// special function used to get all ids
	// which clashes with currently shown lectures
	this.getLectureClashIds = function()
	{
		var clashIds = new Array();

		for(id in _periods)
		{
			if (id[0] != "l")	// e.g. #lecture-0
			{
				if (_periods[id].isShowing)
				{
					if (_periods[id].div.hasClass("clash"))
						clashIds[clashIds.length] = id;
				}
				else
				{
					// show and hide instantly to check for clash
					showPeriod(id);
					if (_periods[id].div.hasClass("clash"))
						clashIds[clashIds.length] = id;
					hidePeriod(id);
				}
			}
		}
		return clashIds;
	};


/* private methods */

	var addRow = function(day)
	{
		var tbody = _timetable.find("tbody#"+_days[day]);
		var rowCount = tbody.children().length;
		tbody.append(_newRowSrc.clone().attr("id", "row-" + rowCount));
	};

	var removeRow = function(day, row)
	{
		var tbody = _timetable.find("tbody#"+_days[day]);

		// take the th if row-0 is being removed
		if (row == 0)
		{
			var th = tbody.find("#row-0 th");
			tbody.find("#row-1").prepend(th);
		}

		var rowCount = tbody.children().length;
		tbody.find("#row-" + row).remove();

		// re-number the row ids
		for (i = parseInt(row) + 1; i < rowCount; i++)
		{
			tbody.find("#row-" + i).attr("id", "row-" + (i - 1));
		}
	};

	// time diff by military time integers (eg. 1430)
	var timeDiffInMins = function(t1, t2)
	{
		// convert hours to mins and add the mins
		t1 = (Math.floor(t1 / 100) * 60) + (t1 % 100);
		t2 = (Math.floor(t2 / 100) * 60) + (t2 % 100);
		return Math.abs(t1 - t2);
	};

	return this;
}

// enable tooltips
$(document).tooltip();

// if our window resized:
//	- desktop: timetable should show on the right
//	- mobile: timetable should stick at the bottom
function windowResized()
{
	// mobile when width < 768
	const MOBILE_MAX_WIDTH = 768;
	var mobile = false;

	if ($(window).width() < MOBILE_MAX_WIDTH)
	{
		mobile = true;
	}

	if (mobile)
	{
		$("#timetable-preview").addClass("footer navbar-fixed-bottom");
	}
	else
	{
		$("#timetable-preview").removeClass("footer navbar-fixed-bottom");
	}
}

$(document).ready(function() {
	windowResized();

	$(window).resize(function() {
		windowResized();

	});
});
