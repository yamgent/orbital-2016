class TutorialsController < ApplicationController
  before_action :authorize, :initUser

  def initUser
    @user = User.find_by(id: session[:user_id])
  end

  def view
  end

  def select
  end

  def select_save
    # process POST params
    pref = params[:preference_changes].split("_")
    pref.each do |tut_id|

      if tut_id == ""
        next
      end

      record = UserTutorialSelection.find_by(user_id: @user.id, tutorial_id: tut_id)
      # add record if not found
      if record == nil
        record = UserTutorialSelection.new(
          user_id: @user.id, 
          tutorial_id: tut_id, 
          rank: 0, 
        )
        record.save
      else  # remove record if found
        record.destroy
      end
    end

    # TODO: Failure message (if applicable)
    redirect_to tutorials_rank_url
  end

  def rank
  end

  def rank_save
    # process POST params
    pref = params[:preferences].split("_")
    rank = 1

    pref.each do |selection_id|
        record = UserTutorialSelection.find_by(id: selection_id)

        # do validation to prevent modifying
        # records that doesn't belong to user!!!
        # (This is for security reason)
        if record.user_id == @user.id
            record.rank = rank
            record.save()
            rank += 1
        end
    end

    # TODO: Failure message (if applicable)
    redirect_to tutorials_view_url
  end
end
