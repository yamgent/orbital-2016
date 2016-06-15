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

  def getHourAndMin(dateTime)
    return dateTime.strftime("%H:%M")
  end

  def getHourAndMinAsInt(dateTime)
    return dateTime.strftime("%H%M").to_i
  end
end
