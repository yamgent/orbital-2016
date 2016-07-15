var PeriodTypes = {
	LECTURE: 0,
	TUTORIAL: 1,
	TUTORIAL_ODD: 2,
	TUTORIAL_EVEN: 3,
};

var Timetable = function()
{
	if (Timetable.prototype._singletonInstance)
	{
		return Timetable.prototype._singletonInstance;
	}
	Timetable.prototype._singletonInstance = this;

	var _days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var _types = ["LEC", "TUT", "TUT", "TUT"];


/* initialization */

	var _periods = new Array();
	var _timetable = $("#timetable");
	var _newRowSrc = $("#timetable tbody tr").first().clone();
	_newRowSrc.find("th").remove();


/* public methods */

	// id is unique, may be called multiple times to set values
	// must initPeriod for showPeriod to work
	this.initPeriod = function(id, day, startTime, endTime, code, name, type, groupNum,
							day2, startTime2, endTime2)
	{
		if (_periods[id] === undefined)
		{
			_periods[id] = new Array();
			_periods[id].isShowing = false;			// flag whether the DOM is added
			_periods[id].hasLectureClash = false;	// flag whether clashes with a lecture time
			_periods[id].div = null;				// points to the DOM element
			_periods[id].div2 = null;				// points to the second DOM element
		}

		// setters
		_periods[id].day = day;
		_periods[id].startTime = startTime;
		_periods[id].endTime = endTime;
		_periods[id].code = code;
		_periods[id].name = name;
		_periods[id].type = type;
		_periods[id].groupNum = groupNum;

		_periods[id].day2 = day2;
		_periods[id].startTime2 = startTime2;
		_periods[id].endTime2 = endTime2;

		// computed vars
		_periods[id].duration = timeDiffInMins(endTime, startTime);
		_periods[id].numOfSlots = Math.ceil(_periods[id].duration / 30);

		_periods[id].hasSecondPeriod = (day2 !== undefined);
		_periods[id].duration2 = timeDiffInMins(endTime2, startTime2);
		_periods[id].numOfSlots2 = Math.ceil(_periods[id].duration2 / 30);

		return this;
	};

	this.showPeriod = function(id)
	{
		if (!_periods[id].isShowing)
		{
			_periods[id].div = addPeriodDiv(
				id, 
				_periods[id].day, 
				_periods[id].startTime, 
				_periods[id].endTime, 
				_periods[id].duration, 
				_periods[id].numOfSlots
			);
			if (_periods[id].hasSecondPeriod)
			{
				_periods[id].div2 = addPeriodDiv(
					id, 
					_periods[id].day2, 
					_periods[id].startTime2, 
					_periods[id].endTime2, 
					_periods[id].duration2, 
					_periods[id].numOfSlots2
				);
			}
			_periods[id].isShowing = true;
		}

		if (_periods[id].hasLectureClash)
		{
			addPeriodStyle(id, "clash", 0);
		}

		return this;
	};

	// removes the DOM from the timetable
	this.hidePeriod = function(id)
	{
		if (_periods[id].isShowing)
		{
			removePeriodDiv(id, _periods[id].div, _periods[id].numOfSlots);
			if (_periods[id].hasSecondPeriod)
				removePeriodDiv(id, _periods[id].div2, _periods[id].numOfSlots2);

			_periods[id].div = null;
			_periods[id].div2 = null;
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
				_periods[id].div.stop(true, true).addClass(style, duration);

			if (_periods[id].hasSecondPeriod)
			{
				if (!_periods[id].div2.hasClass(style))
					_periods[id].div2.stop(true, true).addClass(style, duration);
			}
		}
		return this;
	};

	this.removePeriodStyle = function(id, style, duration)
	{
		if (_periods[id].isShowing)
		{
			_periods[id].div.stop(true, true).removeClass(style, duration);
			if (_periods[id].hasSecondPeriod)
			{
				_periods[id].div2.stop(true, true).removeClass(style, duration);
			}
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
					if (_periods[id].hasLectureClash)
						clashIds[clashIds.length] = id;
				}
				else
				{
					// show and hide instantly to check for clash
					showPeriod(id);
					if (_periods[id].hasLectureClash)
						clashIds[clashIds.length] = id;
					hidePeriod(id);
				}
			}
		}
		return clashIds;
	};


