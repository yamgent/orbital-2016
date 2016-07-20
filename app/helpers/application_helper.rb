module ApplicationHelper
  def getDay(num)
    case num
    when 0
      return "Sunday"
    when 1
      return "Monday"
    when 2
      return "Tuesday"
    when 3
      return "Wednesday"
    when 4
      return "Thursday"
    when 5
      return "Friday"
    when 6
      return "Saturday"
    end

    return "UNKNOWN_DATE"
  end

  # used by lectures/_form.html.erb and
  # tutorials/_form.html.erb. This is
  # for generating the combobox.
  def getAllDays()
    array = [];

    (0..6).each do |d|
      array.push([getDay(d), d])
    end

    return array
  end

  def getHourAndMin(dateTime)
    if dateTime.nil?
      return ""
    end

    return dateTime.strftime("%H:%M")
  end

  def getHourAndMinAsInt(dateTime)
    return dateTime.strftime("%H%M").to_i
  end
end