/* private methods */

	// adds the DOM to the timetable
	var addPeriodDiv = function(id, day, startTime, endTime, duration, numOfSlots)
	{
		// to get the required slots
		// while checking for clashes
		var slots = new Array();
		var rowIndex = 0;
		var totalRows = _timetable.find("#" + _days[day]).children().length;

		// find empty slots else
		// go to next row and try again
		var hasClashes = true;
		while (hasClashes)
		{
			hasClashes = false;
			slots[0] = _timetable.find(
				"#" + _days[day] +
				" #row-" + rowIndex +
				" #time-" + startTime
			);

			for (i = 0; i < numOfSlots; i++)
			{
				if (i > 0)
					slots[i] = slots[i - 1].next();

				if (slots[i].children().length > 0)
				{
					if (slots[i].children(":first").hasClass("lecture"))
						_periods[id].hasLectureClash = true;

					rowIndex++;
					if (rowIndex >= totalRows)
						addRow(day);

					hasClashes = true;
					break;	// break from inner for-loop
				}
			}
			// loop again if hasClashes
		}

		// setup the tooltip
		var tooltip_content = _periods[id].code + " - " + _types[_periods[id].type];
		if (_periods[id].groupNum != "")
		{
			tooltip_content += " (" + _periods[id].groupNum + ")";
		}
		if (_periods[id].type == PeriodTypes.TUTORIAL_ODD)
		{
			tooltip_content += " [Odd]";
		}
		else if (_periods[id].type == PeriodTypes.TUTORIAL_EVEN)
		{
			tooltip_content += " [Even]";
		}

		// now we have the empty slots, add period div
		var newDiv = $("<div/>")
			.attr("id", id)
			.attr("title", tooltip_content)
			.addClass(
				"period mins-" + duration +
				(_periods[id].type == PeriodTypes.LECTURE ? " lecture" : "")
			)
			.append(
				$("<div/>")
				.addClass("inner-content")
				.append($("<span/>").text(_periods[id].code))
				.append($("<span/>").text(_types[_periods[id].type]))
				.append($("<span/>").text(_periods[id].groupNum))
				.append(_periods[id].type == PeriodTypes.TUTORIAL_ODD ? $("<span/>").text("[Odd]") : "")
				.append(_periods[id].type == PeriodTypes.TUTORIAL_EVEN ? $("<span/>").text("[Even]") : "")
			);
		slots[0].append(newDiv);

		// and add period filler
		for (i = 1; i < numOfSlots; i++)
		{
			slots[i].append($("<div/>").addClass(
				"period-filler" +
				(_periods[id].type == PeriodTypes.LECTURE ? " lecture" : "")
			));
		}

		// store numofperiods in tablerow DOM
		var tablerow = _timetable.find("#" + _days[day] + " #row-" + rowIndex);
		tablerow.attr("numofperiods", parseInt(tablerow.attr("numofperiods")) + 1);

		return newDiv;
	};

	var removePeriodDiv = function(id, div, numOfSlots)
	{
		// delete it and its fillers
		var currentSlot = div.parent();
		for (i = 0; i < numOfSlots; i++)
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
	};

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

	var timetable = $("#timetable-preview");
	var extra_space = $("#mobile-timetable-space");

	if (mobile)
	{
		// stick the timetable to the bottom of the window
		timetable.addClass("footer navbar-fixed-bottom");

		// must ensure that we create enough space for the
		// timetable itself (since it is fixed at the bottom,
		// it is no longer taking up spaces in the page and
		// will cover up content on the page)
		extra_space.height(timetable.height());
	}
	else
	{
		timetable.removeClass("footer navbar-fixed-bottom");
		extra_space.height(0);
	}
}

function getTimetableToggle()
{
	return (Cookies.get('timetable-toggle') == "true");
}

function setTimetableToggle(newValue)
{
	Cookies.set('timetable-toggle', newValue);
}

// if it is not defined before, the default should be true (= show)
function initDefault_TimetableToggle()
{
	// null means this cookie is never set before
	if (Cookies.get('timetable-toggle') == null)
	{
		setTimetableToggle(true);
	}
}

// allow user to hide timetable
function updateTimetableVisibility()
{
	var show_timetable = getTimetableToggle();

	var column_main_content = $(".main-content");
	var column_timetable_preview = $("#timetable-preview");

	if (show_timetable)
	{
		$("#timetable").stop(true, true).show("fast");

		// restore timetable size
		column_timetable_preview.removeClass("col-md-2");
		column_timetable_preview.addClass("col-md-6");

		// make space for timetable column
		column_main_content.removeClass("col-md-10");
		column_main_content.addClass("col-md-6");
	}
	else
	{
		$("#timetable").stop(true, true).hide("fast");

		// shrink the timetable column
		column_timetable_preview.removeClass("col-md-6");
		column_timetable_preview.addClass("col-md-2");

		// expand the main content
		column_main_content.removeClass("col-md-6");
		column_main_content.addClass("col-md-10");
	}
}

$(document).ready(function() {
	// if it is not defined before, the default should be true (= show)
	initDefault_TimetableToggle();

	// update the checkbox to reflect cookie settings
	$("#timetable-toggle").prop( "checked", getTimetableToggle());

	windowResized();
	updateTimetableVisibility();


	$(window).resize(function() {
		windowResized();
	});

	$("#timetable-toggle").on("click", function()
	{
		var isChecked = $("#timetable-toggle").is(":checked");

		// make our settings permanent across the different views
		// with the help of the cookies
		setTimetableToggle(isChecked);

		updateTimetableVisibility();
	});
});
